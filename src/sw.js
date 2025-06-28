import { precacheAndRoute } from 'workbox-precaching';

// 🚨 Mandatory for injectManifest
precacheAndRoute(self.__WB_MANIFEST);

// ✅ Background Sync Event Listener
self.addEventListener('sync', function (event) {
  console.log('🔁 Sync event fired:', event);
  if (event.tag === 'sync-tasks') {
    event.waitUntil(syncPendingTasks());
  }
});

// ✅ Background Sync Logic
async function syncPendingTasks() {
  return new Promise((resolve, reject) => {
    let dbRequest = indexedDB.open('VirtualMentorDB', 1);

    dbRequest.onsuccess = function () {
      let db = dbRequest.result;

      // ✅ First transaction: read all tasks
      let tx = db.transaction('pendingTasks', 'readonly');
      let store = tx.objectStore('pendingTasks');
      let getAll = store.getAll();

      getAll.onsuccess = async function () {
        let tasks = getAll.result;

        // ✅ Wait for the transaction to complete before starting network requests
        tx.oncomplete = async function () {
          console.log('📦 Fetched tasks from IndexedDB:', tasks);

          for (let task of tasks) {
            try {
              const response = await fetch('https://hackdemo-backend.onrender.com/api/task/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(task)
              });

              if (response.ok) {
                console.log('✅ Synced task:', task);
              } else {
                console.error('❌ Sync failed for task:', task);
              }
            } catch (err) {
              console.error('❌ Sync error for task:', task, err);
            }
          }

          // ✅ New transaction to clear the store
          let clearTx = db.transaction('pendingTasks', 'readwrite');
          let clearStore = clearTx.objectStore('pendingTasks');
          let clearRequest = clearStore.clear();

          clearRequest.onsuccess = function () {
            console.log('🗑️ Cleared pending tasks after sync');
            resolve();
          };

          clearRequest.onerror = function (err) {
            console.error('❌ Failed to clear store:', err);
            reject(err);
          };
        };
      };

      getAll.onerror = function (err) {
        console.error('❌ Failed to read tasks:', err);
        reject(err);
      };
    };

    dbRequest.onerror = function (err) {
      console.error('❌ Failed to open IndexedDB:', err);
      reject(err);
    };
  });
}
