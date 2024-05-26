import { Database } from "./database";
import { Survey } from "./survey";

const SurveyDatabase = new Database<Survey["id"], Survey>(
  __dirname + "/data/surveys.json",
);

export default SurveyDatabase;
