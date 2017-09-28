import * as mongoose from "mongoose";
import { UserModel, User } from "./User";
const options = {discriminatorKey: "role", timestamps: true};
export interface TeacherModel extends UserModel, mongoose.Document  {
    status: string;
    officeHours: DayOfWeek[];
}

export type DayOfWeek = {
    day: string,
    hours: string[],
    office: Office
};

export type Office = {
    building: string,
    roomNumber: string
};


export const teacherSchema = new mongoose.Schema({
  status: String,
  officeHours: Array
}, options);

const Teacher = User.discriminator("Teacher", teacherSchema);
export default Teacher;