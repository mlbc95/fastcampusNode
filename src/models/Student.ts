import * as mongoose from "mongoose";
import { UserModel, User } from "./User";
const options = {discriminatorKey: "role", timestamps: true};

export interface StudentModel extends UserModel, mongoose.Document  {
  completedCourses: CompletedCourse[];
  degrees: Degree[];
}

export type CompletedCourse = {
  subject: string,
  name: string,
  number: string,
  grade: string
};
export type Degree = {
  level: string,
  name: string
};


export const studentSchema = new mongoose.Schema({
  degrees: Array,
  completedCourses: Array
}, options);

const Student = User.discriminator("Student", studentSchema);
export default Student;