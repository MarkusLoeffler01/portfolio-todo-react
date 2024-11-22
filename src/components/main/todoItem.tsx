import useTodoStore from "@stores/todoStore";
import ToDo from "@type/todo";
import DeleteIcon from "@mui/icons-material/Delete"
import DoneIcon from "@mui/icons-material/Done";
import EditTodo from '@cdetail/editTodo'; // Create this component separately
import useSidePanelStore from "@/stores/sidePanelStore";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import styled from "@emotion/styled";
import { Theme as MuiTheme } from "@mui/material/styles";
import { useRef, useState } from 'react';
import { GridRow } from "../list/StyledGrid";

//eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledTableRow = styled(TableRow)<{ theme?: MuiTheme, mouseX?: string, mouseY?: string }>(({ theme, mouseX = '0px', mouseY = '0px' }) => ({
    cursor: "pointer",
    position: "relative",
    transition: "all 0.2s",
    '&:hover': {
      '&::before': {
        opacity: 1,
      },
    },
    '&::before': {
      content: '""',
    //   display: "none",
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: `radial-gradient(
        800px circle at ${mouseX} ${mouseY},
        rgba(255, 255, 255, 0.06),
        transparent 40%
      )`,
      opacity: 0,
      transition: 'opacity 500ms',
      zIndex: 1,
    },
    '& .MuiTableCell-root': {
      position: 'relative',
      zIndex: 2,
      backgroundColor: 'transparent', // Set to transparent
      borderBottom: `1px solid ${theme?.palette?.divider}`,
      padding: "16px",
    },
  }));
  
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
        <Box>{MapPriority(todo.priority as any) || "N/A"}</Box>
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