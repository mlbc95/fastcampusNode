import * as passport from "passport";
import * as lodash from "lodash";
import { Request, Response, NextFunction } from "express";
import { WriteError } from "mongodb";
import { default as Course, Section, CourseModel } from "../models/Course";
import { ErrorArray, ErrorMessage } from "../helperclasses/errors";
import * as fc from "../helperclasses/fcValidation";
const MongoQS = require("mongo-querystring");
const request = require("express-validator");

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
                if (input.teachers) {
                    query["teachers"] = input.teachers;
                }
                if (input.tutors) {
                    query["tutors"] = input.tutors;
                }
                if (input.students) {
                    query["students"] = input.students;
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
        // Handle error
        if (err) {
            return res.status(500).json({err});
        }
        console.log(ret);
        return res.status(200).json({ret});
    });
};

/**
 * POST /course
 * Add course to the db
 */
export let postCourse = (req: Request, res: Response, next: NextFunction) => {
    console.log("POST /courses");
    console.log(req.body);
    // Create array object we can push on for custom error messages
    const erArray: ErrorArray = new ErrorArray();

    // Pass to validation wrapper
    fc.FcValidation.courseValidationWrapper(req.body, erArray);

    // Validation done, check if errors are present
    if (!lodash.isEmpty(erArray.errors)) {
        return res.status(400).json({msg: "Data did not pass validation", err: erArray.errors, data: req.body});
    }

    // If we are here we passed validation, time to add course
    const course = new Course({
        subject: req.body.subject,
        number: req.body.number,
        name: req.body.name,
        teachers: req.body.teachers,
        tutors: req.body.tutors,
        students: req.body.students,
        sections: req.body.sections
    });
    // Save the course to the db
    course.save((err) => {
        // Handle error
        if (err) {
            return res.status(500).json({err});
        }
        return res.status(201).json({course});
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

    // Pass to validation wrapper
    fc.FcValidation.courseValidationWrapper(req.body, erArray);

    // Validation done, check if errors are present
    if (!lodash.isEmpty(erArray.errors)) {
        return res.status(400).json({msg: "Data did not pass validation", err: erArray.errors});
    }
    // Find tutor and update
    Course.findById(req.body.id, (err, course: CourseModel) => {
        // Handle error
        if (err) {
            return res.status(500).json({err});
        }
        // Set objects that are present
        if (req.body.subject) {
            course.subject = req.body.subject;
        }
        if (req.body.number) {
            course.number = req.body.number;
        }
        if (req.body.name) {
            course.name = req.body.name;
        }
        if (req.body.teachers) {
            course.teachers = req.body.teachers;
        }
        if (req.body.tutors) {
            course.tutors = req.body.tutors;
        }
        if (req.body.students) {
            course.students = req.body.students;
        }
        if (req.body.sections) {
            course.sections = req.body.sections;
        }
        // Save the updated course
        course.save((err) => {
            // Handle error
            if (err) {
                return res.status(500).json({err});
            }
            return res.json({msg: "Tutor has been updated", course});
        });
    });
};



export let deleteCourse = (req: Request, res: Response, next: NextFunction) => {
    // Remove course from the db
    Course.remove({ _id: req.body.id }, (err) => {
        // Handle error
        if (err) {
            return res.status(500).json({err});
        }
        return res.status(200).json({msg: "Course deleted"});
    });
  };