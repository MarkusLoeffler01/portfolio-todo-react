import ToDo from "../types/todo";
import { IDBPDatabase, openDB } from "idb";

class ToDoDatabase {
    private dbPromise: Promise<IDBPDatabase<unknown>>;

    constructor() {
        this.dbPromise = openDB("todos", 1, {
            upgrade(db) {
                const store = db.createObjectStore("todos", { keyPath: "id" });
                store.createIndex("id", "id", { unique: true });
            }
        });
    }

    async get(id: string): Promise<ToDo | undefined> {
        const db = await this.dbPromise;
        return (await db.get("todos", id)) as ToDo | undefined;
    }


    async add(todo: ToDo) {
        const db = await this.dbPromise;
        await db.put("todos", todo);
    }

    async remove(id: string) {
        const db = await this.dbPromise;
        await db.delete("todos", id);
    }

    async update(id: string, updatedTodo: Partial<ToDo>) {
        const db = await this.dbPromise;
        const oldValue = await db.get("todos", id);
        const newTodo = {...oldValue, ...updatedTodo};
        await db.put("todos", newTodo);
    }

    async getAll(): Promise<ToDo[]> {
        const db = await this.dbPromise;
        return (await db.getAll("todos")).map(todo => ({
            ...todo,
            dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
            createdAt: new Date(todo.createdAt),
            updatedAt: todo.updatedAt ? new Date(todo.updatedAt) : undefined
        }));
    }
}

export default ToDoDatabase;