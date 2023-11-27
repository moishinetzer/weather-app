import {
  TextField as MUITextField,
  type TextFieldProps as MUITextFieldProps,
} from "@mui/material";
import { useField } from "remix-validated-form";

type TextFieldProps = MUITextFieldProps & {
  name: string;
};

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
