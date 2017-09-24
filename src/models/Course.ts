import * as mongoose from "mongoose";

export type CourseModel = mongoose.Document & {
    subject: String,
    number: string,
    name: string,
    sections: Section[]
};

export type Section = {
    crnNumber: string,
    sectionNumber: string,
    time: string,
    professor: string
};

const courseSchema = new mongoose.Schema({
    subject: String,
    number: String,
    name: String,
    Section: Array
}, {timestamps: true});

const Course = mongoose.model("Course", courseSchema);
export default Course;