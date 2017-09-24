import * as async from "async";
import * as crypto from "crypto";
import * as nodemailer from "nodemailer";
import * as passport from "passport";
import * as validator from "validator";
import * as lodash from "lodash";
const typeCheck = require("type-check").typeCheck;
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

    // Validate as much of the schema as we can with checkbody
    req.checkBody({
        fName: {
            isAlpha: true,
            errorMessage: "First name must contain only letters"
        },
        lName: {
            isAlpha: true,
            errorMessage: "Last name must contain only letters"
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

    // Create counter for our array
    let x: number = 0;

    // Run validation on remaining attributes
    // Validate courses if present
    if (req.body.courses) {
        lodash.forEach(req.body.courses, function (value: Course) {
            if (!typeCheck("Number", value.number)) {
                const erObj: ErrorMessage = new ErrorMessage("Please use only numbers for number", "courses.number[" + x + "]", value.number);
                erArray.errors.push(erObj);
            }
            if (!typeCheck("String", value.name)) {
                const erObj: ErrorMessage = new ErrorMessage("Please use only letters and spaces for name", "courses.name[" + x + "]", value.name);
                erArray.errors.push(erObj);
            }
            x++;
        });
    }
    // Reset x
    x = 0;
    // Check the available attribute
    if (req.body.available) {
        lodash.forEach(req.body.available, function (value: DayOfWeek) {
            console.log(value);
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
            x++;
        });
    }
    // Check office attribute
    if (req.body.office) {
        if (!typeCheck("String", req.body.office.building)) {
            const erObj: ErrorMessage = new ErrorMessage("Please use only letters and spaces for name", "office.building[" + x + "]", req.body.office.building);
            erArray.errors.push(erObj);
        }
        if (!typeCheck("String", req.body.office.roomNumber)) {
            const erObj: ErrorMessage = new ErrorMessage("Please use only letters and spaces for number", "office.building[" + x + "]", req.body.office.roomNumber);
            erArray.errors.push(erObj);
        }
    }

    // Validation done, check if errors are present
    if (!lodash.isEmpty(erArray.errors)) {
        return res.status(400).json({msg: "Data did not pass validation", err: erArray.errors, data: req.body});
    }

    // If we are here we passed validation, time to add tutor
    const tutor = new Tutor({
        fName: req.body.fName || "",
        lName: req.body.lName || "",
        school: req.body.school || "",
        courses: req.body.courses || [],
        available: req.body.available || [],
        office: req.body.office || {}
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

    // Validate as much of the schema as we can with checkbody
    req.checkBody({
        fName: {
            isAlpha: true,
            errorMessage: "First name must contain only letters"
        },
        lName: {
            isAlpha: true,
            errorMessage: "Last name must contain only letters"
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

    // Create counter for our array
    let x: number = 0;

    // Run validation on remaining attributes
    // Validate courses if present
    if (req.body.courses) {
        lodash.forEach(req.body.courses, function (value: Course) {
            if (!typeCheck("Number", value.number)) {
                const erObj: ErrorMessage = new ErrorMessage("Please use only numbers for number", "courses.number[" + x + "]", value.number);
                erArray.errors.push(erObj);
            }
            if (!typeCheck("String", value.name)) {
                const erObj: ErrorMessage = new ErrorMessage("Please use only letters and spaces for name", "courses.name[" + x + "]", value.name);
                erArray.errors.push(erObj);
            }
            x++;
        });
    }
    // Reset x
    x = 0;
    // Check the available attribute
    if (req.body.available) {
        lodash.forEach(req.body.available, function (value: DayOfWeek) {
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
            x++;
        });
    }
    // Check office attribute
    if (req.body.office) {
        if (!typeCheck("String", req.body.office.building)) {
            const erObj: ErrorMessage = new ErrorMessage("Please use only letters and spaces for name", "office.building[" + x + "]", req.body.office.building);
            erArray.errors.push(erObj);
        }
        if (!typeCheck("String", req.body.office.roomNumber)) {
            const erObj: ErrorMessage = new ErrorMessage("Please use only letters and spaces for number", "office.building[" + x + "]", req.body.office.roomNumber);
            erArray.errors.push(erObj);
        }
    }

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
        if (req.body.office) {
            tutor.office = req.body.office;
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
                if (input.office) {
                    query["office"] = input.office;
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