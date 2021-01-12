let db;
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function(event) {
    // create object store called "pending" and set autoIncrement to true
   const db = event.target.result;
   db.createObjectStore("pending", { autoIncrement: true });
 };
 
 request.onsuccess = function(event) {
   db = event.target.result;
   if (navigator.onLine) {
     checkDatabase();
   }
 };
 
 request.onerror = function(event) {
   console.log(event.target.errorCode);
 };
 
 function saveRecord(record) {
    const transaction = db.transaction(["pending"], "readwrite")


    const store = transaction.objectStore("pending")
    store.add(record);
    
  }
  