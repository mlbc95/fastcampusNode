import * as bcrypt from "bcrypt-nodejs";
import * as crypto from "crypto";
import * as mongoose from "mongoose";
import { User, UserModel } from "./User";
const options = {discriminatorKey: "Kind", timestamps: true};

export interface TutorModel extends UserModel, Document {
    courses: Course[];
    available: DayOfWeek[];
}

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
}, options);

const Tutor = mongoose.model("Tutor", tutorSchema);
export default Tutor;
