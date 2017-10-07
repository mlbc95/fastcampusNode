import * as validator from "validator";
import * as _ from "lodash";
import * as mongoose from "mongoose";
const typeCheck = require("type-check").typeCheck;
import { ErrorArray, ErrorMessage } from "./errors";
import * as student from "../models/Student";
import * as teacher from "../models/Teacher";
import * as user from "../models/User";
import * as course from "../models/Course";

export class FcValidation {
    /**
     * Functions return undefined due to TypeScript not allowing null or false.
     *
     * Functions are negated in order to avoid having empty success.
     */
    static validateAlphaString(propertyValue: string, propertyName: string = "", failureMessage: string = ""): ErrorMessage {
        if (!typeCheck("String", propertyValue) && !validator.isAlpha(propertyValue)) {
            const errorMessage: ErrorMessage = new ErrorMessage(failureMessage, propertyName, propertyValue);
            return errorMessage;
        }
        return undefined;
    }
    static validateEmail (email: string): ErrorMessage {
        if (!typeCheck("String", email) && !validator.isEmail(email)) {
            const errorMessage: ErrorMessage = new ErrorMessage("Please use a valid email address", "email", email);
            return errorMessage;
        }
        return undefined;
    }
    static validateWordWithSpacePattern (propertyValue: string, propertyName: string = "", failureMessage: string = ""): ErrorMessage {
        // This regex allows a word followed by an optional space.  This pattern must occur at least once
        const regex = /((\w+)[ -]?){1,}/;
        if (!typeCheck("String", propertyValue) && !regex.test(propertyValue)) {
            const errorMessage: ErrorMessage = new ErrorMessage(failureMessage, propertyName, propertyValue);
            return errorMessage;
          }
          return undefined;
    }
    static validateNumberString (propertyValue: string, propertyName: string = "", failureMessage: string = ""): ErrorMessage {
        const regex = /\d+/;
        if (!typeCheck("String", propertyValue) && !regex.test(propertyValue)) {
            const errorMessage: ErrorMessage = new ErrorMessage(failureMessage, propertyName, propertyValue);
            return errorMessage;
        }
        return undefined;
    }
    static validateUsername (username: string): ErrorMessage {
        if (!typeCheck("String", username) && !validator.isAlphanumeric(username)) {
            const errorMessage: ErrorMessage = new ErrorMessage("Please enter a valid username", "username", username);
            return errorMessage;
        }
        return undefined;
    }
    static validatePNumber (pNumber: string): ErrorMessage {
        if (!typeCheck("String", pNumber) && !validator.isMobilePhone(pNumber, "en-US")) {
            const errorMessage: ErrorMessage = new ErrorMessage("Please enter a valid pNumber", "pNumber", pNumber);
            return errorMessage;
        }
        return undefined;
    }
    static validateUserCourses (courseArrayIn: user.Course[]): ErrorArray {
        const errorArray = new ErrorArray();
        let i = 0;
        _.forEach(courseArrayIn, function (course: user.Course) {
            if (!typeCheck("Number", course.number)) {
                const errorMessage: ErrorMessage = new ErrorMessage("Please use only numbers for course number", "courses.number[" + i + "]", course.number);
                errorArray.errors.push(errorMessage);
            }
            if (course.name && !FcValidation.validateWordWithSpacePattern(course.name)) {
                errorArray.errors.push(FcValidation.validateWordWithSpacePattern(course.name, "courses.name[" + i + "]", "Please use only letters and spaces for course name"));
            }
            if (course.crnNumber && !typeCheck("Number", course.crnNumber)) {
                const errorMessage: ErrorMessage = new ErrorMessage("Please use only numbers for crnNumber", "courses.crnNumber[" + i + "]", course.crnNumber);
                errorArray.errors.push(errorMessage);
            }
            if (course.section && !validator.isAlphanumeric(course.section)) {
                const errorMessage: ErrorMessage = new ErrorMessage("Please use only numbers and letters for section", "courses.section[" + i + "]", course.section);
                errorArray.errors.push(errorMessage);
            }
            if (course.startTime && !typeCheck("Number", course.startTime)) {
                const errorMessage: ErrorMessage = new ErrorMessage("Please use only numbers for start time", "courses.startTime[" + i + "]", course.startTime);
                errorArray.errors.push(errorMessage);
            }
            if (course.endTime && !typeCheck("Number", course.endTime)) {
                const errorMessage: ErrorMessage = new ErrorMessage("Please use only numbers for end time", "courses.endTime[" + i + "]", course.endTime);
                errorArray.errors.push(errorMessage);
            }

            let j = 0;
            _.forEach(course.professor, function (prof: string){
                // Needs stricter regex
                if (!validator.isAlpha(prof)) {
                    const errorMessage: ErrorMessage = new ErrorMessage("Please use only letters professor", "courses.professor[" + i + "][" + j + "]", prof);
                    errorArray.errors.push(errorMessage);
                }
                j++;
            });
            i++;
        });
        if (!_.isEmpty(errorArray)) {
            return undefined;
        } else {
            return errorArray;
        }
    }
    static validateCompletedCourses (completedCourses: student.CompletedCourse[]): ErrorArray {
       const errorArray = new ErrorArray();
       let x = 0;
        _.forEach(completedCourses, function (completedCourse: student.CompletedCourse) {
            if (completedCourse.subject && !FcValidation.validateWordWithSpacePattern(completedCourse.subject)) {
                errorArray.errors.push(FcValidation.validateWordWithSpacePattern(completedCourse.subject, "completedCourse.subject[" + x + "]", "PLease enter valid subject name"));
            }
            if (completedCourse.number && !validator.isNumeric(completedCourse.number)) {
                const errorMessage = new ErrorMessage("Please enter valid number", "completedCourse.number[" + x + "]", completedCourse.number);
                errorArray.errors.push(errorMessage);
            }
            if (completedCourse.name && !FcValidation.validateWordWithSpacePattern(completedCourse.name)) {
                errorArray.errors.push(FcValidation.validateWordWithSpacePattern(completedCourse.name, "completedCourse.name[" + x + "]", "PLease enter valid name"));
            }
            if (completedCourse.grade && !/[ABCDF]{1}/.test(completedCourse.grade)) {
                const errorMessage = new ErrorMessage("Please enter valid grade", "completedCourse.grade[" + x + "]", completedCourse.grade);
                errorArray.errors.push(errorMessage);
            }
            x++;
        });
        if (!_.isEmpty(errorArray)) {
            return undefined;
        } else {
            return errorArray;
        }
    }
    static validateMongoIdArray (propertyValue: string[], propertyName: string = "", failureMessage: string = ""): ErrorMessage {
        let x = 0;
        const errorArray = new ErrorArray();
        _.forEach(propertyValue, function (MongoId: string) {
            if (!validator.isMongoId(MongoId)) {
                const errorMessage = new ErrorMessage("Please enter valid mongoid", propertyName + "[" + x + "]", MongoId);
                errorArray.errors.push(errorMessage);
            }
            x++;
        });
        return undefined;
    }
    static validateOfficeHours (dayOfWeekArray: teacher.DayOfWeek[]): ErrorArray {
        let i = 0;
        const errorArray = new ErrorArray();
        _.forEach(dayOfWeekArray, function (dayOfWeek: teacher.DayOfWeek) {
            if (!typeCheck("String", dayOfWeek.day)) {
                const errorMessage: ErrorMessage = new ErrorMessage("Please use only letters for day", "officeHourse.day[" + i + "]", dayOfWeek.day);
                errorArray.errors.push(errorMessage);
            }
            let j = 0;
            _.forEach(dayOfWeek.hours, function (val: string[]) {
                if (!typeCheck("String", val)) {
                    const errorMessage: ErrorMessage = new ErrorMessage("Please use only numbers", "officeHourse.hours[" + i + "][" + j + "]", val);
                    errorArray.errors.push(errorMessage);
                }
                j++;
            });
            if (!FcValidation.validateWordWithSpacePattern(dayOfWeek.office.building)) {
                errorArray.errors.push(FcValidation.validateWordWithSpacePattern(dayOfWeek.office.building, "office.building[" + i + "]", "Please use only letters and spaces for name"));
            }
            if (!typeCheck("String", dayOfWeek.office.roomNumber) && !validator.isAlphanumeric(dayOfWeek.office.roomNumber)) {
                const errorMessage: ErrorMessage = new ErrorMessage("Please use only letters and spaces for number", "office.building[" + i + "]", dayOfWeek.office.roomNumber);
                errorArray.errors.push(errorMessage);
            }
            i++;
        });
        if (!_.isEmpty(errorArray)) {
            return undefined;
        } else {
            return errorArray;
        }
    }
    static validateDegrees (degrees: student.Degree[]): ErrorArray {
        const errorArray = new ErrorArray();
        let i = 0;
        _.forEach(degrees, function (degree: student.Degree) {
            if (!FcValidation.validateAlphaString(degree.level)) {
                errorArray.errors.push(FcValidation.validateAlphaString(degree.level, "degrees.level[" + i + "]", "Please use only letters and spaces for level"));
            }
            if (!FcValidation.validateWordWithSpacePattern(degree.name)) {
                errorArray.errors.push(FcValidation.validateWordWithSpacePattern(degree.name, "degrees.name[" + i + "]", "Please use only letters and spaces for name"));
            }
            i++;
        });
        if (!_.isEmpty(errorArray)) {
            return undefined;
        } else {
            return errorArray;
        }
    }
    static studentValidationWrapper (student: student.StudentModel, errorArray: ErrorArray) {
        if (student.fName && FcValidation.validateAlphaString(student.fName, "fName" , "Please enter a valid name")) {
            errorArray.errors.push(FcValidation.validateAlphaString(student.fName, "fName" , "Please enter a valid name"));
        }
        if (student.lName && FcValidation.validateAlphaString(student.lName, "lName" , "Please enter a valid name")) {
            errorArray.errors.push(FcValidation.validateAlphaString(student.lName, "lName" , "Please enter a valid name"));
        }
        if (student.email && FcValidation.validateEmail(student.email)) {
            errorArray.errors.push(FcValidation.validateEmail(student.email));
        }
        if (student.school && FcValidation.validateWordWithSpacePattern(student.school)) {
            errorArray.errors.push(FcValidation.validateWordWithSpacePattern(student.school, "school", "Please user only letters and spaces"));
        }
        if (student.username && FcValidation.validateUsername(student.username)) {
            errorArray.errors.push(FcValidation.validateUsername(student.username));
        }
        if (student.pNumber && FcValidation.validatePNumber(student.pNumber)) {
            errorArray.errors.push(FcValidation.validatePNumber(student.pNumber));
        }
        if (student.courses && FcValidation.validateUserCourses(student.courses)) {
            _.forEach(FcValidation.validateUserCourses(student.courses), function (error) {
                errorArray.errors.push(error);
            });
        }
        if (student.completedCourses && FcValidation.validateCompletedCourses(student.completedCourses)) {
            _.forEach(FcValidation.validateCompletedCourses(student.completedCourses), function(error) {
                errorArray.errors.push(error);
            });
        }
        if (student.degrees && FcValidation.validateDegrees(student.degrees)) {
            _.forEach(FcValidation.validateDegrees(student.degrees), function (error) {
                errorArray.errors.push(error);
            });
        }
    }
    static teacherValidationWrapper (teacher: teacher.TeacherModel, errorArray: ErrorArray) {
        if (teacher.fName && FcValidation.validateAlphaString(teacher.fName, "fName" , "Please enter a valid name")) {
            errorArray.errors.push(FcValidation.validateAlphaString(teacher.fName, "fName" , "Please enter a valid name"));
        }
        if (teacher.lName && FcValidation.validateAlphaString(teacher.lName, "lName" , "Please enter a valid name")) {
            errorArray.errors.push(FcValidation.validateAlphaString(teacher.lName, "lName" , "Please enter a valid name"));
        }
        if (teacher.email && FcValidation.validateEmail(teacher.email)) {
            errorArray.errors.push(FcValidation.validateEmail(teacher.email));
        }
        if (teacher.school && FcValidation.validateWordWithSpacePattern(teacher.school)) {
            errorArray.errors.push(FcValidation.validateWordWithSpacePattern(teacher.school, "school", "Please user only letters and spaces"));
        }
        if (teacher.username && FcValidation.validateUsername(teacher.username)) {
            errorArray.errors.push(FcValidation.validateUsername(teacher.username));
        }
        if (teacher.pNumber && FcValidation.validatePNumber(teacher.pNumber)) {
            errorArray.errors.push(FcValidation.validatePNumber(teacher.pNumber));
        }
        if (teacher.courses && FcValidation.validateUserCourses(teacher.courses)) {
            _.forEach(FcValidation.validateUserCourses(teacher.courses), function (error) {
                errorArray.errors.push(error);
            });
        }
        if (teacher.officeHours && FcValidation.validateOfficeHours(teacher.officeHours)) {
            _.forEach(FcValidation.validateOfficeHours(teacher.officeHours), function (error) {
                errorArray.errors.push(error);
            });
        }
    }
    static courseValidationWrapper (course: course.CourseModel, errorArray: ErrorArray) {
        if (course.subject && FcValidation.validateWordWithSpacePattern(course.subject)) {
            errorArray.errors.push(FcValidation.validateWordWithSpacePattern(course.subject, "subject", "Please enter valid subject"));
        }
        if (course.number && FcValidation.validateNumberString(course.number)) {
            errorArray.errors.push(FcValidation.validateNumberString(course.number, "course.number", "Please use only numbers"));
        }
        if (course.name && FcValidation.validateWordWithSpacePattern(course.name)) {
            errorArray.errors.push(FcValidation.validateWordWithSpacePattern(course.name, "course.name", "Please use words for the name"));
        }
        if (course.teachers && FcValidation.validateMongoIdArray(course.teachers)) {
            _.forEach(FcValidation.validateMongoIdArray(course.teachers, "course.teachers", "Please enter valid MongoId"), function (error) {
                errorArray.errors.push(error);
            });
        }
        if (course.tutors && FcValidation.validateMongoIdArray(course.tutors)) {
            _.forEach(FcValidation.validateMongoIdArray(course.tutors, "course.tutors", "Please enter valid MongoId"), function (error) {
                errorArray.errors.push(error);
            });
        }
        if (course.students && FcValidation.validateMongoIdArray(course.students)) {
            _.forEach(FcValidation.validateMongoIdArray(course.students, "course.students", "Please enter valid MongoId"), function (error) {
                errorArray.errors.push(error);
            });
        }
    }
}