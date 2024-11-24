import useTodoStore from "@stores/todoStore";
import ToDo from "@type/todo";
import DeleteIcon from "@mui/icons-material/Delete"
import DoneIcon from "@mui/icons-material/Done";
import EditTodo from '@cdetail/editTodo'; // Create this component separately
import useSidePanelStore from "@/stores/sidePanelStore";
import Box from "@mui/material/Box";
import { useRef, useState } from 'react';
import { GridRow } from "@styles/components/layout/Grid";
  
const MapPriority = (value: "low" | "medium" | "high") => value === 'low' ? 'Niedrig' : value === 'medium' ? 'Mittel' : 'Hoch'


function ToDoItem({ todo }: { todo: ToDo }) {
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

  const handleRemove = () => {
    removeTodo(todo.id);
  };

  const handleUpdate = <K extends keyof ToDo>(key: K, value: ToDo[K]) => {
    updateTodo(todo.id, { [key]: value } as Record<K, ToDo[K]>);
  };

  return (
    <>
      <GridRow
        ref={rowRef}
        onMouseMove={handleMouseMove}
        mouseX={mousePos.x}
        mouseY={mousePos.y}
        onClick={() => setRightPanel("edit", todo)}
        theme={{ palette: { action: { hover: "rgba(40, 40, 40, 0.15)",  } } }}
      >
        <Box>{todo.title}</Box>
        <Box>{todo.description}</Box>
        <Box>{todo.dueDate ? todo.dueDate.toLocaleString(undefined, {timeStyle: "short", dateStyle: "short"}) : "N/A"}</Box>
        <Box>{MapPriority(todo.priority) || "N/A"}</Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <DoneIcon sx={{ cursor: "pointer", '&:hover': {color: "green"}}} onClick={() => handleUpdate("done", true)} /> 
          <DeleteIcon sx={{ cursor: "pointer", '&:hover': {color: "red"}}} onClick={handleRemove} />
        </Box>
      </GridRow>
      <EditTodo />
    </>
  );
}

export default ToDoItem;