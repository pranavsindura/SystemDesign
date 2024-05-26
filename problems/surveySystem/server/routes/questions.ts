import express from "express";
import QuestionDatabase from "../../core/questionDatabase";
import validateQuestion from "../../core/questionValidator";
import QuestionFactory from "../../core/questionFactory";

const questionsRouter = express.Router();

questionsRouter.get("/questions", (req, res) => {
  try {
    const { id } = req.query;
    let questions;
    if (typeof id === "string") {
      const idList = id.split(",");
      questions = QuestionDatabase.getMany(idList);
    } else {
      questions = QuestionDatabase.getAll();
    }
    res.send(questions);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

questionsRouter.delete("/questions/:id", (req, res) => {
  try {
    const id = req.params.id;
    console.log("Deleting question with id", id);
    QuestionDatabase.delete(id);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(400);
  }
});

questionsRouter.post("/questions", (req, res) => {
  try {
    const data = req.body;
    const { statement, isRequired, answerType } = data;
    console.log("got data in body", statement, isRequired, answerType);
    const maybeQuestion = {
      statement,
      isRequired,
      answerType,
    };
    if (validateQuestion(maybeQuestion)) {
      const questionObject = QuestionFactory.getInstance().create(
        maybeQuestion.statement,
        maybeQuestion.isRequired,
        maybeQuestion.answerType,
      );

      QuestionDatabase.add(questionObject.id, questionObject);
      res.sendStatus(200);
    } else {
      console.error(validateQuestion.errors);
      throw new Error("invalid data");
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(400);
  }
});

export default questionsRouter;
