import * as mongoose from "mongoose";

export interface Lab extends mongoose.Document {
    tutors: string[];
    officeHours: DayOfWeek[];
    building: string;
    room: string;
    name: string;
    description: string;
    relatedCourses: string[];
}

export type DayOfWeek = {
    day: string,
    hours: string[]
};

export const labSchema = new mongoose.Schema({
    tutors: Array,
    officeHours: Array,
    building: String,
    room: String,
    name: String,
    description: String,
    relatedCourses: Array
});

export const Lab = mongoose.model("Lab", labSchema);