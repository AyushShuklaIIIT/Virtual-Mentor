export function saveTaskOffline(task) {
  let dbRequest = indexedDB.open('VirtualMentorDB', 1);

  dbRequest.onupgradeneeded = function () {
    let db = dbRequest.result;
    if (!db.objectStoreNames.contains('pendingTasks')) {
      db.createObjectStore('pendingTasks', { autoIncrement: true });
    }
  };

  dbRequest.onsuccess = function () {
    let db = dbRequest.result;
    let tx = db.transaction('pendingTasks', 'readwrite');
    let store = tx.objectStore('pendingTasks');
    store.add(task);
  };
}
