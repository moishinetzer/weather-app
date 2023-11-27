import { Button, ButtonProps, CircularProgress } from "@mui/material";
import { useIsSubmitting } from "remix-validated-form";

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
