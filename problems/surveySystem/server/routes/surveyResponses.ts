import { Router } from "express";
import SurveyResponseDatabase from "../../core/surveyResponseDatabase";
import validateSurveyResponse from "../../core/surveyResponseValidator";
import SurveyResponseFactory from "../../core/surveyResponseFactory";
import SurveyDatabase from "../../core/surveyDatabase";
import QuestionDatabase from "../../core/questionDatabase";
import validateAnswer from "../../core/answerValidator";

const surveyResponsesRouter = Router();

surveyResponsesRouter.get("/surveyResponses", (req, res) => {
  try {
    const { id } = req.query;
    let surveyResponses;
    if (typeof id === "string") {
      const idList = id.split(",");
      surveyResponses = SurveyResponseDatabase.getMany(idList);
    } else {
      surveyResponses = SurveyResponseDatabase.getAll();
    }
    res.send(surveyResponses);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

surveyResponsesRouter.delete("/surveyResponses/:id", (req, res) => {
  try {
    const id = req.params.id;
    console.log("Deleting surveyResponse with id", id);
    SurveyResponseDatabase.delete(id);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(400);
  }
});

surveyResponsesRouter.post("/surveyResponses", (req, res) => {
  try {
    const data = req.body;
    const { username, answerMap, surveyId } = data;
    console.log("got data in body", username, answerMap, surveyId);
    const maybeSurveyResponse = {
      username,
      answerMap,
      surveyId,
    };
    if (validateSurveyResponse(maybeSurveyResponse)) {
      const survey = SurveyDatabase.get(maybeSurveyResponse.surveyId);

      const questionIdSet = new Set(survey.questionIdList);

      let isValid = true;

      const answerQuestionIdList = Object.keys(maybeSurveyResponse.answerMap);
      for (const answerQuestionId of answerQuestionIdList) {
        if (questionIdSet.has(answerQuestionId)) {
          questionIdSet.delete(answerQuestionId);
        } else {
          // there is some extra answer which is not part of the survey
          isValid = false;
          break;
        }
      }

      if (!isValid) {
        throw new Error("answerMap contains extra responses");
      }

      const { idMap: questionIdMap } = QuestionDatabase.getMany(
        survey.questionIdList,
      );

      for (const missingQuestionId of questionIdSet) {
        const question = questionIdMap[missingQuestionId];
        if (question == null) {
          throw new Error("question not found in db");
        }
        if (question.isRequired) {
          isValid = false;
          break;
        }
      }

      if (!isValid) {
        throw new Error(
          "there are some question which are required but not answered",
        );
      }

      for (const answerQuestionId of answerQuestionIdList) {
        const question = questionIdMap[answerQuestionId];
        const answer = maybeSurveyResponse.answerMap[answerQuestionId];

        if (question == null) {
          throw new Error("question not found in db");
        }

        if (!validateAnswer(answer)) {
          console.log(answer);
          console.error(validateAnswer.errors);
          throw new Error("answer is not valid");
        }

        if (question.answerType !== answer.type) {
          throw new Error("answer type does not match question answer type");
        }
      }

      const surveyResponseObject = SurveyResponseFactory.getInstance().create(
        maybeSurveyResponse.username,
        maybeSurveyResponse.surveyId,
        maybeSurveyResponse.answerMap,
      );

      SurveyResponseDatabase.add(surveyResponseObject.id, surveyResponseObject);
      res.sendStatus(200);
    } else {
      console.error(validateSurveyResponse.errors);
      throw new Error("invalid data");
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(400);
  }
});

export default surveyResponsesRouter;
