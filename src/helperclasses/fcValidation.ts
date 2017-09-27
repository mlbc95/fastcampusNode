import * as validator from "validator";
import * as _ from "lodash";
import * as mongoose from "mongoose";
const typeCheck = require("type-check").typeCheck;
import { ErrorArray, ErrorMessage } from "./errors";
import * as student from "../models/Student";
import * as tutor from "../models/Tutors";

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
        const regex = /((\w+) ?){1,}/;
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
    static validateStudentCourses (courseArrayIn: student.Course[]): ErrorArray {
        const errorArray = new ErrorArray();
        let i = 0;
        _.forEach(courseArrayIn, function (course: student.Course) {
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
    static validateTutorCourses (courseArrayIn: tutor.Course[]): ErrorArray {
        const errorArray = new ErrorArray();
        let i = 0;
        _.forEach(courseArrayIn, function (course: tutor.Course) {
            if (!typeCheck("Number", course.number)) {
                const errorMessage: ErrorMessage = new ErrorMessage("Please use only numbers for course number", "courses.number[" + i + "]", course.number);
                errorArray.errors.push(errorMessage);
            }
            if (course.name && !FcValidation.validateWordWithSpacePattern(course.name)) {
                errorArray.errors.push(FcValidation.validateWordWithSpacePattern(course.name, "courses.name[" + i + "]", "Please use only letters and spaces for course name"));
            }
            i++;
        });
        if (!_.isEmpty(errorArray)) {
            return undefined;
        } else {
            return errorArray;
        }
    }
    static validateAvailable (dayOfWeekArray: tutor.DayOfWeek[]): ErrorArray {
        let i = 0;
        const errorArray = new ErrorArray();
        _.forEach(dayOfWeekArray, function (dayOfWeek: tutor.DayOfWeek) {
            if (!typeCheck("String", dayOfWeek.day)) {
                const errorMessage: ErrorMessage = new ErrorMessage("Please use only letters for day", "available.day[" + i + "]", dayOfWeek.day);
                errorArray.errors.push(errorMessage);
            }
            let j = 0;
            _.forEach(dayOfWeek.hours, function (val: string[]) {
                if (!typeCheck("String", val)) {
                    const errorMessage: ErrorMessage = new ErrorMessage("Please use only numbers", "available.hours[" + i + "][" + j + "]", val);
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
        if (student.courses && FcValidation.validateStudentCourses(student.courses)) {
            _.forEach(FcValidation.validateStudentCourses(student.courses), function (error) {
                errorArray.errors.push(error);
            });
        }
        if (student.degrees && FcValidation.validateDegrees(student.degrees)) {
            _.forEach(FcValidation.validateDegrees(student.degrees), function (error) {
                errorArray.errors.push(error);
            });
        }
    }
    static tutorValidationWrapper (tutor: tutor.TutorModel, errorArray: ErrorArray) {
        if (tutor.fName && FcValidation.validateAlphaString(tutor.fName, "fName" , "Please enter a valid name")) {
            errorArray.errors.push(FcValidation.validateAlphaString(tutor.fName, "fName" , "Please enter a valid name"));
        }
        if (tutor.lName && FcValidation.validateAlphaString(tutor.lName, "lName" , "Please enter a valid name")) {
            errorArray.errors.push(FcValidation.validateAlphaString(tutor.lName, "lName" , "Please enter a valid name"));
        }
        if (tutor.email && FcValidation.validateEmail(tutor.email)) {
            errorArray.errors.push(FcValidation.validateEmail(tutor.email));
        }
        if (tutor.school && FcValidation.validateWordWithSpacePattern(tutor.school)) {
            errorArray.errors.push(FcValidation.validateWordWithSpacePattern(tutor.school, "school", "Please user only letters and spaces"));
        }
        if (tutor.username && FcValidation.validateUsername(tutor.username)) {
            errorArray.errors.push(FcValidation.validateUsername(tutor.username));
        }
        if (tutor.pNumber && FcValidation.validatePNumber(tutor.pNumber)) {
            errorArray.errors.push(FcValidation.validatePNumber(tutor.pNumber));
        }
        if (tutor.courses && FcValidation.validateTutorCourses(tutor.courses)) {
            _.forEach(FcValidation.validateTutorCourses(tutor.courses), function (error) {
                errorArray.errors.push(error);
            });
        }
        if (tutor.available && FcValidation.validateAvailable(tutor.available)) {
            _.forEach(FcValidation.validateAvailable(tutor.available), function (error) {
                errorArray.errors.push(error);
            });
        }
    }
}