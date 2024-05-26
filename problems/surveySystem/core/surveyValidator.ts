import Ajv, { JSONSchemaType } from "ajv";
import { Survey } from "./survey";

const ajv = new Ajv();
const surveySchema: JSONSchemaType<Survey> = {
  type: "object",
  properties: {
    id: {
      type: "string",
    },
    title: {
      type: "string",
      minLength: 10,
      maxLength: 100,
    },
    questionIdList: {
      type: "array",
      items: {
        type: "string",
      },
      minItems: 1,
    },
  },
  required: ["title", "questionIdList"],
  additionalProperties: false,
};

const validateSurvey = ajv.compile(surveySchema);

export default validateSurvey;
