import { Answer } from "./answer";
import { Question } from "./question";
import { Survey } from "./survey";

export interface SurveyResponse {
  id: string;
  surveyId: Survey["id"];
  username: string;
  answerMap: {
    [key: Question["id"]]: Answer;
  };
}
