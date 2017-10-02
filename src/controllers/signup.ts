import * as passport from "passport";
import * as _ from "lodash";
import { default as User, UserModel, AuthToken  } from "../models/User";
import { default as Student, StudentModel } from "../models/Student";
import { default as Teacher, TeacherModel } from "../models/Teacher";
import { Request, Response, NextFunction } from "express";
import { LocalStrategyInfo } from "passport-local";
import { WriteError } from "mongodb";
import { ErrorArray, ErrorMessage } from "../helperclasses/errors";
const request = require("express-validator");
import * as fc from "../helperclasses/fcValidation";

export let postSignup = (req: Request, res: Response, next: NextFunction) => {
    // log request body
    console.log(req.body);

    // Create array object we can push on for custom error messages
    const erArray: ErrorArray = new ErrorArray();

    /**
     * The switch handles different users types based on the query
     */
    switch (req.query["role"]) {
        case "student":
            // Run validation on the student object
            fc.FcValidation.studentValidationWrapper(req.body, erArray);

            // If we got errors error out and return to client
            if (!_.isEmpty(erArray.errors)) {
                req.flash("errors", erArray);
                return res.status(400).json({msg: "Data did not pass validation", err: erArray.errors, data: req.body});
            }

            // We passed validation create new student
            const student = new Student({
                fName: req.body.fName || "",
                lName: req.body.lName || "",
                school: req.body.school,
                pNumber: req.body.pNumber || "",
                degrees: req.body.degrees || [],
                courses: req.body.courses || [],
                email: req.body.email,
                password: req.body.password,
                username: req.body.username,
                completedCourses: req.body.completedCourses || []
            });

            // Make sure that the username does not exist in the db already
            User.findOne({ username: req.body.username }, (err, existingUser) => {
                // Handle error
                if (err) {
                    return res.status(500).json({err: err});
                }
                // If we found a user error out and return to client
                if (existingUser) {
                    return res.status(400).json({msg: "Account with that username address already exists."});
                }
                // Did not find user, save to db and return object to client
                student.save((err) => {
                    if (err) {
                        return res.status(500).json({err: err});
                    }
                    req.logIn(student, (err) => {
                        if (err) {
                            return res.status(500).json({err: err});
                        }
                        // Forced to cast object to StudentModel
                        _.forEach(student, function(castedStudent: StudentModel) {
                            castedStudent.password = undefined;
                            castedStudent.passwordResetExpires = undefined;
                            castedStudent.passwordResetToken = undefined;
                        });
                        res.status(201).json({user: student});
                    });
                });
            });
            break;
        case "teacher":
            // Run validation on the student object
            fc.FcValidation.teacherValidationWrapper(req.body, erArray);

            // If we got errors error out and return to client
            if (!_.isEmpty(erArray.errors)) {
                return res.status(400).json({msg: "Data did not pass validation", err: erArray.errors, data: req.body});
            }

            // We passed validation create new student
            const teacher = new Teacher({
                fName: req.body.fName || "",
                lName: req.body.lName || "",
                school: req.body.school,
                pNumber: req.body.pNumber || "",
                courses: req.body.courses || [],
                email: req.body.email,
                password: req.body.password,
                username: req.body.username,
                status: req.body.status || "",
                officeHours: req.body.officeHours || []
            });

            // Make sure that the username does not exist in the db already
            User.findOne({ username: req.body.username }, (err, existingUser) => {
                // Handle error
                if (err) {
                    return res.status(500).json({err: err});
                }
                // If we found a user error out and return to client
                if (existingUser) {
                    return res.status(400).json({msg: "Account with that username address already exists."});
                }
                // Did not find user, save to db and return object to client
                teacher.save((err) => {
                    if (err) {
                        return res.status(500).json({err: err});
                    }
                    req.logIn(teacher, (err) => {
                        if (err) {
                            return res.status(500).json({err: err});
                        }
                        // Forced to cast object to StudentModel
                        _.forEach(teacher, function (castedTeacher: TeacherModel) {
                            castedTeacher.password = undefined;
                            castedTeacher.passwordResetExpires = undefined;
                            castedTeacher.passwordResetToken = undefined;
                        });
                        res.status(201).json({user: teacher});
                    });
                });
            });
            break;
        default:
            return res.json(400);
    }
};
