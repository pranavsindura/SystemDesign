export enum AnswerType {
  RATING = "rating",
  STRING = "string",
  NUMBER = "number",
}

export interface RatingAnswer {
  type: AnswerType.RATING;
  response: number;
}

export interface StringAnswer {
  type: AnswerType.STRING;
  response: string;
}

export interface NumberAnswer {
  type: AnswerType.NUMBER;
  response: string;
}

export type Answer = RatingAnswer | StringAnswer | NumberAnswer;
