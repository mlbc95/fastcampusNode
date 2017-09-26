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
            const erObj: ErrorMessage = new ErrorMessage("Please use only letters for first name", "fName", fName);
            return erObj;
        }
        return undefined;
    }
    static validateLName (lName: string): ErrorMessage {
        if (!typeCheck("String", lName) && !validator.isAlpha(lName)) {
            const erObj: ErrorMessage = new ErrorMessage("Please use only letters for last name", "fName", lName);
            return erObj;
        }
        return undefined;
    }
    static validateEmail (email: string): ErrorMessage {
        if (!typeCheck("String", email) && !validator.isEmail(email)) {
            const erObj: ErrorMessage = new ErrorMessage("Please use a valid email address", "email", email);
            return erObj;
        }
        return undefined;
    }
    static validateSchool (school: string): ErrorMessage {
        const regex = /((\w+) ?){1,}/;
        if (!typeCheck("String", school) && !regex.test(school)) {
            const erObj: ErrorMessage = new ErrorMessage("Please enter a valid school name", "school", school);
            return erObj;
          }
          return undefined;
    }
    static validateUsername (username: string): ErrorMessage {
        if (!typeCheck("String", username) && !validator.isAlphanumeric(username)) {
            const erObj: ErrorMessage = new ErrorMessage("Please enter a valid username", "username", username);
            return erObj;
        }
        return undefined;
    }
    static validatePNumber (pNumber: string): ErrorMessage {
        if (!typeCheck("String", pNumber) && !validator.isMobilePhone(pNumber, "en-US")) {
            const erObj: ErrorMessage = new ErrorMessage("Please enter a valid pNumber", "pNumber", pNumber);
            return erObj;
        }
        return undefined;
    }
    static validateStudentCourses (courses: student.Course[]): ErrorArray {
        const erArray = new ErrorArray();
        let x = 0;
        lodash.forEach(courses, function (course: student.Course) {
            if (!typeCheck("Number", course.number)) {
                const erObj: ErrorMessage = new ErrorMessage("Please use only numbers for course number", "courses.number[" + x + "]", course.number);
                erArray.errors.push(erObj);
            }
            const CourseRegex = /((\w+) ?){1,}/;
            if (course.name && !CourseRegex.test(course.name)) {
                const erObj: ErrorMessage = new ErrorMessage("Please use only letters and spaces for course name", "courses.name[" + x + "]", course.name);
                erArray.errors.push(erObj);
            }
            if (course.crnNumber && !typeCheck("Number", course.crnNumber)) {
                const erObj: ErrorMessage = new ErrorMessage("Please use only numbers for crnNumber", "courses.crnNumber[" + x + "]", course.crnNumber);
                erArray.errors.push(erObj);
            }
            if (course.section && !CourseRegex.test(course.section)) {
                const erObj: ErrorMessage = new ErrorMessage("Please use only numbers and letters for section", "courses.section[" + x + "]", course.section);
                erArray.errors.push(erObj);
            }
            if (course.startTime && !typeCheck("Number", course.startTime)) {
                const erObj: ErrorMessage = new ErrorMessage("Please use only numbers for start time", "courses.startTime[" + x + "]", course.startTime);
                erArray.errors.push(erObj);
            }
            if (course.endTime && !typeCheck("Number", course.endTime)) {
                const erObj: ErrorMessage = new ErrorMessage("Please use only numbers for end time", "courses.endTime[" + x + "]", course.endTime);
                erArray.errors.push(erObj);
            }

            let y = 0;
            lodash.forEach(course.professor, function (prof: string){
                // Needs stricter regex
                if (!validator.isAlpha(prof)) {
                const erObj: ErrorMessage = new ErrorMessage("Please use only letters professor", "courses.professor[" + x + "][" + y + "]", prof);
                erArray.errors.push(erObj);
                }
                y++;
            });
            x++;
        });
        if (!lodash.isEmpty(erArray)) {
            return undefined;
        } else {
            return erArray;
        }
    }
    static validateTutorCourses (courses: tutor.Course[]): ErrorArray {
        const erArray = new ErrorArray();
        let x = 0;
        lodash.forEach(courses, function (course: tutor.Course) {
            if (!typeCheck("Number", course.number)) {
                const erObj: ErrorMessage = new ErrorMessage("Please use only numbers for course number", "courses.number[" + x + "]", course.number);
                erArray.errors.push(erObj);
            }
            const regex = /((\w+) ?){1,}/;
            if (!regex.test(course.name)) {
                const erObj: ErrorMessage = new ErrorMessage("Please use only letters and spaces for course name", "courses.name[" + x + "]", course.name);
                erArray.errors.push(erObj);
            }
            x++;
        });
        if (!lodash.isEmpty(erArray)) {
            return undefined;
        } else {
            return erArray;
        }
    }
    static validateAvailable (available: tutor.DayOfWeek[]): ErrorArray {
        let x = 0;
        const erArray = new ErrorArray();
        lodash.forEach(available, function (value: tutor.DayOfWeek) {
            if (!typeCheck("String", value.day)) {
                const erObj: ErrorMessage = new ErrorMessage("Please use only letters for day", "available.day[" + x + "]", value.day);
                erArray.errors.push(erObj);
            }
            const y = 0;
            lodash.forEach(value.hours, function (val: string[]) {
                if (!typeCheck("String", val)) {
                    const erObj: ErrorMessage = new ErrorMessage("Please use only numbers", "available.hours[" + x + "][" + y + "]", val);
                    erArray.errors.push(erObj);
                }
            });
            if (!typeCheck("String", value.office.building)) {
                const erObj: ErrorMessage = new ErrorMessage("Please use only letters and spaces for name", "office.building[" + x + "]", value.office.building);
                erArray.errors.push(erObj);
            }
            if (!typeCheck("String", value.office.roomNumber)) {
                const erObj: ErrorMessage = new ErrorMessage("Please use only letters and spaces for number", "office.building[" + x + "]", value.office.roomNumber);
                erArray.errors.push(erObj);
            }
            x++;
        });
        if (!lodash.isEmpty(erArray)) {
            return undefined;
        } else {
            return erArray;
        }
    }
    static validateDegrees (degrees: student.Degree[]): ErrorArray {
        const erArray = new ErrorArray();
        let x = 0;
        console.log(degrees);
        lodash.forEach(degrees, function (value: student.Degree) {

            // If the level is not characters error out
            if (!validator.isAlpha(value.level)) {
                const erObj: ErrorMessage = new ErrorMessage("Please use only letters and spaces for level", "degrees.level[" + x + "]", value.level);
                erArray.errors.push(erObj);
            }

            // If the name is not characters error out
            if (!validator.isAlpha(value.name)) {
                const erObj: ErrorMessage = new ErrorMessage("Please use only letters and spaces for name", "degrees.name[" + x + "]", value.name);
                erArray.errors.push(erObj);
            }
            // Increase our array counter
            x++;
        });
        if (!lodash.isEmpty(erArray)) {
            return undefined;
        } else {
            return erArray;
        }
    }
    static studentValidationWrapper (student: student.StudentModel, erArray: ErrorArray) {
        if (student.fName && FcValidation.validateFName(student.fName)) {
            erArray.errors.push(FcValidation.validateFName(student.fName));
        }
        if (student.lName && FcValidation.validateLName(student.lName)) {
            erArray.errors.push(FcValidation.validateLName(student.lName));
        }
        if (student.email && FcValidation.validateEmail(student.email)) {
            erArray.errors.push(FcValidation.validateEmail(student.email));
        }
        if (student.school && FcValidation.validateSchool(student.school)) {
            erArray.errors.push(FcValidation.validateSchool(student.school));
        }
        if (student.username && FcValidation.validateUsername(student.username)) {
            erArray.errors.push(FcValidation.validateUsername(student.username));
        }
        if (student.pNumber && FcValidation.validatePNumber(student.pNumber)) {
            erArray.errors.push(FcValidation.validatePNumber(student.pNumber));
        }
        if (student.courses && FcValidation.validateStudentCourses(student.courses)) {
            lodash.forEach(FcValidation.validateStudentCourses(student.courses), function (val) {
                erArray.errors.push(val);
            });
        }
        if (student.degrees && FcValidation.validateDegrees(student.degrees)) {
            lodash.forEach(FcValidation.validateDegrees(student.degrees), function (val) {
                erArray.errors.push(val);
            });
        }
    }
    static tutorValidationWrapper (tutor: tutor.TutorModel, erArray: ErrorArray) {
        if (tutor.fName && FcValidation.validateFName(tutor.fName)) {
            erArray.errors.push(FcValidation.validateFName(tutor.fName));
        }
        if (tutor.lName && FcValidation.validateLName(tutor.lName)) {
            erArray.errors.push(FcValidation.validateLName(tutor.lName));
        }
        if (tutor.email && FcValidation.validateEmail(tutor.email)) {
            erArray.errors.push(FcValidation.validateEmail(tutor.email));
        }
        if (tutor.school && FcValidation.validateSchool(tutor.school)) {
            erArray.errors.push(FcValidation.validateSchool(tutor.school));
        }
        if (tutor.username && FcValidation.validateUsername(tutor.username)) {
            erArray.errors.push(FcValidation.validateUsername(tutor.username));
        }
        if (tutor.pNumber && FcValidation.validatePNumber(tutor.pNumber)) {
            erArray.errors.push(FcValidation.validatePNumber(tutor.pNumber));
        }
        if (tutor.courses && FcValidation.validateTutorCourses(tutor.courses)) {
            lodash.forEach(FcValidation.validateTutorCourses(tutor.courses), function (val) {
                erArray.errors.push(val);
            });
        }
        if (tutor.available && FcValidation.validateAvailable(tutor.available)) {
            lodash.forEach(FcValidation.validateAvailable(tutor.available), function (value) {
                erArray.errors.push(value);
            });
        }
    }
}