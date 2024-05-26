import Ajv, { JSONSchemaType } from "ajv";
import { Answer, AnswerType } from "./answer";

const ajv = new Ajv({
  discriminator: true,
});

export const answerSchema: JSONSchemaType<Answer> = {
  type: "object",
  required: [],
  oneOf: [
    {
      type: "object",
      properties: {
        type: { const: AnswerType.RATING },
        response: { type: "number", minimum: 1, maximum: 5 },
      },
      required: ["type", "response"],
      additionalProperties: false,
    },
    {
      type: "object",
      properties: {
        type: { const: AnswerType.STRING },
        response: { type: "string", minLength: 1 },
      },
      required: ["type", "response"],
      additionalProperties: false,
    },
    {
      type: "object",
      properties: {
        type: { const: AnswerType.NUMBER },
        response: { type: "number" },
      },
      required: ["type", "response"],
      additionalProperties: false,
    },
  ],
};

const validateAnswer = ajv.compile(answerSchema);

export default validateAnswer;
