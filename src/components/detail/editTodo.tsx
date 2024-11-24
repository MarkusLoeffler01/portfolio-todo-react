// src/components/main/editTodo.tsx
import { useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { toDoUserInputSchema } from '@ts/todoGenerator';
import type { ToDoUserInput } from '@type/todo';
import { TextField, Button, Radio, Box, MenuItem, Select } from '@mui/material';
import useTodoStore from '@stores/todoStore';
import useSidePanelStore from '@stores/sidePanelStore';
import SidePanel from "@components/common/SidePanel";
import { DesktopDateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';


import PriorityHighIcon from "@mui/icons-material/PriorityHigh";

const EditTodo = () => {
  const { activeRightPanel, currentTodo, closeRightPanel } = useSidePanelStore();
  const updateTodo = useTodoStore(state => state.updateTodo);

  // Cleanup effect when component unmounts
  useEffect(() => {
    return () => {
      if (activeRightPanel === 'edit') {
        closeRightPanel();
      }
    };
  }, [activeRightPanel, closeRightPanel]);

  if (!currentTodo) return null;

  const handleSubmit = async (values: ToDoUserInput) => {
    console.log('Submitting form', values);
    await updateTodo(currentTodo.id, {
      ...values,
      updatedAt: new Date()
    });
    closeRightPanel();
  };

  const initialValues: ToDoUserInput = {
    title: currentTodo.title,
    description: currentTodo.description || '',
    dueDate: currentTodo.dueDate || null,
    priority: currentTodo.priority || 'medium',
    tags: currentTodo.tags ?? [],
  };

  return (
    <SidePanel
      key={currentTodo.id} // Force remount when todo changes
      open={activeRightPanel === "edit"}
      onClose={closeRightPanel}
      title="Edit Todo"
      position="right"
    >
      <Box sx={{
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: 3,
        p: 2
      }}>
        <Formik
          initialValues={initialValues}
          validationSchema={toDoUserInputSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form style={{
              display: "grid",
              gap: "24px",
            }}>
              <Field
                as={TextField}
                fullWidth
                name="title"
                label="Titel"
              />
              <Field
                as={TextField}
                fullWidth
                name="description"
                label="Beschreibung"
                multiline
                rows={3}
              />
              <Field as={"div"}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopDateTimePicker
                    sx={{ width: '100%' }}
                    ampm={false}
                    format='dd.MM.yyyy HH:mm'
                    disablePast
                    label="Fälligkeitsdatum"
                    name='dueDate'
                    onChange={(date) => setFieldValue('dueDate', date)}
                    value={values.dueDate}
                    defaultValue={currentTodo.dueDate}
                    minDateTime={new Date()}
                  />
                </LocalizationProvider>
              </Field>
              <Field name="priority" label="Priorität">
                {({ field }: { field: { value: string } }) => (
                  <Select
                    {...field}

                    fullWidth
                    margin="dense"
                    label="Priorität"
                    value={field.value || 'medium'}
                    renderValue={(value) => (
                      <Box sx={{ display: "flex", alignItems: 'center' }}>
                        <PriorityHighIcon sx={{ mr: 1 }} />
                        {value === 'low' ? 'Niedrig' : value === 'medium' ? 'Mittel' : 'Hoch'}
                      </Box>
                    )}
                  >
                    <MenuItem value="low" sx={{ p: 2 }}>
                      <Radio checked={field.value === "low"} />
                      Niedrig
                    </MenuItem>
                    <MenuItem value="medium" sx={{ p: 2 }}>
                      <Radio checked={field.value === "medium"} />
                      Mittel
                    </MenuItem>
                    <MenuItem value="high" sx={{ p: 2 }}>
                      <Radio checked={field.value === "high"} />
                      Hoch
                    </MenuItem>
                  </Select>
                )}
              </Field>
              {/* Add other fields */}
              <Box>
                <Button
                  onClick={closeRightPanel}
                  sx={{ mr: 1 }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                >
                  Save Changes
                </Button>
              </Box>
              <Button
                variant='outlined'
                color="error"
                fullWidth
                sx={{
                  mt: 2,
                  transition: "all 0.2s",
                  "&:hover": {
                    variant: "contained",
                    backgroundColor: "error.main",
                    color: "error.contrastText",
                  }
                }}
              >
                Delete Todo
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </SidePanel>
  );
};

export default EditTodo;