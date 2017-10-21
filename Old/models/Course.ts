

export interface CourseRootModel {
    subject: string,
    number: string,
    name: string,
    teachers: string[],
    tutors: string[],
    students: string[],
    sections: string[]
};

export type Section = {
    crnNumber: string,
    sectionNumber: string,
    time: string,
    professor: string
};
