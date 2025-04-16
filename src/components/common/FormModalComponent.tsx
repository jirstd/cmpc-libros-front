import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    MenuItem,
  } from "@mui/material";
  import { useEffect, useState } from "react";
  
  export interface FieldConfig {
    name: string;
    label: string;
    type?: "text" | "email" | "password" | "number" | "select" | "file";
    options?: { label: string; value: string | number }[]; // ✅ solo para select
  }
  
  interface Props {
    open: boolean;
    title: string;
    fields: FieldConfig[];
    defaultValues: Record<string, string | number | File>;
    onClose: () => void;
    onSubmit: (values: Record<string, string | number | File>) => void;
    showDelete?: boolean;
    onDelete?: () => void;
  }
  
  const FormModalComponent = ({
    open,
    title,
    fields,
    defaultValues,
    onClose,
    onSubmit,
    showDelete = false,
    onDelete,
  }: Props) => {
    const [formValues, setFormValues] = useState<Record<string, string | number | File>>({});

    useEffect(() => {
      if (!open) {
        setTimeout(() => {
          const button = document.querySelector('button[aria-label="Agregar Usuario"]') as HTMLElement;
          button?.focus();
        }, 0);
      }
    }, [open]);
  
    useEffect(() => {
      setFormValues(defaultValues || {});
    }, [defaultValues]);
  
    // const handleChange = (name: string, value: string) => {
    //   setFormValues((prev) => ({ ...prev, [name]: value }));
    // };

    const handleChange = (name: string, value: string | number | File) => {
      setFormValues((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = () => {
      onSubmit(formValues);
      onClose();
    };
  
    const handleDelete = () => {
      if (onDelete) onDelete();
      onClose();
    };

    // console.log('defaultValues -->', defaultValues);
    // console.log('formValues -->', formValues);
  
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            {fields.map((field) =>
              field.type === "file" ? (
                <Box key={field.name}>
                  <label>{field.label}</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleChange(field.name, file);
                    }}
                  />
                  {formValues[field.name] && (
                    <Box mt={1}>
                      <img
                        src={
                          formValues[field.name] instanceof File
                            ? URL.createObjectURL(formValues[field.name] as File)
                            : `http://localhost:3000${formValues[field.name]}`
                        }
                        alt="Preview"
                        style={{ width: "120px", borderRadius: 8 }}
                      />
                    </Box>
                  )}
                </Box>
              ) : (
                <TextField
                  key={field.name}
                  select={field.type === "select"}
                  margin="normal"
                  fullWidth
                  label={field.label}
                  name={field.name}
                  type={field.type !== "select" ? field.type : undefined}
                  value={formValues[field.name] ?? ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                >
                  {field.type === "select" &&
                    field.options?.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                </TextField>
              )
            )}
          {/* {fields.map((field) => (
              <TextField
                key={field.name}
                select={field.type === "select"}
                margin="normal"
                fullWidth
                label={field.label}
                name={field.name}
                type={field.type !== "select" ? field.type : undefined}
                value={formValues[field.name] ?? ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
              >
                {field.type === "select" &&
                  field.options?.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
              </TextField>
            ))} */}
          </Box>
        </DialogContent>
        <DialogActions>
          {showDelete && (
            <Button onClick={handleDelete} color="error">
              Eliminar
            </Button>
          )}
          <Button onClick={onClose} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default FormModalComponent;
  