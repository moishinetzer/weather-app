import {
  TextField as MUITextField,
  type TextFieldProps as MUITextFieldProps,
} from "@mui/material";
import { useField } from "remix-validated-form";

type TextFieldProps = MUITextFieldProps & {
  name: string;
};

/**
 * A custom text field component.
 * This wraps the MUI TextField with the remix-validated-form implementation.
 * Now this component is aware of the form state and will show the error
 * message when the field is invalid.
 */
export function TextField({ ...rest }: TextFieldProps): JSX.Element {
  let { error, getInputProps } = useField(rest.name);
  return (
    <MUITextField
      {...getInputProps()}
      error={!!error}
      helperText={error}
      {...rest}
    />
  );
}
