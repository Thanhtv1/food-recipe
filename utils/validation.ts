import { RegisterFormValues, SignInFormValues, ErrorForm } from "@/types/auth";

const validateForm = (
  formValues: Partial<SignInFormValues | RegisterFormValues>
) => {
  let errors: Partial<ErrorForm> = {};

  if (!formValues.email) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
    errors.email = "Invalid email address";
  }

  if (!formValues.password) {
    errors.password = "Password is required";
  }
  if ("username" in formValues && !formValues.username) {
    errors.username = "Username is required";
  }
  if ("confirmPassword" in formValues && !formValues.confirmPassword) {
    errors.confirmPassword = "Confirm password is required";
  }
  if (
    "confirmPassword" in formValues &&
    formValues.password !== formValues.confirmPassword
  ) {
    errors.confirmPassword = "Password must match";
  }

  return errors;
};
export default validateForm;

export const validateFormSettings = (credentials: any) => {};
