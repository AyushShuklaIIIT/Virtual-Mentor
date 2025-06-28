const API_BASE_URL = 'https://hackdemo-backend.onrender.com/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || response.statusText;
    throw new Error(errorMessage);
  }
  
  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    const jsonResponse = await response.json().tasks;
    console.log('Response JSON:', jsonResponse);
    return jsonResponse;
  }
  
  return true; // For successful requests with no content
};

const getHeaders = () => ({
  'Content-Type': 'application/json',
});

const taskService = {
  getAllTasks: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/task/getall`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include' // Important: include cookies in the request
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },
  
  getTaskById: async (taskId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/task/get/${taskId}`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include'
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error fetching task ${taskId}:`, error);
      throw error;
    }
  },
  
  // Create a new task
  createTask: async (taskData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/task/add`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify(taskData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },
  
  // Update an existing task
  updateTask: async (taskId, taskData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/task/update/${taskId}`, {
        method: 'PATCH',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify(taskData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error updating task ${taskId}:`, error);
      throw error;
    }
  },
  
  // Toggle task completion status
  toggleTaskCompletion: async (taskId, taskData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/task/update/${taskId}`, {
        method: 'PATCH',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify(taskData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error toggling completion for task ${taskId}:`, error);
      throw error;
    }
  },
  
  // Delete a task
  deleteTask: async (taskId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/task/delete/${taskId}`, {
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include'
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error deleting task ${taskId}:`, error);
      throw error;
    }
  }
};

export default taskService;