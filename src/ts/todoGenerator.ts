import type Todo from "@type/todo";
import type { ToDoUserInput } from "@type/todo";
import { v4 as uuidv4 } from "uuid";

import { object, string, number, array, mixed } from "yup";


/*
export const toDoUserInputSchema = object({
    title: string().required("Title is required"),
    description: string().optional(),
    dueDate: string().optional().nullable().test("is-date", "Fälligkeitsdatum im ungültigem Format", (value) => {
        console.log(typeof value);
        if(!value) return true;
        const regex = /^\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}$/; // dd.MM.yyyy HH:mm

        if (!regex.test(value)) {
            console.log("regex failed", value);
            return true; // Wert ist unvollständig oder im Bearbeitungsmodus -> Keine Validierung
        }


        const [ datePart, timePart ] = value.split(" ");
        const [ day, month, year ] = datePart.split(".").map(Number)
        const [ hour, minute ] = timePart.split(":").map(Number);

        const isValidDate =
            year > 1900 && 
            month >= 1 &&
            month <= 12 &&
            day >= 1 &&
            day <= new Date(year, month, 0).getDate();

        const isValidTime = hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
        if(!(isValidDate && isValidTime)) {
            console.error("date or time invalid", value);
        }

        return isValidDate && isValidTime;

    }).test("is-not-in-past", "Fälligkeitsdatum darf nicht in der Vergangenheit sein", function(value) {
        if(!value) return true;

        const date = this.parent.dueDate;
        console.log("is-not-in-past", date);
        console.log(typeof date);
        if(!(date && date instanceof Date)) return true;

        const [ datePart, timePart ] = value.split(" ");
        const [ day, month, year ] = datePart.split(".").map(Number)
        const [ hour, minute ] = timePart.split(":").map(Number);

        if(new Date(year, month - 1, day, hour, minute).getTime() < Date.now()) {
            console.error("date is in past", value);
        }
        return new Date(year, month - 1, day, hour, minute).getTime() > Date.now();
    }),
    // dueDate: mixed().optional().nullable(),
    priority: mixed<"low" | "medium" | "high">().oneOf(["low", "medium", "high"]).optional(),
    tags: array().of(string()).optional(),
    files: array().of(object({
        name: string().required(),
        size: number().required(),
        type: string().required(),
        contentInBytes: mixed().required()
    }))
});
*/

export const toDoUserInputSchema = object({
    title: string().required("Titel darf nicht leer sein"),
    description: string().optional(),
    dueDate: mixed()
        .nullable()
        .optional()
        .transform((value) => {
            console.log(value);
            if (!value) return null;
            const date = new Date(value);
            return isNaN(date.getTime()) ? undefined : date;
        })
        .test('future-date', 'Datum muss in der Zukunft liegen', (value) => {
            if (!value || !(value instanceof Date)) return true;
            return value.getTime() > Date.now();
        }),
    priority: mixed<"low" | "medium" | "high">()
        .oneOf(["low", "medium", "high"])
        .optional(),
    tags: array().of(string()).optional(),
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
