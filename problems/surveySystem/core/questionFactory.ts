import * as uuid from "uuid";
import { AnswerType } from "./answer";
import { Question } from "./question";

class QuestionFactory {
  private static instance: QuestionFactory;
  static getInstance() {
    if (QuestionFactory.instance == null) {
      QuestionFactory.instance = new QuestionFactory();
    }
    return QuestionFactory.instance;
  }

  private constructor() {}

  create(
    statement: string,
    isRequired: boolean,
    answerType: AnswerType,
  ): Question {
    return {
      id: uuid.v4(),
      answerType,
      statement,
      isRequired,
    };
  }
}

export default QuestionFactory;
