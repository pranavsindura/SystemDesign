/*
- Survey
has a list of questions
has a submit button
user can submit a survey once all question are done
has average rating based on question

- Question
has a statement
has an answer field
  - rating 1 - 5
  - string answer
can be required or optional
has average rating across across all surveys using this

- User
has a unique username
can submit surveys
can create questions
can create surveys

- Build survey
- Build a question
- Submit a survey
- View average rating per question
- View average rating per survey
*/

import createServer from "./server/server";

function surveySystemTestDrive() {
  createServer();
}

export default surveySystemTestDrive;
