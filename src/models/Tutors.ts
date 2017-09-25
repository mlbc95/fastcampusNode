import * as bcrypt from "bcrypt-nodejs";
import * as crypto from "crypto";
import * as mongoose from "mongoose";
import { User } from "./User";
const options = {discriminatorKey: "Kind", timestamps: true};

export type TutorModel = mongoose.Document & {
    fName: string,
    lName: string,
    email: string,
    username: string,
    school: string,
    password: string,
    pNumber: string,
    passwordResetToken: string,
    passwordResetExpires: Date,
    courses: Course[],
    available: DayOfWeek[],
    office: Office

    comparePassword: (candidatePassword: string, cb: (err: any, isMatch: any) => {}) => void,
};

export type Course = {
    number: number,
    name: string
};

export type DayOfWeek = {
    day: string,
    hours: string[],
    office: Office
};

export type Office = {
    building: string,
    roomNumber: string
};

const tutorSchema = new mongoose.Schema({
    courses: Array,
    available: Array,
    office: Object
}, options);

const Tutor = mongoose.model("Tutor", tutorSchema);
export default Tutor;
