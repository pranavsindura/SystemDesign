import Ajv, { JSONSchemaType } from "ajv";
import { SurveyResponse } from "./surveyResponses";
import { answerSchema } from "./answerValidator";

const ajv = new Ajv();
const surveyResponseSchema: JSONSchemaType<SurveyResponse> = {
  type: "object",
  properties: {
    id: {
      type: "string",
    },
    surveyId: {
      type: "string",
    },
    username: {
      type: "string",
      minLength: 8,
    },
    answerMap: {
      type: "object",
      properties: {
        values: answerSchema,
      },
      required: [],
    },
  },
  required: ["username", "answerMap", "surveyId"],
  additionalProperties: false,
};

const validateSurveyResponse = ajv.compile(surveyResponseSchema);

export default validateSurveyResponse;
