// src/components/main/editTodo.tsx
import { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { toDoUserInputSchema } from '@ts/todoGenerator';
import type { ToDoUserInput } from '@type/todo';
import useTodoStore from '@stores/todoStore';
import useSidePanelStore from '@stores/sidePanelStore';
import { useTagsStorePersisted } from '@/stores/tagsStore';
import SidePanel from "@components/common/SidePanel";
import { toast } from 'react-toastify';
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import CustomDateTimePicker from '../common/CustomDateTimePicker';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';


const EditTodo = () => {
  const { activeRightPanel, currentTodo, closeRightPanel } = useSidePanelStore();
  const updateTodo = useTodoStore(state => state.updateTodo);
  const removeTodo = useTodoStore(state => state.removeTodo);
  const { tags } = useTagsStorePersisted();

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
    toast.success('Todo updated!');
  };

  const handleDelete = async () => {
    await removeTodo(currentTodo.id);
    closeRightPanel();
    toast.success('Todo deleted!');
  }

  const initialValues: ToDoUserInput = {
    title: currentTodo.title,
    description: currentTodo.description || '',
    dueDate: currentTodo.dueDate || null,
    priority: currentTodo.priority || 'medium',
    tags: currentTodo.tags || [],
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
          validateOnBlur={true}
          validateOnMount={true}
          validateOnChange={true}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, setFieldValue, values, isValidating, isSubmitting, dirty, setFieldError }) => {
            console.log("Form validation state", {
              errors: JSON.stringify(errors),
              touched: JSON.stringify(touched),
              isValidating,
              isSubmitting,
              dirty,
            })
            if (Object.keys(errors).length > 0) {
              console.log('errors', errors);
            }

            return (
              <Form style={{
                display: "grid",
                gap: "24px",
              }}>
                <Field
                  as={TextField}
                  fullWidth
                  name="title"
                  label="Titel"
                  error={touched.title && Boolean(errors.title)}
                  helperText={touched.title && errors.title && <ErrorMessage name="title" />}
                />
                <Field
                  as={TextField}
                  fullWidth
                  name="description"
                  label="Beschreibung"
                  multiline
                  rows={3}
                  error={touched.description && Boolean(errors.description)}
                  helperText={touched.description && errors.description}
                />
                <Field name="dueDate" as={"div"}>
                      <CustomDateTimePicker
                      //@ts-expect-error - Type 'string' is not assignable to type 'never[]'.
                        setErrors={setFieldError}
                        errors={errors} 
                        name='dueDate' 
                        setFieldValue={setFieldValue} 
                        touched={touched} 
                        value={values.dueDate} 
                      />
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
                <Autocomplete
                  multiple
                  options={tags.map(e => e.name)} // You might want to add predefined tags here
                  value={values.tags ?? []}
                  onChange={(_, newValue) => {
                    setFieldValue('tags', newValue);
                  }}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                        key={"chipIndex" + index}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={touched.tags && Boolean(errors.tags)}
                      helperText={touched.tags && errors.tags}
                      label="Tags"
                      placeholder="Tags auswählen"
                    />
                  )}
                />
                <Box>
                  <Button
                    onClick={closeRightPanel}
                    sx={{ mr: 1 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="outlined"
                    disabled={isSubmitting}
                    sx={{
                      transition: "all 0.2s",
                      "&:hover": {
                        variant: "contained",
                        backgroundColor: "primary.main",
                        color: "primary.contrastText",
                      }
                    }}
                  >
                    Save Changes
                  </Button>
                  <Box sx={{ flexGrow: 1, marginTop: 1 }}>
                    {Object.keys(errors).length > 0 && (
                      <Box sx={{ color: "error.main" }}>
                        {Object.values(errors).map((error) => (
                          <div key={error}>{error}</div>
                        ))}
                      </Box>
                    )}
                  </Box>
                </Box>
                <Button
                  variant='outlined'
                  color="error"
                  fullWidth
                  onClick={handleDelete}
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
            );
          }}
        </Formik>
      </Box>
    </SidePanel>
  );
};

export default EditTodo;