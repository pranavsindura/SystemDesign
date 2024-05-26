import * as uuid from "uuid";
import { SurveyResponse } from "./surveyResponses";
import { Survey } from "./survey";

class SurveyResponseFactory {
  private static instance: SurveyResponseFactory;
  static getInstance() {
    if (SurveyResponseFactory.instance == null) {
      SurveyResponseFactory.instance = new SurveyResponseFactory();
    }
    return SurveyResponseFactory.instance;
  }

  private constructor() {}

  create(
    username: string,
    surveyId: Survey["id"],
    answerMap: SurveyResponse["answerMap"],
  ): SurveyResponse {
    return {
      id: uuid.v4(),
      surveyId,
      username,
      answerMap,
    };
  }
}

export default SurveyResponseFactory;
