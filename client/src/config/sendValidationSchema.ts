import * as yup from "yup";

export const sendValidationSchema = yup.object({
  message: yup.string().required(),
  countryCode: yup
    .number()
    .nullable()
    .typeError("countryCode must be a `number` type")
    .positive()
    .integer()
    .min(100)
    .max(999)
    .transform((_, val) => (val ? Number(val) : null)),
  delay: yup
    .number()
    .typeError("delay must be a `number` type")
    .positive()
    .integer()
    .required()
    .min(2)
    .max(60),
});
