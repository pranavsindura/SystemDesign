import { Database } from "./database";
import { SurveyResponse } from "./surveyResponses";

const SurveyResponseDatabase = new Database<
  SurveyResponse["id"],
  SurveyResponse
>(__dirname + "/data/surveyReponses.json");

export default SurveyResponseDatabase;
