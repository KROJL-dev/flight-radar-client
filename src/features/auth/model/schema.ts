import * as yup from "yup";

export const schema = yup.object({
  key: yup.string().required("Required"),
});
