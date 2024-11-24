import useTodoStore from "@stores/todoStore";
import './App.css'
import ToDoForm from "@/components/main/todoForm";
import { ToDoUserInput } from './types/todo';
import generateTodo from "./ts/todoGenerator";
import ToDoList from "@cmain/todoList";
import { SettingsPanel } from '@components/settings/index';

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";



function App() {
  const addTodo = useTodoStore((state) => state.addTodo);


  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = createTheme({
    colorSchemes: {
      dark: prefersDarkMode,
    },
  });

  const handleAddToDo = (userInput: ToDoUserInput) => {
    console.log(userInput);
    const newTodo = generateTodo(userInput);
    addTodo(newTodo);
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SettingsPanel />
      <Box sx={{ width: "50vw", display: "flex", justifyContent: "center", p: 2, flexDirection: "column" }}>
        <Box sx={{ width: "100%"}}>
          <ToDoForm onSubmit={handleAddToDo} />
          <ToDoList />
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default App
