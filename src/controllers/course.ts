import * as async from "async";
import * as crypto from "crypto";
import * as nodemailer from "nodemailer";
import * as passport from "passport";
import * as validator from "validator";
import * as lodash from "lodash";
const typeCheck = require("type-check").typeCheck;
// import { ErrorMessage, ErrorArray } from "errors";
import { Request, Response, NextFunction } from "express";
import { LocalStrategyInfo } from "passport-local";
import { WriteError } from "mongodb";
import { default as Course, Section, CourseModel } from "../models/Course";
import { ErrorArray, ErrorMessage } from "../helperclasses/errors";
const MongoQS = require("mongo-querystring");
const request = require("express-validator");


/**
 * POST /course
 * Add course to the db
 */
export let postCourse = (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    // Create array object we can push on for custom error messages
    const erArray: ErrorArray = new ErrorArray();

    // Validate as much of the schema as we can with checkbody
    const regex = /([A-Za-z ,-])\w+/;
    if (req.body.subject && !regex.test(req.body.subject)) {
        const erObj: ErrorMessage = new ErrorMessage("Please enter a valid subject name", "subject", req.body.subject);
        erArray.errors.push(erObj);
    }
    const numRegex = /\d+/;
    if (req.body.number && !numRegex.test(req.body.number)) {
        const erObj: ErrorMessage = new ErrorMessage("Please enter a valid number", "number", req.body.number);
        erArray.errors.push(erObj);
    }
    if (req.body.name && !regex.test(req.body.name)) {
        const erObj: ErrorMessage = new ErrorMessage("Please enter a valid name", "name", req.body.name);
        erArray.errors.push(erObj);
    }


    // Create counter for our array
    let x: number = 0;

    // Run validation on remaining attributes
    // Validate courses if present
    if (req.body.sections) {
        lodash.forEach(req.body.sections, function (value: Section) {
            if (!typeCheck("String", value.crnNumber)) {
                const erObj: ErrorMessage = new ErrorMessage("Please use only numbers for number", "sections.number[" + x + "]", value.crnNumber);
                erArray.errors.push(erObj);
            }
            if (!typeCheck("String", value.sectionNumber)) {
                const erObj: ErrorMessage = new ErrorMessage("Please use only letters and spaces for name", "sections.sectionNumber[" + x + "]", value.sectionNumber);
                erArray.errors.push(erObj);
            }
            if (!typeCheck("String", value.time)) {
                const erObj: ErrorMessage = new ErrorMessage("Please use only letters and spaces for name", "sections.sectionNumber[" + x + "]", value.sectionNumber);
                erArray.errors.push(erObj);
            }
            if (!typeCheck("String", value.professor)) {
                const erObj: ErrorMessage = new ErrorMessage("Please use only letters and spaces for name", "sections.sectionNumber[" + x + "]", value.sectionNumber);
                erArray.errors.push(erObj);
            }
            x++;
        });
    }

    // Validation done, check if errors are present
    if (!lodash.isEmpty(erArray.errors)) {
        return res.status(400).json({msg: "Data did not pass validation", err: erArray.errors, data: req.body});
    }

    // If we are here we passed validation, time to add course
    const course = new Course({
        subject: req.body.subject,
        number: req.body.number,
        name: req.body.name,
        sections: req.body.sections
    });
    course.save((err) => {
        if (err) {
            res.status(500).json({err: err});
        }
        res.status(201).json({course: course});
    });
};

/**
 * PATCH /course/
 * updates course by ID in the DB
 */
export let patchTutor = (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    // Create array object we can push on for custom error messages
    const erArray: ErrorArray = new ErrorArray();

    // Validate as much of the schema as we can with checkbody
    const regex = /[A-Za-z -,]*/;
    if (req.body.subject && !regex.test(req.body.subject)) {
        const erObj: ErrorMessage = new ErrorMessage("Please enter a valid subject name", "subject", req.body.subject);
        erArray.errors.push(erObj);
    }
    const numRegex = /\d+/;
    if (req.body.number && !numRegex.test(req.body.number)) {
        const erObj: ErrorMessage = new ErrorMessage("Please enter a valid number", "number", req.body.number);
        erArray.errors.push(erObj);
    }
    if (req.body.name && !regex.test(req.body.name)) {
        const erObj: ErrorMessage = new ErrorMessage("Please enter a valid name", "name", req.body.name);
        erArray.errors.push(erObj);
    }


    // Create counter for our array
    let x: number = 0;

    // Run validation on remaining attributes
    // Validate courses if present
    if (req.body.sections) {
        lodash.forEach(req.body.sections, function (value: Section) {
            if (!typeCheck("String", value.crnNumber)) {
                const erObj: ErrorMessage = new ErrorMessage("Please use only numbers for number", "sections.number[" + x + "]", value.crnNumber);
                erArray.errors.push(erObj);
            }
            if (!typeCheck("String", value.sectionNumber)) {
                const erObj: ErrorMessage = new ErrorMessage("Please use only letters and spaces for name", "sections.sectionNumber[" + x + "]", value.sectionNumber);
                erArray.errors.push(erObj);
            }
            if (!typeCheck("String", value.time)) {
                const erObj: ErrorMessage = new ErrorMessage("Please use only letters and spaces for name", "sections.sectionNumber[" + x + "]", value.sectionNumber);
                erArray.errors.push(erObj);
            }
            if (!typeCheck("String", value.professor)) {
                const erObj: ErrorMessage = new ErrorMessage("Please use only letters and spaces for name", "sections.sectionNumber[" + x + "]", value.sectionNumber);
                erArray.errors.push(erObj);
            }
            x++;
        });
    }
    // Validation done, check if errors are present
    if (!lodash.isEmpty(erArray.errors)) {
        return res.status(400).json({msg: "Data did not pass validation", err: erArray.errors});
    }
    // Find tutor and update
    Course.findById(req.body.id, (err, tutor: CourseModel) => {
        // Handle error
        if (err) {
            return res.status(500).json({err: err});
        }
        // Set objects that are present
        if (req.body.subject) {
            tutor.subject = req.body.subject;
        }
        if (req.body.number) {
            tutor.number = req.body.number;
        }
        if (req.body.name) {
            tutor.name = req.body.name;
        }
        if (req.body.sections) {
            tutor.sections = req.body.sections;
        }
        tutor.save((err) => {
            if (err) {
                return res.status(500).json({err: err});
            }
            res.json({msg: "Tutor has been updated", tutor: tutor});
        });
    });
};

/**
 *  GET /course
 * @param req.query should have the query that the front end is after
 * @param res returns 200 and object on success, 500 on error with err message
 *
 */
export let getCourse = (req: Request, res: Response, next: NextFunction) => {
    // Log incoming query
    console.log(req.query);
    // Create custom query
    const qs = new MongoQS ({
        custom: {
            urlQueryParamName: function (query: CourseModel, input: CourseModel) {
                // Validate input coming through
                if (input.id) {
                    query["_id"] = input.id;
                }
                if (input.subject) {
                    query["subject"] = input.subject;
                }
                if (input.number) {
                    query["number"] = input.number;
                }
                if (input.name) {
                    query["name"] = input.name;
                }
                if (input.sections) {
                    query["sections"] = input.sections;
                }
            }
        }
    });
    // parse query
    const query = qs.parse(req.query);
    // query and return to front end
    Course.find(query, (err, ret: Document []) => {
        if (err) {
            return res.status(500).json({err: err});
        }
        console.log(ret);
        res.status(200).json({msg: ret});
    });
};

export let deleteCourse = (req: Request, res: Response, next: NextFunction) => {
    Course.remove({ _id: req.body.id }, (err) => {
        if (err) {
            return res.status(500).json({err: err});
        }
        res.status(200).json({msg: "Course deleted"});
    });
  };