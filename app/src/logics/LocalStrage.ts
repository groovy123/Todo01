import dayjs from "dayjs";
import { TaskRow } from "../constants/Types";

// Database version
const databaseName = 'TaskDatabase';
const databaseVersion = 7;
const storeNameTasks = 'tasks';

type executeSqlType = (tx: IDBTransaction) => void;
type executeUpgradeType = (db: IDBDatabase) => void;
type openDbParam = {
    executeSql?: executeSqlType,
    executeUpgrade?: executeUpgradeType,
}

function openDb(param: openDbParam) {
    const request = indexedDB.open(databaseName, databaseVersion);
    
    request.onerror = (_evt) => {
        throw new Error("database error occured.");
    }

    request.onsuccess = (evt) => {
        const db = request.result;
        console.log('onsuccess is called.');
        if (param.executeSql) {
            // start transaction
            const tx = db.transaction(storeNameTasks, 'readwrite');
            tx.oncomplete = (evt) => {
                console.log('transaction completed.');
            };
            tx.onerror = commonError;
            param.executeSql(tx);
        }
    }

    request.onupgradeneeded = (evt) => {
        const db = request.result;
        console.log('onupgradeneeded is called.');
        if (param.executeUpgrade) {
            param.executeUpgrade(db);
        }
    }
}

function commonError(evt: Event) {
    console.error('error is occured.');
    console.error(evt);
}

export function initDatabase() {
    
    const executeUpgrade = (db: IDBDatabase) => {
        db.createObjectStore(storeNameTasks, { autoIncrement: true });
        console.log('create object store tasks.');
        
        // objectStore.transaction.oncomplete = (evt) => {
        //     const taskObjectStore = db.transaction("tasks", "readwrite").objectStore("tasks");
        //     rows.forEach((task) => {
        //         taskObjectStore.add(task);
        //     });
        // };
    };

    const deleteDatabase = (db: IDBDatabase) => {
        console.log("call deleteDatabase start.");
        const DBDeleteRequest = window.indexedDB.deleteDatabase(databaseName);

        DBDeleteRequest.onerror = (event) => {
            console.error("データベースの削除中にエラーが発生しました。");
        };

        DBDeleteRequest.onsuccess = (event) => {
            console.log("データベースが正常に削除されました。");
            console.log(event); // null のはず
        };
        console.log("call deleteDatabase end.");
    }
    openDb({ executeUpgrade: executeUpgrade });
}

export function allTasks() {
    const executeSql = (tx: IDBTransaction) => {
        const os = tx.objectStore(storeNameTasks);
        const request = os.getAll();
        request.onerror = commonError;
        request.onsuccess = (evt) => {
            console.log(request.result);
        };
    };
    openDb({ executeSql: executeSql });    
}

export function insertTask(row: TaskRow) {
    const executeSql = (tx: IDBTransaction) => {
        const os = tx.objectStore(storeNameTasks);
        const request = os.add(row);
        request.onerror = commonError;
        request.onsuccess = (evt) => {
            console.log(`add count = ${request.result}`);
        };
    };
    openDb({ executeSql: executeSql });
}
