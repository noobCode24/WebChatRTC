import yup from '../yupGlobal';

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required('Username required')
    .email("Email invalid"),
  password: yup
    .string()
    .required('Password required')
    .password('Password invalid')
});
