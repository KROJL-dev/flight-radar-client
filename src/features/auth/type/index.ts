import * as yup from "yup";
import { schema } from "../model/schema";

export type LoginForm = yup.InferType<typeof schema>;
