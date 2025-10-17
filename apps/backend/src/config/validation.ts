import * as Joi from "joi";

export const validationSchema = Joi.object({
  DATABASE_URL: Joi.string().uri().required(),
  JWT_SECRET: Joi.string().min(16).required(),
  JWT_EXPIRES_IN: Joi.string().default("3600s"),
  REFRESH_SECRET: Joi.string().min(16).required(),
  REFRESH_EXPIRES_IN: Joi.string().default("7d"),
  PORT: Joi.number().default(4000),
  PUPPETEER_EXECUTABLE_PATH: Joi.string().allow("").optional(),
});
