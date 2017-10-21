import * as mongoose from "mongoose";

export interface Appointment extends mongoose.Document {
    tutors: string[];
    students: string[];
    building: string;
    room: string;
    time: string;
    relatedCourses: string[];
}

export const appointmentSchema = new mongoose.Schema({
    tutors: Array,
    students: Array,
    building: String,
    room: String,
    time: String,
    relatedCourses: Array
});

export const Appointment = mongoose.model("Appointment", appointmentSchema);