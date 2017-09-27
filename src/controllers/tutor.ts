import * as async from "async";
import * as crypto from "crypto";
import * as nodemailer from "nodemailer";
import * as passport from "passport";
import * as validator from "validator";
import * as lodash from "lodash";
const typeCheck = require("type-check").typeCheck;
import * as fc from "../helperclasses/fcValidation";
// import { ErrorMessage, ErrorArray } from "errors";
import { default as Tutor, Course, DayOfWeek, Office, TutorModel } from "../models/Tutors";
import { Request, Response, NextFunction } from "express";
import { LocalStrategyInfo } from "passport-local";
import { WriteError } from "mongodb";
import { ErrorArray, ErrorMessage } from "../helperclasses/errors";
const MongoQS = require("mongo-querystring");
const request = require("express-validator");


/**
 * POST /tutor
 * Add tutor to the db
 */
export let postTutor = (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    // Create array object we can push on for custom error messages
    const erArray: ErrorArray = new ErrorArray();
    // pass to validation wrapper
    fc.FcValidation.tutorValidationWrapper(req.body, erArray);

    // Validation done, check if errors are present
    if (!lodash.isEmpty(erArray.errors)) {
        return res.status(400).json({msg: "Data did not pass validation", err: erArray.errors, data: req.body});
    }

    // If we are here we passed validation, time to add tutor
    const tutor = new Tutor({
        fName: req.body.fName || "",
        lName: req.body.lName || "",
        school: req.body.school || "",
        email: req.body.email || "",
        username: req.body.username || "",
        pNumber: req.body.pNumber || "",
        courses: req.body.courses || [],
        available: req.body.available || []
    });
    tutor.save((err) => {
        if (err) {
            res.status(500).json({err: err});
        }
        res.status(201).json({tutor: tutor});
    });
};

/**
 * PATCH /tutor/
 * updates tutor by ID in the DB
 */
export let patchTutor = (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);

    // Create array object we can push on for custom error messages
    const erArray: ErrorArray = new ErrorArray();
    // pass to validation wrapper
    fc.FcValidation.tutorValidationWrapper(req.body, erArray);

    // Validation done, check if errors are present
    if (!lodash.isEmpty(erArray.errors)) {
        return res.status(400).json({msg: "Data did not pass validation", err: erArray.errors});
    }
    // Find tutor and update
    Tutor.findById(req.body.id, (err, tutor: TutorModel) => {
        // Handle error
        if (err) {
            return res.status(500).json({err: err});
        }
        // Set objects that are present
        if (req.body.fName) {
            tutor.fName = req.body.fName;
        }
        if (req.body.lName) {
            tutor.lName = req.body.lName;
        }
        if (req.body.school) {
            tutor.school = req.body.school;
        }
        if (req.body.courses) {
            tutor.courses = req.body.courses;
        }
        if (req.body.available) {
            tutor.available = req.body.available;
        }
        tutor.save((err) => {
            if (err) {
                return res.status(500).json({err: err});
            }
            res.status(200).json({msg: "Tutor has been updated", tutor: tutor});
        });
    });
};

/**
 * GET /tutor
 *
 */
export let getTutor = (req: Request, res: Response, next: NextFunction) => {
    // Log incoming query
    console.log(req.query);
    // Create custom query
    const qs = new MongoQS ({
        custom: {
            urlQueryParamName: function (query: TutorModel, input: TutorModel) {
                // Validate input coming through
                if (input.id) {
                    query["_id"] = input.id;
                }
                if (input.fName) {
                    query["fName"] = input.fName;
                }
                if (input.lName) {
                    query["lName"] = input.lName;
                }
                if (input.school) {
                    query["school"] = input.school;
                }
                if (input.courses) {
                    query["courses"] = input.courses;
                }
                if (input.available) {
                    query["available"] = input.available;
                }
            }
        }
    });
    // parse query
    const query = qs.parse(req.query);
    // query and return to front end
    Tutor.find(query, (err, ret: Document []) => {
        if (err) {
            return res.status(500).json({err: err});
        }
        console.log(ret);
        res.status(200).json({tutor: ret});
    });
};

export let deleteTutor = (req: Request, res: Response, next: NextFunction) => {
    Tutor.remove({ _id: req.body.id }, (err) => {
        if (err) {
            return res.status(500).json({err: err});
        }
        res.status(200).json({msg: "Tutor deleted"});
    });
  };