import { useEffect } from "react";
import useTodoStore from "@stores/todoStore";
import TodoItem from "./todoItem";
import { GridContainer, GridHeader } from "@/styles/components/layout/Grid";
import Box from "@mui/material/Box";
import {Theme, SxProps } from "@mui/material/styles";
import { useFilterStore } from '@stores/filterStore';
import Typography from "@mui/material/Typography";


interface ToDoListProps {
    sx?: SxProps<Theme>;
}

const EmptyState = () => (
  <Box 
    sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '70vh',
      gap: 3,
      animation: 'fadeIn 0.5s ease-in-out',
      '@keyframes fadeIn': {
        from: { opacity: 0, transform: 'translateY(20px)' },
        to: { opacity: 1, transform: 'translateY(0)' }
      }
    }}
  >
    <Typography 
      variant="h3" 
      sx={{ 
        fontWeight: 200,
        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        backgroundClip: 'text',
        textFillColor: 'transparent',
        mb: 2
      }}
    >
      Willkommen bei Deiner Todo-Liste
    </Typography>
    <Typography 
      variant="h6" 
      sx={{ 
        fontWeight: 300,
        color: 'text.secondary',
        textAlign: 'center',
        maxWidth: '600px',
        lineHeight: 1.6
      }}
    >
      Beginne deine Produktivitätsreise und füge dein erstes Todo hinzu.
      Mit einem Klick auf den Button oben startest du durch!
    </Typography>
  </Box>
);
  

const ToDoList = ({sx}: ToDoListProps) => {
    const { todos, loadTodosFromIndexedDB } = useTodoStore();
    const { searchQuery, priorityFilter, dateRange } = useFilterStore();

    useEffect(() => {
        (async () => {
            await loadTodosFromIndexedDB();
        })();
    }, [loadTodosFromIndexedDB]);

    if(todos.length === 0) return <EmptyState />;

    const filteredTodos = todos.filter(todo => {
        if (todo.done) return false;
        
        if (searchQuery && 
            !todo.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
            !(todo.description?.toLowerCase().includes(searchQuery.toLowerCase()))
        ) return false;
        
        if (priorityFilter.length > 0 && !priorityFilter.includes((todo.priority))) return false;
        
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