// src/components/main/editTodo.tsx
import { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { toDoUserInputSchema } from '@ts/todoGenerator';
import type { ToDoUserInput } from '@type/todo';
import { TextField, Button, Radio, Box, MenuItem, Select, Autocomplete, Chip, Icon, Typography } from '@mui/material';
import useTodoStore from '@stores/todoStore';
import useSidePanelStore from '@stores/sidePanelStore';
import { useTagsStorePersisted } from '@/stores/tagsStore';
import SidePanel from "@components/common/SidePanel";
import { DateTimePicker, DesktopDateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { toast } from 'react-toastify';
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import InfoIcon from "@mui/icons-material/Info"

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
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, isSubmitting, errors, touched, setFieldError }) => {
            /**
             * const [dateInput, setDateInput] = useState(() => {
              return values.dueDate && !isNaN(new Date(values.dueDate).getTime()) 
                ? format(new Date(values.dueDate), 'dd.MM.yyyy HH:mm')
                : '';
            });

            const handleDateInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
              const input = e.target?.value ?? dateInput;

              setFieldValue('dueDate', input);
              setDateInput(input);
              
              // Clear error while typing
              setFieldError('dueDate', undefined);
              console.log('input', input);
          
              // Only validate complete inputs
              if (input.length === 16) {
                console.log("Validating date", input);
                try {
                  const parsedDate = parse(input, 'dd.MM.yyyy HH:mm', new Date());
                  if (!isNaN(parsedDate.getTime())) {
                    setFieldValue('dueDate', parsedDate);
                  } else {
                    setFieldError('dueDate', 'Ungültiges Datum');
                  }
                } catch (error) {
                  setFieldError('dueDate', 'Ungültiges Datum');
                }
              }
            };
            */

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
                <Field as={"div"}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                      sx={{ width: '100%' }}
                      ampm={false}
                      format='dd.MM.yyyy HH:mm'
                      disablePast
                      label="Fälligkeitsdatum"
                      name='dueDate'
                      value={values.dueDate}
                      onChange={(newValue) => {
                        setFieldValue('dueDate', newValue);
                      }}
                      onError={(reason) => {
                        if(reason === "disablePast") setFieldError("dueDate", "Fälligkeitsdatum darf nicht in der Vergangenheit sein");
                      }}
                      // onChange={(newValue) => {
                      //   if (!newValue) {
                      //     setDateInput('');
                      //     setFieldValue('dueDate', null);
                      //   }
                      // }}
                      // onError={((reason, value) => {
                      //   console.error(reason, value);
                      // })}
                      slotProps={{
                        textField: {
                          disabled: true,
                          value: values.dueDate,
                          error: touched.dueDate && Boolean(errors.dueDate),
                          helperText: touched.dueDate && errors.dueDate
                          // onChange: handleDateInputChange,
                          // onBlur: (value) => setFieldValue('dueDate', values.dueDate),
                          // error: Boolean(touched.dueDate && Boolean(errors.dueDate) && values.dueDate?.length === 16),
                          // helperText: touched.dueDate && errors.dueDate && values.dueDate?.length === 16 ? errors.dueDate : ''
                        }
                      }}
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
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <InfoIcon />
          <Typography>
            Fälligkeitsdatum lässt sich zurzeit nur durch den DatePicker (Icon) setzen
          </Typography>
        </Box>
      </Box>
    </SidePanel>
  );
};

export default EditTodo;