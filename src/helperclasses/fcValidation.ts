import * as validator from "validator";
import * as lodash from "lodash";
import * as mongoose from "mongoose";
const typeCheck = require("type-check").typeCheck;
import { ErrorArray, ErrorMessage } from "./errors";
import * as student from "../models/Student";

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
    static validateCourses (courses: student.Course[]): ErrorArray {
        const erArray = new ErrorArray();
        const x = 0;
        lodash.forEach(courses, function (value: student.Course) {
            if (!typeCheck("Number", value.number)) {
                const erObj: ErrorMessage = new ErrorMessage("Please use only numbers for course number", "courses.number[" + x + "]", value.number);
                erArray.errors.push(erObj);
            }
            const nameRegex = /[A-Za-z ]*/;
            if (!nameRegex.test(value.name)) {
                const erObj: ErrorMessage = new ErrorMessage("Please use only letters and spaces for course name", "courses.name[" + x + "]", value.name);
                erArray.errors.push(erObj);
            }
            if (!typeCheck("Number", value.crnNumber)) {
                const erObj: ErrorMessage = new ErrorMessage("Please use only numbers for crnNumber", "courses.crnNumber[" + x + "]", value.crnNumber);
                erArray.errors.push(erObj);
            }
            // This needs to be stricter regex
            if (!validator.isAlphanumeric(value.section)) {
                const erObj: ErrorMessage = new ErrorMessage("Please use only numbers and letters for section", "courses.section[" + x + "]", value.section);
                erArray.errors.push(erObj);
            }
            if (!typeCheck("Number", value.startTime)) {
                const erObj: ErrorMessage = new ErrorMessage("Please use only numbers for start time", "courses.startTime[" + x + "]", value.startTime);
                erArray.errors.push(erObj);
            }
            if (!typeCheck("Number", value.endTime)) {
                const erObj: ErrorMessage = new ErrorMessage("Please use only numbers for end time", "courses.endTime[" + x + "]", value.endTime);
                erArray.errors.push(erObj);
            }
            let y = 0;
            lodash.forEach(value.professor, function (val: string){
                // Needs stricter regex
                if (!validator.isAlpha(val)) {
                const erObj: ErrorMessage = new ErrorMessage("Please use only letters professor", "courses.professor[" + x + "][" + y + "]", val);
                erArray.errors.push(erObj);
                }
                y++;
            });
        });
        if (!lodash.isEmpty(erArray)) {
            return erArray;
        } else {
            return undefined;
        }
    }
    static validateDegrees (degrees: student.Degree[]): ErrorArray {
        const erArray = new ErrorArray();
        let x = 0;
        lodash.forEach(degrees, function (value: student.Degree) {
            console.log(value);

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
            return erArray;
        } else {
            return undefined;
        }
    }
    static studentValidationWrapper (student: student.StudentModel) {
        const erArray = new ErrorArray();
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
        if (student.courses && FcValidation.validateCourses(student.courses)) {
            lodash.forEach(FcValidation.validateCourses(student.courses), function (val) {
                erArray.errors.push(val);
            });
        }
        if (student.degrees && FcValidation.validateDegrees(student.degrees)) {
            lodash.forEach(FcValidation.validateDegrees(student.degrees), function (val) {
                erArray.errors.push(val);
            });
        }
        if (!lodash.isEmpty(erArray)) {
            return erArray;
        } else {
            return undefined;
        }
    }
}