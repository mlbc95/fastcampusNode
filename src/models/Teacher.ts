import * as mongoose from "mongoose";
import { UserModel, User } from "./User";
const options = {discriminatorKey: "role", timestamps: true};
export interface TeacherModel extends UserModel, mongoose.Document  {
    status: {
        type: string,
        default: ""
    };
    officeHours: {
        type: DayOfWeek[],
        default: DayOfWeek[]
    };
}

export type DayOfWeek = {
    day: {
        type: string
        default: ""
    },
    hours: {
        type: string[],
        default: string[]
    },
    office: {
        type: Office,
        default: {}
    }
};

export type Office = {
    building: {
        type: string,
        default: ""
    },
    roomNumber: {
        type: string,
        default: ""
    }
};


export const teacherSchema = new mongoose.Schema({
  status: String,
  officeHours: Array
}, options);

const Teacher = User.discriminator("Teacher", teacherSchema);
export default Teacher;