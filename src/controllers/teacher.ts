import * as async from "async";
import * as crypto from "crypto";
import * as nodemailer from "nodemailer";
import * as passport from "passport";
import * as validator from "validator";
import * as lodash from "lodash";
const typeCheck = require("type-check").typeCheck;
import * as fc from "../helperclasses/fcValidation";
// import { ErrorMessage, ErrorArray } from "errors";
import { default as Teacher, DayOfWeek, Office, TeacherModel } from "../models/Teacher";
import { Request, Response, NextFunction } from "express";
import { LocalStrategyInfo } from "passport-local";
import { WriteError } from "mongodb";
import { ErrorArray, ErrorMessage } from "../helperclasses/errors";
const MongoQS = require("mongo-querystring");
const request = require("express-validator");

/**
 * POST /teacher
 * Add teacher to the db
 */
export let postTeacher = (req: Request, res: Response, next: NextFunction) => {
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
    const teacher = new Teacher({
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