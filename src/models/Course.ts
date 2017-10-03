import * as mongoose from "mongoose";

export type CourseModel = mongoose.Document & {
    subject: string,
    number: string,
    name: string,
    teachers: string[],
    tutors: string[],
    students: string[],
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
    teachers: Array,
    tutors: Array,
    students: Array,
    sections: Array
}, {timestamps: true});

const Course = mongoose.model("Course", courseSchema);
export default Course;