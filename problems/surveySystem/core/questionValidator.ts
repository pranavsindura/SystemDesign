import Ajv, { JSONSchemaType } from "ajv";
import { Question } from "./question";
import { AnswerType } from "./answer";

const ajv = new Ajv();
const questionSchema: JSONSchemaType<Question> = {
  type: "object",
  properties: {
    answerType: {
      type: "string",
      enum: [AnswerType.STRING, AnswerType.RATING, AnswerType.NUMBER],
    },
    id: {
      type: "string",
    },
    isRequired: {
      type: "boolean",
    },
    statement: {
      type: "string",
      minLength: 10,
      maxLength: 100,
    },
  },
  required: ["answerType", "isRequired", "statement"],
  additionalProperties: false,
};

const validateQuestion = ajv.compile(questionSchema);

export default validateQuestion;
