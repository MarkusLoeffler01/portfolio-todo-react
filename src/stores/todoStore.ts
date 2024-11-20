import { create } from "zustand";
import ToDo from "../types/todo";
import ToDoDatabase from "./indexedDb";

interface ToDoState {
    todos: ToDo[];
    addTodo: (todo: ToDo) => Promise<void>;
    removeTodo: (id: string) => Promise<void>;
    updateTodo: (id: string, updatedTodo: Partial<ToDo>) => Promise<void>;
    loadTodosFromIndexedDB: () => Promise<void>;
}

const db = new ToDoDatabase();

const useTodoStore = create<ToDoState>((set) => ({
    todos: [],
    addTodo: async (todo) => {
        await db.add(todo);
        set((state) => ({ todos: [...state.todos, todo],

        }));
    },
    removeTodo: async (id) => {
        await db.remove(id);
        set((state) => ({
            todos: state.todos.filter(todo => todo.id !== id)
        }));
    },
    updateTodo: async (id, updateTodo) => {
        await db.update(id, updateTodo);
        set((state) => ({
            todos: state.todos.map(todo => todo.id === id ? { ...todo, ...updateTodo } : todo)
        }));
    },
    loadTodosFromIndexedDB: async () => {
        const todos = await db.getAll();
        set({ todos });
    }
}));

export default useTodoStore;