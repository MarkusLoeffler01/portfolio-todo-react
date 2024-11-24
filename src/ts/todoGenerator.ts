import type Todo from "@type/todo";
import type { ToDoUserInput } from "@type/todo";
import { v4 as uuidv4 } from "uuid";

import { object, string, number, date, mixed, array } from "yup";




export const toDoUserInputSchema = object({
    title: string().required("Title is required"),
    description: string().optional(),
    dueDate: date().optional(),
    priority: mixed<"low" | "medium" | "high">().oneOf(["low", "medium", "high"]).optional(),
    tag: string().optional(),
    files: array().of(object({
        name: string().required(),
        size: number().required(),
        type: string().required(),
        contentInBytes: mixed().required()
    }))
});


function generateTodo(todo: ToDoUserInput): Todo {
    return {
        id: uuidv4(),
        done: false,
        createdAt: new Date(),
        updatedAt: undefined,
        ...todo
    }
}



export default generateTodo;
