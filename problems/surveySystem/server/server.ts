import express, { json } from "express";
import QuestionDatabase from "../core/questionDatabase";
import SurveyDatabase from "../core/surveyDatabase";
import questionsRouter from "./routes/questions";
import surveysRouter from "./routes/surveys";
import surveyResponsesRouter from "./routes/surveyResponses";

function createServer() {
  const PORT = 8080;
  const app = express();

  app.use(json());

  app.use(questionsRouter);

  app.use(surveysRouter);

  app.use(surveyResponsesRouter);

  app.get("/health", (_, res) => {
    const questionsReady = QuestionDatabase.getIsReady();
    const surveysReady = SurveyDatabase.getIsReady();

    const isReady = questionsReady && surveysReady;
    if (isReady) {
      res.sendStatus(200);
    } else {
      res.sendStatus(500);
    }
  });

  app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
  });
}

export default createServer;
