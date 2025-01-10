import useTodoStore from "@stores/todoStore";
import ToDo from "@type/todo";
import DeleteIcon from "@mui/icons-material/Delete"
import DoneIcon from "@mui/icons-material/Done";
import EditTodo from '@cdetail/editTodo'; // Create this component separately
import useSidePanelStore from "@/stores/sidePanelStore";
import Box from "@mui/material/Box";
import { useRef, useState } from 'react';
import { GridRow } from "@styles/components/layout/Grid";
import WarningIcon from '@mui/icons-material/Warning';
import RestoreIcon from '@mui/icons-material/Restore';
import Tooltip from '@mui/material/Tooltip';
  
const MapPriority = (value: "low" | "medium" | "high") => value === 'low' ? 'Niedrig' : value === 'medium' ? 'Mittel' : 'Hoch'


function ToDoItem({ todo, mode = "active" }: { todo: ToDo, mode: 'active' | 'completed' }) {
  const { removeTodo, updateTodo } = useTodoStore();
  const setRightPanel = useSidePanelStore(state => state.setRightPanel);
  const [mousePos, setMousePos] = useState({ x: '0px', y: '0px' });
  const rowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (rowRef.current) {
      const rect = rowRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePos({ x: `${x}px`, y: `${y}px` });
    }
  };

  const handleRowClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLElement && e.target.tagName !== "svg") {
      setRightPanel("edit", todo);
    }
  }

  const handleRemove = () => {
    removeTodo(todo.id);
  };

  const handleUpdate = <K extends keyof ToDo>(key: K, value: ToDo[K]) => {
    updateTodo(todo.id, { [key]: value } as Record<K, ToDo[K]>);
  };

  return (
    <>
      <GridRow
        data-testid={`todo-${todo.id}`}
        ref={rowRef}
        onMouseMove={handleMouseMove}
        mouseX={mousePos.x}
        mouseY={mousePos.y}
        onClick={handleRowClick}
        theme={{ palette: { action: { hover: "rgba(40, 40, 40, 0.15)",  } } }}
      >
        <Tooltip title={todo.title} enterDelay={500}>
          <Box>{todo.title}</Box>
        </Tooltip>
        
        <Tooltip title={todo.description} enterDelay={500}>
          <Box>{todo.description}</Box>
        </Tooltip>
        
        <Tooltip 
          title={todo.dueDate 
            ? todo.dueDate.toLocaleString(undefined, {timeStyle: "short", dateStyle: "short"}) 
            : "N/A"
          } 
          enterDelay={500}
        >
          <Box
            sx={{ 
              color: todo.dueDate && new Date(todo.dueDate) < new Date() 
                ? 'error.main' 
                : 'inherit'
            }}
          >
            {todo.dueDate 
              ? todo.dueDate.toLocaleString(undefined, {timeStyle: "short", dateStyle: "short"}) 
              : "N/A"}  
            {todo.dueDate && new Date(todo.dueDate) < new Date() && (
              <WarningIcon sx={{ right: 0, fontSize: "1.2rem" }} fontSize="small" />
            )}
          </Box>
        </Tooltip>
        
        <Tooltip title={MapPriority(todo.priority)} enterDelay={500}>
          <Box>{MapPriority(todo.priority)}</Box>
        </Tooltip>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          { mode === "active" ? 
          <Tooltip title="Erlledigt">
            <DoneIcon sx={{ cursor: "pointer", '&:hover': {color: "green"}}} onClick={() => handleUpdate("done", true)} /> 
          </Tooltip>
          : <Tooltip title="Wiederherstellen">
              <RestoreIcon sx={{ cursor: "pointer", '&:hover': {color: "blue"}}} onClick={() => handleUpdate("done", false)} />
            </Tooltip>}
          <Tooltip title="Löschen">
          <DeleteIcon sx={{ cursor: "pointer", '&:hover': {color: "red"}}} onClick={handleRemove} />
          </Tooltip>
        </Box>
      </GridRow>
      <EditTodo />
    </>
  );
}

export default ToDoItem;