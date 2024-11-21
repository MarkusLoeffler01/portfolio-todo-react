import { useEffect } from "react";
import useTodoStore from "@stores/todoStore";
import TodoItem from "./todoItem";
import { GridContainer, GridHeader } from "../list/StyledGrid";
import Box from "@mui/material/Box";
import {Theme, SxProps } from "@mui/material/styles";
import { useFilterStore } from '@stores/filterStore';


interface ToDoListProps {
    sx?: SxProps<Theme>;
}

const ToDoList = ({sx}: ToDoListProps) => {
    const { todos, loadTodosFromIndexedDB } = useTodoStore();
    const { searchQuery, priorityFilter, dateRange } = useFilterStore();

    useEffect(() => {
        (async () => {
            await loadTodosFromIndexedDB();
        })();
    }, [loadTodosFromIndexedDB]);

    const filteredTodos = todos.filter(todo => {
        if (todo.done) return false;
        
        if (searchQuery && 
            !todo.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
            !(todo.description?.toLowerCase().includes(searchQuery.toLowerCase()))
        ) return false;
        
        if (priorityFilter.length > 0 && !priorityFilter.includes((todo.priority as any))) return false;
        
        if (dateRange.start && todo.dueDate && new Date(todo.dueDate) < dateRange.start) return false;
        if (dateRange.end && todo.dueDate && new Date(todo.dueDate) > dateRange.end) return false;
        
        return true;
    });

    return (
        <GridContainer sx={sx}>
            <GridHeader>
                <Box>Titel</Box>
                <Box>Beschreibung</Box>
                <Box>Fällig</Box>
                <Box>Priorität</Box>
                <Box>Aktion</Box>
            </GridHeader>
            {filteredTodos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} />
            ))}
        </GridContainer>
    );
}


export default ToDoList;