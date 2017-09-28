import * as mongoose from "mongoose";

export type CourseModel = mongoose.Document & {
    subject: String,
    number: string,
    name: string,
    teachers: Array<mongoose.Types.ObjectId>,
    tutors: Array<mongoose.Types.ObjectId>,
    students: Array<mongoose.Types.ObjectId>,
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