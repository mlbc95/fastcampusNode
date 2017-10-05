import * as mongoose from "mongoose";

export type CourseModel = mongoose.Document & {
    subject: {
        type: string,
        default: ""
      },
    number: {
        type: string,
        default: ""
      },
    name: {
        type: string,
        default: ""
      },
    teachers: {
        type: string[],
        default: string[]
    },
    tutors: {
        type: string[],
        default: string[]
    },
    students: {
        type: string[],
        default: string[]
    },
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