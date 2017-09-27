import * as validator from "validator";
import * as lodash from "lodash";
import * as mongoose from "mongoose";
const typeCheck = require("type-check").typeCheck;
import { ErrorArray, ErrorMessage } from "./errors";
import * as student from "../models/Student";
import * as tutor from "../models/Tutors";

export class FcValidation {
    static validateFName (fName: string): ErrorMessage {
        if (!typeCheck("String", fName) && !validator.isAlpha(fName)) {
            const errorMessage: ErrorMessage = new ErrorMessage("Please use only letters for first name", "fName", fName);
            return errorMessage;
        }
        return undefined;
    }
    static validateLName (lName: string): ErrorMessage {
        if (!typeCheck("String", lName) && !validator.isAlpha(lName)) {
            const errorMessage: ErrorMessage = new ErrorMessage("Please use only letters for last name", "fName", lName);
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
    static validateSchool (school: string): ErrorMessage {
        const regex = /((\w+) ?){1,}/;
        if (!typeCheck("String", school) && !regex.test(school)) {
            const errorMessage: ErrorMessage = new ErrorMessage("Please enter a valid school name", "school", school);
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
        lodash.forEach(courseArrayIn, function (course: student.Course) {
            if (!typeCheck("Number", course.number)) {
                const errorMessage: ErrorMessage = new ErrorMessage("Please use only numbers for course number", "courses.number[" + i + "]", course.number);
                errorArray.errors.push(errorMessage);
            }
            const CourseRegex = /((\w+) ?){1,}/;
            if (course.name && !CourseRegex.test(course.name)) {
                const errorMessage: ErrorMessage = new ErrorMessage("Please use only letters and spaces for course name", "courses.name[" + i + "]", course.name);
                errorArray.errors.push(errorMessage);
            }
            if (course.crnNumber && !typeCheck("Number", course.crnNumber)) {
                const errorMessage: ErrorMessage = new ErrorMessage("Please use only numbers for crnNumber", "courses.crnNumber[" + i + "]", course.crnNumber);
                errorArray.errors.push(errorMessage);
            }
            if (course.section && !CourseRegex.test(course.section)) {
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
            lodash.forEach(course.professor, function (prof: string){
                // Needs stricter regex
                if (!validator.isAlpha(prof)) {
                const errorMessage: ErrorMessage = new ErrorMessage("Please use only letters professor", "courses.professor[" + i + "][" + j + "]", prof);
                errorArray.errors.push(errorMessage);
                }
                j++;
            });
            i++;
        });
        if (!lodash.isEmpty(errorArray)) {
            return undefined;
        } else {
            return errorArray;
        }
    }
    static validateTutorCourses (courseArrayIn: tutor.Course[]): ErrorArray {
        const errorArray = new ErrorArray();
        let i = 0;
        lodash.forEach(courseArrayIn, function (course: tutor.Course) {
            if (!typeCheck("Number", course.number)) {
                const errorMessage: ErrorMessage = new ErrorMessage("Please use only numbers for course number", "courses.number[" + i + "]", course.number);
                errorArray.errors.push(errorMessage);
            }
            const regex = /((\w+) ?){1,}/;
            if (!regex.test(course.name)) {
                const errorMessage: ErrorMessage = new ErrorMessage("Please use only letters and spaces for course name", "courses.name[" + i + "]", course.name);
                errorArray.errors.push(errorMessage);
            }
            i++;
        });
        if (!lodash.isEmpty(errorArray)) {
            return undefined;
        } else {
            return errorArray;
        }
    }
    static validateAvailable (available: tutor.DayOfWeek[]): ErrorArray {
        let i = 0;
        const errorArray = new ErrorArray();
        lodash.forEach(available, function (value: tutor.DayOfWeek) {
            if (!typeCheck("String", value.day)) {
                const errorMessage: ErrorMessage = new ErrorMessage("Please use only letters for day", "available.day[" + i + "]", value.day);
                errorArray.errors.push(errorMessage);
            }
            let j = 0;
            lodash.forEach(value.hours, function (val: string[]) {
                if (!typeCheck("String", val)) {
                    const errorMessage: ErrorMessage = new ErrorMessage("Please use only numbers", "available.hours[" + i + "][" + j + "]", val);
                    errorArray.errors.push(errorMessage);
                }
                j++;
            });
            if (!typeCheck("String", value.office.building)) {
                const errorMessage: ErrorMessage = new ErrorMessage("Please use only letters and spaces for name", "office.building[" + i + "]", value.office.building);
                errorArray.errors.push(errorMessage);
            }
            if (!typeCheck("String", value.office.roomNumber)) {
                const errorMessage: ErrorMessage = new ErrorMessage("Please use only letters and spaces for number", "office.building[" + i + "]", value.office.roomNumber);
                errorArray.errors.push(errorMessage);
            }
            i++;
        });
        if (!lodash.isEmpty(errorArray)) {
            return undefined;
        } else {
            return errorArray;
        }
    }
    static validateDegrees (degrees: student.Degree[]): ErrorArray {
        const errorArray = new ErrorArray();
        let i = 0;
        lodash.forEach(degrees, function (value: student.Degree) {

            // If the level is not characters error out
            if (!validator.isAlpha(value.level)) {
                const errorMessage: ErrorMessage = new ErrorMessage("Please use only letters and spaces for level", "degrees.level[" + i + "]", value.level);
                errorArray.errors.push(errorMessage);
            }

            // If the name is not characters error out
            if (!validator.isAlpha(value.name)) {
                const errorMessage: ErrorMessage = new ErrorMessage("Please use only letters and spaces for name", "degrees.name[" + i + "]", value.name);
                errorArray.errors.push(errorMessage);
            }
            // Increase our array counter
            i++;
        });
        if (!lodash.isEmpty(errorArray)) {
            return undefined;
        } else {
            return errorArray;
        }
    }
    static studentValidationWrapper (student: student.StudentModel, errorArray: ErrorArray) {
        if (student.fName && FcValidation.validateFName(student.fName)) {
            errorArray.errors.push(FcValidation.validateFName(student.fName));
        }
        if (student.lName && FcValidation.validateLName(student.lName)) {
            errorArray.errors.push(FcValidation.validateLName(student.lName));
        }
        if (student.email && FcValidation.validateEmail(student.email)) {
            errorArray.errors.push(FcValidation.validateEmail(student.email));
        }
        if (student.school && FcValidation.validateSchool(student.school)) {
            errorArray.errors.push(FcValidation.validateSchool(student.school));
        }
        if (student.username && FcValidation.validateUsername(student.username)) {
            errorArray.errors.push(FcValidation.validateUsername(student.username));
        }
        if (student.pNumber && FcValidation.validatePNumber(student.pNumber)) {
            errorArray.errors.push(FcValidation.validatePNumber(student.pNumber));
        }
        if (student.courses && FcValidation.validateStudentCourses(student.courses)) {
            lodash.forEach(FcValidation.validateStudentCourses(student.courses), function (val) {
                errorArray.errors.push(val);
            });
        }
        if (student.degrees && FcValidation.validateDegrees(student.degrees)) {
            lodash.forEach(FcValidation.validateDegrees(student.degrees), function (val) {
                errorArray.errors.push(val);
            });
        }
    }
    static tutorValidationWrapper (tutor: tutor.TutorModel, errorArray: ErrorArray) {
        if (tutor.fName && FcValidation.validateFName(tutor.fName)) {
            errorArray.errors.push(FcValidation.validateFName(tutor.fName));
        }
        if (tutor.lName && FcValidation.validateLName(tutor.lName)) {
            errorArray.errors.push(FcValidation.validateLName(tutor.lName));
        }
        if (tutor.email && FcValidation.validateEmail(tutor.email)) {
            errorArray.errors.push(FcValidation.validateEmail(tutor.email));
        }
        if (tutor.school && FcValidation.validateSchool(tutor.school)) {
            errorArray.errors.push(FcValidation.validateSchool(tutor.school));
        }
        if (tutor.username && FcValidation.validateUsername(tutor.username)) {
            errorArray.errors.push(FcValidation.validateUsername(tutor.username));
        }
        if (tutor.pNumber && FcValidation.validatePNumber(tutor.pNumber)) {
            errorArray.errors.push(FcValidation.validatePNumber(tutor.pNumber));
        }
        if (tutor.courses && FcValidation.validateTutorCourses(tutor.courses)) {
            lodash.forEach(FcValidation.validateTutorCourses(tutor.courses), function (val) {
                errorArray.errors.push(val);
            });
        }
        if (tutor.available && FcValidation.validateAvailable(tutor.available)) {
            lodash.forEach(FcValidation.validateAvailable(tutor.available), function (value) {
                errorArray.errors.push(value);
            });
        }
    }
}