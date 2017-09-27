import * as async from "async";
import * as crypto from "crypto";
import * as nodemailer from "nodemailer";
import * as passport from "passport";
import * as validator from "validator";
import * as lodash from "lodash";
const typeCheck = require("type-check").typeCheck;
import { default as User, UserModel, AuthToken  } from "../models/User";
import { default as Student } from "../models/Student";
import * as student from "../models/student";
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
     * This is where it gets messy
     * Because of the way mongo is setup the type of user we are creating has to be known prior
     * to the creation of the object.  Because of this the type is being passed in the url with
     * the req.body containing the information to validate.
     *
     * After this eatch case in the switch is handling a seperate type of user being added.  At
     * some point this should be moved to function calls, but for now we will leave it out in
     * the open.
     */
    switch (req.query["kind"]) {
        case "student":
            // Run validation on the student object
            fc.FcValidation.studentValidationWrapper(req.body, erArray);

            // If we got errors error out and return to client
            if (!lodash.isEmpty(erArray.errors)) {
                req.flash("errors", erArray);
                return res.status(400).json({msg: "Data did not pass validation", err: erArray.errors, data: req.body});
            }

            // We passed validation create new student
            const user = new Student({
                fName: req.body.fName || "",
                lName: req.body.lName || "",
                school: req.body.school,
                pNumber: req.body.pNumber || "",
                degrees: req.body.degrees || [],
                courses: req.body.courses || [],
                email: req.body.email,
                password: req.body.password,
                username: req.body.username
            });

            // Make sure that the username does not exist in the db already
            Student.findOne({ username: req.body.username }, (err, existingStudent) => {
                // Handle error
                if (err) {
                    res.status(500).json({err: err});
                }
                // If we found a user error out and return to client
                if (existingStudent) {
                    return res.status(400).json({msg: "Account with that username address already exists."});
                }
                // Did not find user, save to db and return object to client
                user.save((err) => {
                    if (err) {
                        res.status(500).json({err: err});
                    }
                    req.logIn(user, (err) => {
                    if (err) {
                        return res.status(500).json({err: err});
                    }
                    res.status(201).json({user: user});
                    });
                });
            });
            break;
    }
};
