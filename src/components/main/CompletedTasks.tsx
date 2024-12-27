import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TodoList from './todoList';
import useTodoStore from "@stores/todoStore";

const CompletedTasks = () => {
    const { todos } = useTodoStore();
    return (
        <Accordion 
            sx={{ 
                mt: 4,
                backgroundColor: 'background.paper',
                '&:before': {
                    display: 'none',
                },
            }}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="completed-tasks-content"
                id="completed-tasks-header"
            >
                <Typography>
                    Abgeschlossene Aufgaben ({todos.filter(todo => todo.done).length})
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <TodoList 
                    mode="completed"
                    sx={{
                        '& .MuiTableRow-root': {
                            opacity: 0.7
                        }
                    }}
                />
            </AccordionDetails>
        </Accordion>
    );
};

export default CompletedTasks;