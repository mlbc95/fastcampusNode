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

export let postSignup = (req: Request, res: Response, next: NextFunction) => {
    // log request body
    console.log(req.body);
    // Validate as much of the schema as we can with checkbody
    // This validates the GenericUser object
    req.checkBody({
      fName: {
        isAlpha: true,
        errorMessage: "First name must contain only letters"
      },
      lName: {
        isAlpha: true,
        errorMessage: "Last name must contain only letters"
      },
      email: {
        isEmail: true,
        notEmpty: true,
        errorMessage: "Please enter a valid email in order to register"
      },
      username: {
        isAlphanumeric: true,
        notEmpty: true,
        errorMessage: "Please enter a valid username in order to register"
      },
      pNumber: {
        matches: {
          options: /\d{10,12}/
        },
        errorMessage: "Please enter a valid phone number"
      },
      school: {
        isAlpha: true,
        errorMessage: "Please use only letters and spaces for the school name"
      }
    });

    // Create array object we can push on for custom error messages
    const erArray: ErrorArray = new ErrorArray();

    // Get errors generated by express-validator
    const errors = req.validationErrors();

    // push them onto our error array
    lodash.forEach(errors, function(value) {
      erArray.errors.push(value);
    });

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
            // Create counter for our array
            let x: number = 0;

            // Loop through the degrees and add error message onto our array
            lodash.forEach(req.body.degrees, function (value: student.Degree) {
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

            // Reset array counter
            x = 0;

            // Loop through courses and validate them
            lodash.forEach(req.body.courses, function (value: student.Course) {
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
                    res.status(503).json({err: err});
                }
                // If we found a user error out and return to client
                if (existingStudent) {
                    return res.status(400).json({msg: "Account with that username address already exists."});
                }
                // Did not find user, save to db and return object to client
                user.save((err) => {
                    if (err) {
                        res.status(503).json({err: err});
                    }
                    req.logIn(user, (err) => {
                    if (err) {
                        return res.status(503).json({err: err});
                    }
                    res.json({user: user});
                    });
                });
            });
            break;
    }
};
