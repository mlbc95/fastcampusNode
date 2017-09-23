import * as mongoose from "mongoose";

export type TutorModel = mongoose.Document & {
    fName: string,
    lName: string,
    school: string,
    courses: Course[],
    available: DayOfWeek[],
    office: Office
};

export type Course = {
    number: number,
    name: string
};

export type DayOfWeek = {
    day: string,
    hours: string[]
};

export type Office = {
    building: string,
    roomNumber: string
};

const tutorSchema = new mongoose.Schema({
    fName: String,
    lName: String,
    school: String,
    courses: Array,
    available: Array,
    office: Object
});

const Tutor = mongoose.model("Tutor", tutorSchema);
export default Tutor;
