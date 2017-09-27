import * as bcrypt from "bcrypt-nodejs";
import * as crypto from "crypto";
import * as mongoose from "mongoose";
import { UserModel, User } from "./User";
const options = {discriminatorKey: "Kind", timestamps: true};

export interface StudentModel extends UserModel, mongoose.Document  {
  degrees: Degree[];
  courses: Course[];
}


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
  degrees: Array,
  courses: Array
}, options);

// export const User: UserType = mongoose.model<UserType>('User', userSchema);
const Student = User.discriminator("Student", studentSchema);
export default Student;