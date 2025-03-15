import yup from '../yupGlobal';

export const registerSchema = yup.object().shape({
  name: yup
    .string()
    .required('Username required')
    .min(8, "Username must be at least 8 characters"),
  email: yup
    .string()
    .required('Email required')
    .email("Email invalid"),
  password: yup
    .string()
    .required('Password required')
    .password('Password invalid'),
  confirmPassword: yup
    .string()
    .required('Confirm password required')
    .password('Confirm password invalid')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});
