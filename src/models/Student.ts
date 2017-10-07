import * as mongoose from "mongoose";
import { UserModel, User } from "./User";
const options = {discriminatorKey: "role", timestamps: true};

export interface StudentModel extends UserModel, mongoose.Document  {
  completedCourses: {
    type: CompletedCourse[],
    default: CompletedCourse[]
  };
  degrees: {
    type: Degree[],
    default: Degree[]
  };
}

export type CompletedCourse = {
  subject: {
    type: string,
    default: ""
  },
  name: {
    type: string,
    default: ""
  },
  number: {
    type: string,
    default: ""
  },
  grade: {
    type: string,
    default: ""
  }
};
export type Degree = {
  level: {
    type: string,
    default: ""
  },
  name: {
    type: string,
    default: ""
  }
};


export const studentSchema = new mongoose.Schema({
  degrees: Array,
  completedCourses: Array
}, options);

const Student = User.discriminator("Student", studentSchema);
export default Student;