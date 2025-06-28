// Merged Task Service with Background Sync, Cache, and Additional Features

import { saveTaskOffline } from '../utils/indexedDb'

const API_BASE_URL = 'https://hackdemo-backend.onrender.com/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || response.statusText;
    throw new Error(errorMessage);
  }

  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    const jsonResponse = await response.json();
    console.log('Response JSON:', jsonResponse);
    return jsonResponse;
  }

  return true;
};

const getHeaders = () => ({
  'Content-Type': 'application/json',
});

const CACHE_DURATION = 6000;

const taskService = {
  _cache: {
    allTasks: {
      data: null,
      timestamp: null
    },
    taskById: {}
  },

  _isCacheValid(cacheEntry) {
    return (
      cacheEntry?.data &&
      cacheEntry?.timestamp &&
      (new Date() - cacheEntry.timestamp) < CACHE_DURATION
    );
  },

  invalidateCache(taskId) {
    if (taskId) {
      console.log(`🗑️ Invalidating cache for task ${taskId}`);
      if (this._cache.taskById[taskId]) {
        this._cache.taskById[taskId] = { data: null, timestamp: null };
      }
    } else {
      console.log('🗑️ Invalidating all task cache');
      this._cache.allTasks = { data: null, timestamp: null };
      this._cache.taskById = {};
    }
  },

  getAllTasks: async () => {
    try {
      if (taskService._isCacheValid(taskService._cache.allTasks)) {
        console.log('Using cached tasks data');
        return taskService._cache.allTasks.data;
      }

      console.log('📡 Fetching fresh tasks data from API');
      const response = await fetch(`${API_BASE_URL}/task/getall`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include'
      });

      const responseData = await handleResponse(response);
      const tasksData = responseData?.tasks ?? [];

      taskService._cache.allTasks = {
        data: tasksData,
        timestamp: new Date()
      };

      return tasksData;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  getTaskById: async (taskId) => {
    try {
      const cacheEntry = taskService._cache.taskById[taskId];
      if (taskService._isCacheValid(cacheEntry)) {
        console.log(`🔄 Using cached data for task ${taskId}`);
        return cacheEntry.data;
      }

      console.log(`📡 Fetching fresh data for task ${taskId}`);
      const response = await fetch(`${API_BASE_URL}/task/get/${taskId}`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include'
      });

      const taskData = await handleResponse(response);

      taskService._cache.taskById[taskId] = {
        data: taskData,
        timestamp: new Date()
      };

      return taskData;
    } catch (error) {
      console.error(`Error fetching task ${taskId}:`, error);
      throw error;
    }
  },

  createTask: async (taskData) => {
    try {
      if (!navigator.onLine) {
        console.log('📴 Offline: Saving task locally and registering sync');
        await saveTaskOffline(taskData);

        if ('serviceWorker' in navigator && 'SyncManager' in window) {
          navigator.serviceWorker.ready.then(function (swRegistration) {
            console.log('📢 Sync event registered');
            return swRegistration.sync.register('sync-tasks');
          }).catch(function (err) {
            console.error('❌ Sync registration failed:', err);
          });
        } else {
          console.warn('❌ Background sync not supported');
        }

        return { message: 'Task saved locally. It will sync when back online.' };
      }

      const response = await fetch(`${API_BASE_URL}/task/add`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify(taskData)
      });

      const newTask = await handleResponse(response);
      taskService.invalidateCache();

      return newTask;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  updateTask: async (taskId, taskData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/task/update/${taskId}`, {
        method: 'PATCH',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify(taskData)
      });

      const updatedTask = await handleResponse(response);

      taskService.invalidateCache(taskId);
      taskService.invalidateCache();

      return updatedTask;
    } catch (error) {
      console.error(`Error updating task ${taskId}:`, error);
      throw error;
    }
  },

  toggleTaskCompletion: async (taskId, isCompleted) => {
    try {
      const taskData = { isCompleted: isCompleted };

      const response = await fetch(`${API_BASE_URL}/task/updateStatus/${taskId}`, {
        method: 'PATCH',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify(taskData)
      });

      const updatedTask = await handleResponse(response);

      taskService.invalidateCache(taskId);
      taskService.invalidateCache();

      return updatedTask;
    } catch (error) {
      console.error(`Error toggling completion for task ${taskId}:`, error);
      throw error;
    }
  },

  deleteTask: async (taskId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/task/delete/${taskId}`, {
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include'
      });

      const result = await handleResponse(response);

      taskService.invalidateCache(taskId);
      taskService.invalidateCache();

      return result;
    } catch (error) {
      console.error(`Error deleting task ${taskId}:`, error);
      throw error;
    }
  },

  getSuggestions: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/task/suggestions`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include'
      });
      const suggestions = await handleResponse(response);
      return suggestions;
    } catch (error) {
      console.error('Error fetching task suggestions:', error);
      throw error;
    }
  }
};

export default taskService;
