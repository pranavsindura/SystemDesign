import { Question } from "./question";

export interface Survey {
  id: string;
  title: string;
  questionIdList: Question["id"][];
}
