import fs from "fs";
import {
  Question,
  QuestionIdList,
  QuestionIdMap,
  QuestionUpdate,
} from "./question";

export class QuestionDB {
  questionIdList: QuestionIdList;
  questionIdMap: QuestionIdMap;
  isReady: boolean;
  filePath: string;

  constructor(filePath: string) {
    this.questionIdMap = {};
    this.questionIdList = [];
    this.filePath = filePath;
    this.isReady = false;
  }

  async loadDataFromStorage() {
    fs.readFile(this.filePath, (err, data) => {
      if (err) {
        console.error(
          "error loading data from file, but continuing",
          this.filePath,
          err,
        );
        this.isReady = true;
        return;
      }

      console.log("loading data from file", this.filePath);
      const dataJSON = JSON.parse(data.toString());
      this.questionIdMap = dataJSON.questionIdMap;
      this.questionIdList = dataJSON.questionIdList;
      console.log("loaded", this.questionIdList.length, "question ids to list");
      console.log(
        "loaded",
        Object.keys(this.questionIdMap).length,
        "question ids to map",
      );
    });
  }

  async setDataToStorage() {
    fs.writeFile(
      this.filePath,
      JSON.stringify({
        questionIdMap: this.questionIdMap,
        questionIdList: this.questionIdList,
      }),
      (err) => {
        if (err) {
          console.error(
            "error writing data to file, but continuing",
            this.filePath,
            err,
          );
          return;
        }

        console.log("wrote data to file", this.filePath);
      },
    );
  }

  add(question: Question) {
    if (this.questionIdMap[question.id] != null) {
      throw new Error("question id already exists");
    }
    this.questionIdMap[question.id] = question;
    this.questionIdList.push(question.id);
  }

  delete(questionId: Question["id"]) {
    const idx = this.questionIdList.indexOf(questionId);
    if (idx !== -1) {
      this.questionIdList.splice(idx, 1);
    } else {
      throw new Error("question id does not exist");
    }
  }

  update(questionId: Question["id"], questionUpdate: QuestionUpdate) {
    if (this.questionIdMap[questionId] == null) {
      throw new Error("question id does not exist");
    }

    this.questionIdMap[questionId] = {
      ...this.questionIdMap[questionId],
      ...questionUpdate,
      id: questionId,
    };
  }

  get(questionId: Question["id"]) {
    if (this.questionIdMap[questionId] == null) {
      throw new Error("question id does not exist");
    }
    return this.questionIdMap[questionId];
  }
}
