import React, { useState } from "react";
import type { ToDoUserInput } from "@/types/todo";
import generateTodo, { toDoUserInputSchema } from "@ts/todoGenerator";
import { Formik, Form, Field, ErrorMessage, FormikErrors, FormikTouched } from "formik";
import Grid from "@mui/material/Grid2";
import TextField from "@mui/material/TextField";
import { DesktopDateTimePicker } from "@mui/x-date-pickers/DesktopDateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import AddIcon from "@mui/icons-material/Add";
import TagIcon from "@mui/icons-material/Tag";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import TagList, { Tag } from "../dragdrop/TagList";
import { useTagsStorePersisted } from "@/stores/tagsStore";


interface ToDoFormProps {
  onSubmit: (todo: ToDoUserInput) => void;
}

export type UpdateToDoField = <K extends keyof ToDoUserInput> (field: K, value: ToDoUserInput[K]) => void;

const TodoForm: React.FC<ToDoFormProps> = ({ onSubmit }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [activePopover, setActivePopover] = useState<"date" | "tag" | "priority" | null>(null);
  const [newTag, setNewTag] = useState<string>("");
  const { tags, setTags, addTag} = useTagsStorePersisted();
  const [inputError, setInputError] = useState<Tag | null>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);


  const handleSelectedTags = (tag: Tag ) => {
    if(selectedTags.includes(tag)){
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }

  }

  const activateInputError = (ms: number) => {
    const dupedTagName = tags.find(tag => tag.name === newTag);
    if(!dupedTagName)return; 
    setInputError(dupedTagName);
    setTimeout(() => setInputError(null), ms);
  }



  const handleIconClick = (
    event: React.MouseEvent<HTMLElement>,
    type: "date" | "tag" | "priority"
  ) => {
    setAnchorEl(event.currentTarget);
    setActivePopover(type);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setActivePopover(null);
  };

  

  // Render popover content based on active type
  const renderPopoverContent = (values: ToDoUserInput, setFieldValue: UpdateToDoField, errors: FormikErrors<ToDoUserInput>, touched: FormikTouched<ToDoUserInput>) => {
    switch (activePopover) {
      case "date":
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDateTimePicker
              ampm={false}
              format="dd.MM.yyyy HH:mm"
              disablePast
              label="Fälligkeitsdatum"
              value={values.dueDate}
              onChange={(newValue) => {
                setFieldValue("dueDate", newValue);
              }}
              minDate={new Date()}
              minDateTime={new Date()}
              slotProps={{
                textField: {
                  value: values.dueDate,
                  error: touched.dueDate && Boolean(errors.dueDate),
                  helperText: touched.dueDate && errors.dueDate
                }
              }}  
            />
          </LocalizationProvider>
        );
      case "tag":
        return (
          <Box sx={{ 
            display: "flex", 
            flexDirection: "column", 
            gap: 1,
            alignSelf: 'flex-start'  // Makes the box only as wide as needed
          }}>
            <Box sx={{
              display: "flex",
              flexDirection: "column",
              width: 'fit-content',  // Container adjusts to content
              minWidth: 200  // Minimum width for usability
            }}>
              <TagList tags={tags} erroredTag={inputError} setTags={setTags} selectedTags={selectedTags} handleSelectedTags={handleSelectedTags} setFieldValue={setFieldValue} />
              <Box sx={{ 
                display: 'flex', 
                gap: 1, 
                mt: 1, 
                alignItems: 'center',
                width: '100%'  // Match parent width
              }}>
                {/* @ts-expect-error TextField intellisense errros for some reason, idk. Send PR if you like */ }
                <TextField
                  error={inputError !== null}
                  aria-errormessage={inputError ?? undefined}
                  variant="outlined"
                  size="small"
                  placeholder="New tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => {
                    if(e.key !== "Enter") return;
                    const trimmedTag = newTag.trim();
                    if (trimmedTag) {
                      if(tags.filter(tag => tag.name === trimmedTag).length > 0) return activateInputError(2000);
                      addTag(newTag.trim());
                      setNewTag('');
                    }
                  }}
                  sx={{ 
                    flexGrow: 1,
                    flexBasis: 0,
                    minWidth: 0  // Allows TextField to shrink below its default min-width
                  }}
                />
                <IconButton
                  color="primary"
                  onClick={() => {
                    const trimmedTag = newTag.trim();
                    if (trimmedTag) {
                      if(tags.filter(tag => tag.name === trimmedTag).length > 0) return;
                      addTag(newTag.trim());
                      setNewTag('');
                    }
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>
        );
      case "priority":
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <RadioGroup
              name="priority"
              value={values.priority}
              onChange={(e) => {
                setFieldValue("priority", e.target.value as "low" | "medium" | "high");
              }}
            >
              <FormControlLabel
                value="low"
                control={<Radio />}
                label="Niedrig"
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: 2,
                  p: 1,
                  m: 0.5,
                }}
              />
              <FormControlLabel
                value="medium"
                control={<Radio />}
                label="Mittel"
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: 2,
                  p: 1,
                  m: 0.5,
                }}
              />
              <FormControlLabel
                value="high"
                control={<Radio />}
                label="Hoch"
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: 2,
                  p: 1,
                  m: 0.5,
                }}
              />
            </RadioGroup>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Formik
      initialValues={{
        title: "",
        description: "",
        dueDate: null,
        tags: [],
        priority: "medium" as "low" | "medium" | "high",
      }}
      validationSchema={toDoUserInputSchema}
      onSubmit={(values, { resetForm }) => {
        console.log("Form submitted with values:", values);
        const newTodo = generateTodo(values);
        onSubmit(newTodo);
        resetForm();
        console.log(newTodo);
        handlePopoverClose();
      }}
    >
      {({ values, setFieldValue, isSubmitting, resetForm, setErrors, errors, touched }) => (
        <Form>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Field
              as={TextField}
              fullWidth
              disabled={isSubmitting}
              name="title"
              label="Title"
              variant="outlined"
              placeholder="Aufgabe hinzufügen"
              error={touched.title && errors.title}
              helperText={touched.title && errors.title && <ErrorMessage name="title" />}
              InputProps={{
                startAdornment: (
                    <IconButton sx={{ marginRight: 1, marginLeft: -1, cursor: "pointer"}} disabled={isSubmitting} type="submit" color="primary" onClick={() => {
                      if(!values.title) return setErrors({ title: "Title is required" });
                      const newTodo = generateTodo(values);
                      onSubmit(newTodo);
                      resetForm();
                      handlePopoverClose();
                    }}>
                      <AddIcon />
                    </IconButton>
                ),
              }}
            />

            <Grid container spacing={1} alignItems="center">
              <IconButton onClick={(e) => handleIconClick(e, "date")}>
                <CalendarTodayIcon />
              </IconButton>
              <IconButton onClick={(e) => handleIconClick(e, "tag")}>
                <TagIcon />
              </IconButton>
              <IconButton onClick={(e) => handleIconClick(e, "priority")}>
                <PriorityHighIcon />
              </IconButton>
            </Grid>

            <Popover
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={handlePopoverClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
              <Box sx={{ p: 2 }}>
                {renderPopoverContent(values, setFieldValue, errors, touched)}
              </Box>
            </Popover>
          </Paper>
        </Form>
      )}
    </Formik>
  );
};

export default TodoForm;