import { Database } from "./database";
import { Question } from "./question";

const QuestionDatabase = new Database<Question["id"], Question>(
  __dirname + "/data/questions.json",
);

export default QuestionDatabase;
