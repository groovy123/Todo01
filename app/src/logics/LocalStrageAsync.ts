import { DBSchema, IDBPDatabase, openDB } from "idb";
import { TaskRow } from "../constants/Types";

// Database version
const databaseName = 'TaskDatabase';
const databaseVersion = 1;
const storeNameTasks = 'tasks';

interface TaskDatabase extends DBSchema {
    tasks: {
        key: number,
        value: TaskRow,
    }
}

let db: IDBPDatabase<TaskDatabase>;

export async function initIndexDb() {
    // await deleteDB(databaseName);
    if (db) {
        console.log('cache db used.');
    } else {
        db = await openDB<TaskDatabase>(databaseName, databaseVersion, {
            upgrade(db) {
                db.createObjectStore(storeNameTasks);
                console.log('create object store tasks.');    
            },
        });    
        console.log('db is open.');
    }
}

export async function listTasks() {
    const tx = db.transaction(storeNameTasks);
    const os = tx.objectStore(storeNameTasks);
    return await os.getAll();
}

export async function addTask(task: TaskRow) {
    const tx = db.transaction(storeNameTasks, 'readwrite');
    const os = tx.objectStore(storeNameTasks);
    await os.add(task, task.id);
    await tx.done;
}

export async function deleteTask(idList: number[]) {
    if (idList.length > 0) {
        const tx = db.transaction(storeNameTasks, 'readwrite');
        const os = tx.objectStore(storeNameTasks);
        await idList.forEach((id) => os.delete(id));
        await tx.done;    
    }
}

addEventListener('unhandledrejection', evt => {
    alert('Error: ' + evt.reason?.message);
});