import * as bcrypt from "bcrypt-nodejs";
import * as crypto from "crypto";
import * as mongoose from "mongoose";
import { User } from "./User";
const options = {discriminatorKey: "Kind", timestamps: true};

export type StudentModel = mongoose.Document & {
  fName: string,
  lName: string,
  email: string,
  username: string,
  school: string,
  password: string,
  pNumber: string,
  degrees: Degree[],
  courses: Course[],
  passwordResetToken: string,
  passwordResetExpires: Date,

  comparePassword: (candidatePassword: string, cb: (err: any, isMatch: any) => {}) => void,
  gravatar: (size: number) => string
};


export type Degree = {
  level: string,
  name: string
};

export type Course = {
  number: number,
  name: string,
  crnNumber: number,
  section: string,
  startTime: number,
  endTime: number,
  professor: string[]
};
export const studentSchema = new mongoose.Schema({
  year: String,
  degrees: Array,
  courses: Array
}, options);

// export const User: UserType = mongoose.model<UserType>('User', userSchema);
const Student = User.discriminator("Student", studentSchema);
export default Student;