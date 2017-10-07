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
/**
 * Handle preflighted headers
 */
export let optionsSignUp = (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).header("Allow", "POST, OPTIONS");
};

/**
 *
 * @param req
 * @param res
 * @param next
 */
export let postSignup = (req: Request, res: Response, next: NextFunction) => {
    // log request body
    console.log(req.body);
    let newUser: any;
    // Create array object we can push on for custom error messages
    const erArray: ErrorArray = new ErrorArray();
    switch (req.query["role"]) {
        case "student":
            newUser = new Student ({...req.body});
            break;
        case "teacher":
            newUser = new Teacher ({...req.body});
            break;
    }
    // Pass to main validation wrapper
    fc.FcValidation.validationWrapper(newUser, erArray);

    // If we have errors pass them back to frontend
    if (!_.isEmpty(erArray.errors)) {
        req.flash("errors", erArray);
        return res.status(400).json({err: erArray.errors});
    }
    // Look for username
    User.findOne({ username: req.body.username }, (err, existingUser) => {
        // Handle error
        if (!_.isEmpty(err)) {
            return res.status(500).json({err});
        }
        // If we found a user error out and return to client
        if (existingUser) {
            return res.status(400).json({err:{msg: "Account with that username address already exists."}});
        }
        // Did not find user, save to db and return object to client
        newUser.save((err: any) => {
            // Handle error
            if (!_.isEmpty(err)) {
                return res.status(500).json({err});
            }
            // Login in
            req.logIn(newUser, (err) => {
                // Handle error
                if (!_.isEmpty(err)) {
                    return res.status(500).json({err});
                }
                // Clear out password info
                newUser.password = undefined;
                newUser.passwordResetExpires = undefined;
                newUser.passwordResetToken = undefined;
                res.status(201).json({user: newUser});
            });
        });
    });
};
