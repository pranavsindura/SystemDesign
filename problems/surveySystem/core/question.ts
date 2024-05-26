import { AnswerType } from "./answer";

export interface QuestionRequiredAnswer {
  isRequired: true;
  answerType: AnswerType;
}

export interface QuestionOptionalAnswer {
  isRequired: false;
  answerType: AnswerType;
}

export interface QuestionCommon {
  id: string;
  statement: string;
}

export type Question = QuestionCommon &
  (QuestionRequiredAnswer | QuestionOptionalAnswer);
