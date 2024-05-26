import * as uuid from "uuid";
import { Question } from "./question";
import { Survey } from "./survey";

class SurveyFactory {
  private static instance: SurveyFactory;
  static getInstance() {
    if (SurveyFactory.instance == null) {
      SurveyFactory.instance = new SurveyFactory();
    }
    return SurveyFactory.instance;
  }

  private constructor() {}

  create(title: string, questionIdList: Question["id"][]): Survey {
    return {
      id: uuid.v4(),
      title,
      questionIdList,
    };
  }
}

export default SurveyFactory;
