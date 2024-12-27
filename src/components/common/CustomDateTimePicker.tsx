import { DesktopDateTimePicker } from "@mui/x-date-pickers/DesktopDateTimePicker";
import { FormikErrors, FormikTouched } from "formik";

interface CustomDateTimePickerProps {
    value: Date | null;
    setFieldValue: (field: string, value: Date | null) => void;
    errors: Readonly<FormikErrors<{dueDate: Date | null}>>;
    touched: Readonly<FormikTouched<{dueDate: Date | null}>>;
    name: Readonly<string>;
    setErrors: (errors: FormikErrors<{
          title: string;
          description: string;
          dueDate: null;
          tags: never[];
          priority: "low" | "medium" | "high";
      }>) => void

}

const CustomDateTimePicker = ({ setFieldValue, errors, touched, name, value, setErrors }: CustomDateTimePickerProps) => {
    return (
        <DesktopDateTimePicker
                      sx={{ width: "100%" }}
                      ampm={false}
                      format="dd.MM.yyyy HH:mm"
                      disablePast
                      key={name}
                      label="Fälligkeitsdatum"
                      value={value}
                      onChange={(newValue) => {
                        setFieldValue("dueDate", newValue);
                      }}
                      onError={(reason) => setErrors({...errors, dueDate: reason === "disablePast" ? "Datum muss in der Zukunft liegen" : undefined})}
                      minDate={new Date()}
                      minDateTime={new Date()}
                      slotProps={{
                        textField: {
                          value: value,
                          error: touched.dueDate && Boolean(errors.dueDate),
                          helperText: touched.dueDate && errors.dueDate
                        }
                      }}  
            />
    );
}

export default CustomDateTimePicker;