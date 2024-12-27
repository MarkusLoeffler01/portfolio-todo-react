import { Buffer } from 'buffer';


export interface File {
    name: string;
    size: number;
    type: string;
    contentInBytes: Buffer;
}

export type ToDoUserInput = Omit<ToDo, "id" | "done" | "createdAt" | "updatedAt">

export type UpdateToDoField = <K extends keyof ToDoUserInput> (field: K, value: ToDoUserInput[K]) => void;

interface ToDo {
    /** uuid from package `uuid` */
    id: string;
    title: string;
    description?: string;
    done: boolean;
    dueDate: Date | null;
    tags?: string[];
    files?: File[]; 
    createdAt: Date;
    updatedAt?: Date;
    priority: "low" | "medium" | "high";

}

export default ToDo;