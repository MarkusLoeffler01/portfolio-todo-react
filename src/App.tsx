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
import CompletedTasks from "./components/main/CompletedTasks";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { LocalizationProvider } from "@mui/x-date-pickers-pro/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";


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
      <LocalizationProvider dateAdapter={AdapterDateFns}>
      <CssBaseline />
      <SettingsPanel />
      <Box sx={{ width: "50vw", display: "flex", justifyContent: "center", p: 2, flexDirection: "column" }}>
        <Box sx={{ width: "100%"}}>
          <ToDoForm onSubmit={handleAddToDo} />
          <ToDoList />
          <CompletedTasks />
        </Box>
        <ToastContainer pauseOnHover theme="dark" pauseOnFocusLoss={false} toastStyle={
          { backgroundColor: "#333", color: "#fff" }
        } />
        {/* <Box className="information" sx={{ width: "100%", display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
          <p>BuildID: {import.meta.env.BUILD_ID}</p>
          <p>Compiled at: {new Date(import.meta.env.BUILD_TIME).toLocaleString()}</p>
        </Box> */}
      </Box>
      { __BUILD_ID__ && <Box sx={{position: "absolute", top: "95%", left: "0", marginLeft: "10px", color: "#252525"}}>
          <p>BuildID: {__BUILD_ID__}</p>
      </Box>}
      { __BUILD_TIMESTAMP_UNIX__ && <Box sx={{position: "absolute", top: "95%", right: "0", marginRight: "10px", color: "#252525"}}>
        <p>Compiled at: {new Date(Number(__BUILD_TIMESTAMP_UNIX__) * 1000).toLocaleString()}</p>
      </Box> }
      </LocalizationProvider>
    </ThemeProvider>
  )
}

export default App
