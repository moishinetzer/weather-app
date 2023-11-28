import { Button, ButtonProps, CircularProgress } from "@mui/material";
import { useIsSubmitting } from "remix-validated-form";

/**
 * A custom submit button component.
 * This wraps the MUI Button with the remix-validated-form implementation.
 * Now this component is aware of the form state and will disable itself
 * when the form is submitting.
 */
export function SubmitButton({ children, ...rest }: ButtonProps): JSX.Element {
  let isSubmitting = useIsSubmitting();

  return (
    <Button
      variant="contained"
      color="primary"
      disabled={isSubmitting}
      type="submit"
      fullWidth
      {...rest}
    >
      {isSubmitting ? (
        <CircularProgress color="inherit" size={25} />
      ) : (
        <span>{children}</span>
      )}
    </Button>
  );
}
