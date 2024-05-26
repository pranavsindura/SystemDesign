import express from "express";
import QuestionDatabase from "../../core/questionDatabase";
import SurveyDatabase from "../../core/surveyDatabase";
import validateSurvey from "../../core/surveyValidator";
import SurveyFactory from "../../core/surveyFactory";

const surveysRouter = express.Router();
surveysRouter.get("/surveys", (req, res) => {
  try {
    const { id } = req.query;
    let surveys;
    if (typeof id === "string") {
      const idList = id.split(",");
      surveys = SurveyDatabase.getMany(idList);
    } else {
      surveys = SurveyDatabase.getAll();
    }
    res.send(surveys);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

surveysRouter.delete("/surveys/:id", (req, res) => {
  try {
    const id = req.params.id;
    console.log("Deleting survey with id", id);
    SurveyDatabase.delete(id);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(400);
  }
});

surveysRouter.post("/surveys", (req, res) => {
  try {
    const data = req.body;
    const { title, questionIdList } = data;
    console.log("got data in body", title, questionIdList);
    const maybeSurvey = {
      title,
      questionIdList,
    };
    if (validateSurvey(maybeSurvey)) {
      const areIdsValid = QuestionDatabase.getIsIdValidMany(
        maybeSurvey.questionIdList,
      );

      if (!areIdsValid) {
        throw new Error("some ids are invalid");
      }

      const surveyObject = SurveyFactory.getInstance().create(
        maybeSurvey.title,
        maybeSurvey.questionIdList,
      );

      SurveyDatabase.add(surveyObject.id, surveyObject);
      res.sendStatus(200);
    } else {
      console.error(validateSurvey.errors);
      throw new Error("invalid data");
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(400);
  }
});

export default surveysRouter;
