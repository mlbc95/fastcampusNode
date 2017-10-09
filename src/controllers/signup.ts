import * as passport from "passport";
import * as _ from "lodash";
import { default as User, UserModel, AuthToken  } from "../models/User";
import { default as Student, StudentModel } from "../models/Student";
import { default as Teacher, TeacherModel } from "../models/Teacher";
import { Request, Response, NextFunction } from "express";
import { LocalStrategyInfo } from "passport-local";
import { WriteError } from "mongodb";
import { prepForSend } from "../helperclasses/prepForSend";
import { ErrorArray, ErrorMessage } from "../helperclasses/errors";
import { jwtKey } from "../config/jwt";
import * as jwt from "jsonwebtoken";
const request = require("express-validator");
import * as fc from "../helperclasses/fcValidation";

/**
 * /auth/signup | POST | allows uers to sign up
 *  Content-Type: application/json
 *  Information Expected:
 *      req.body (JSON):
 *          fName | string |  first name
 *          lName | string | last name
 *          email | string | email, REQUIRED
 *          username | string | username, REQUIRED
 *          password | string | password, REQUIRED
 *          school | string | school, REQUIRED
 *          degree | Degrees Array | degrees of user
 *      req.query["role"]:
 *          string | role | role of the user to add, should be passed in req.query
 *  Returns:
 *      Fail:
 *          400 (Bad Request):
 *              Caused by validation errors, username/email being present
 *              err | Error Array | contains an array of msg, param, value of the issues
 *          500 (Internal Serve Error):
 *              Caused by the server encountering an internal error
 *              err | Error Array | contains an array of msg, param, value of the issues
 *      Success:
 *          201 (Created):
 *              JSON:
 *                user:
 *                  id | string | MongoDB ID
 *                  fName | string |  first name
 *                  lName | string | last name
 *                  email | string | email
 *                  username | string | username
 *                  school | string | school
 *                  courses | Course Array | array of courses
 *                  role | string | the role of the user
 *                  teacher.status | string | ONLY RETURNS IF ROLE IS TEACHER
 *                  teacher.officeHours | Office Hours Array | ONLY RETURNS IF ROLE IS TEACHER
 *                  student.completedCourses | Completed Courses Array | ONLY RETURNS IF STUDENT
 *                  student.degree | Degrees Array | ONLY RETURNS IF STUDENT, degrees of user
 *                token | string | JWT token
 *
 */
export let postSignup = (req: Request, res: Response, next: NextFunction) => {
    // log request body
    console.log("POST /auth/signup");
    console.log(req.body);

    // Create user object
    let newUser: any;

    // Switch on role
    switch (req.query["role"]) {
        case "student":
            newUser = new Student ({...req.body});
            break;
        case "teacher":
            newUser = new Teacher ({...req.body});
            break;
        default:
            return res.status(400).json({err: {msg: "Please send a role along with JSON body."}});
    }
    // Pass to main validation wrapper
    const erArray: ErrorArray = fc.FcValidation.validationWrapper(newUser);

    // If we have errors pass them back to frontend
    if (!_.isEmpty(erArray.errors)) {
        return res.status(400).json({error: erArray.errors});
    }
    // Look for username
    User.findOne({ username: req.body.username }, (err, existingUser) => {
        // Handle error
        if (!_.isEmpty(err)) {
            erArray.errors.push(new ErrorMessage(err.errmsg.split(":")[0], err.errmsg.split(":")[1], err.errmsg.split(":")[3]));
            return res.status(500).json({error: erArray.errors});
        }
        // If we found a user error out and return to client
        if (existingUser) {
            return res.status(400).json({error: {message: "Account with that username address already exists."}});
        }
        // Did not find user, save to db and return object to client
        newUser.save((err: any) => {
            // Handle error
            if (!_.isEmpty(err)) {
                erArray.errors.push(new ErrorMessage(err.errmsg.split(":")[0], err.errmsg.split(":")[1], err.errmsg.split(":")[3]));
                return res.status(500).json({error: erArray.errors});
            }
            // Clear out password info
            const user = prepForSend(newUser);

            // Create token
            const token = jwt.sign(user, jwtKey(), {expiresIn: 604800});

            // Return to client
            res.status(201).json({user, token});
        });
    });
};
