import * as yup from "yup";

const requiredErrorText = "Campo obligatorio";
const minErrorGenerator = ({ min }) => `Debe tener ${min} o más caracteres`;
const maxErrorGenerator = ({ max }) => `Debe tener ${max} o menos caracteres`;

const fullName = yup
  .string()
  .required(requiredErrorText)
  .min(5, minErrorGenerator)
  .max(70, maxErrorGenerator);

const email = yup
  .string()
  .required(requiredErrorText)
  .max(255, maxErrorGenerator)
  .email("La dirección de correo electrónico no es válida");

const password = yup
  .string()
  .min(8, minErrorGenerator)
  .max(255, maxErrorGenerator)
  .required(requiredErrorText);

const repeatPassword = yup
  .string()
  .required(requiredErrorText)
  .test("matchPasswords", "Las contraseñas deben coincidir", function (value) {
    return this.parent.password === value;
  });

const invitationCode = yup.string().max(300, maxErrorGenerator);

export const signupValidationSchema = yup.object({
  fullName,
  email,
  password,
  repeatPassword,
  invitationCode,
});

export const loginValidationSchema = yup.object({
  email,
  password: yup.string().required(requiredErrorText),
});


export const subjectValidationSchema = yup.object({
  name: yup.string().required(requiredErrorText).max(50, maxErrorGenerator),
  description: yup.string().required(requiredErrorText),
  cardDescription: yup.string().required(requiredErrorText).max(200, maxErrorGenerator),
  image_url: yup.string().required(requiredErrorText),
  start_date: yup.string().nullable(),
  end_date: yup.string().nullable(),
  course_id: yup.number(),
  stripe_id: yup.string().required(requiredErrorText),
});