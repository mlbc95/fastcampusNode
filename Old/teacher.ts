import * as passport from "passport";
import * as _ from "lodash";
import * as fc from "../helperclasses/fcValidation";
import { default as Teacher, DayOfWeek, Office, TeacherModel } from "../models/Teacher";
import { Request, Response, NextFunction } from "express";
import { WriteError } from "mongodb";
import { ErrorArray, ErrorMessage } from "../helperclasses/errors";
const MongoQS = require("mongo-querystring");
/**
 * Handle preflighted headers
 */
export let optionsTeacher = (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).header("Allow", "GET, PATCH, DELETE, OPTIONS");
};
/**
 * GET Teachers
 */
export let getTeacher = (req: Request, res: Response, next: NextFunction) => {
    // Log incoming query
    console.log("GET /teachers");
    console.log(req.query);
    // Create custom query
    const qs = new MongoQS ({
        custom: {
          urlQueryParamName: function (query: TeacherModel, input: TeacherModel) {
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
            if (input.email) {
              query["email"] = input.email;
            }
            if (input.username) {
              query["username"] = input.username;
            }
            if (input.school) {
              query["school"] = input.school;
            }
            if (input.pNumber) {
              query["pNumber"] = input.pNumber;
            }
            if (input.courses) {
              query["courses"] = input.courses;
            }
            if (input.status) {
                query["status"] = input.status;
            }
            if (input.officeHours) {
                query["officeHours"] = input.officeHours;
            }
          }
        }
    });
    // parse query
    const query = qs.parse(req.query);
    if (_.isEmpty(query)) {
      // If query is empty send back 403 stating that the query must have parameters
      return res.status(400).json({msg: "Must have parameters"});
    }
    // query and return to front end
    Teacher.find(query, (err, teachers: TeacherModel []) => {
        if (err) {
            return res.status(500).json({err: err});
        }
        // Clean out unwanted fields from teacher
        _.forEach(teachers, function (teacher) {
          teacher.password = undefined;
          teacher.passwordResetExpires = undefined;
          teacher.passwordResetToken = undefined;
        });
        console.log(teachers);
        return res.status(200).json({user: teachers});
    });
  };
  /**
   * PATCH /teacher
   * Update teacher information.
   */
  export let patchTeacher = (req: Request, res: Response, next: NextFunction) => {
    // Log incoming query
    console.log("PATCH /teachers");
    console.log(req.body);
    // Handle empty request or missing id
    if (!req.body || !req.body.id) {
      return res.status(400).json({msg: "Bad request"});
    }
    // Create array object we can push on for custom error messages
    const erArray: ErrorArray = new ErrorArray();
    // Error check through our wrapper class
    fc.FcValidation.teacherValidationWrapper(req.body, erArray);

    console.log(erArray.errors);
    // If we got errors error out and return to client
    if (!_.isEmpty(erArray.errors)) {
      return res.status(400).json({msg: "Data did not pass validation", err: erArray.errors});
    }

    Teacher.findById(req.body.id, (err: any, teacher: TeacherModel) => {
      // Handle Error
      if (err) {
        return res.status(500).json({err: err});
      }
      // Set objects that are present
      if (req.body.email) {
        teacher.email = req.body.email;
      }
      if (req.body.fName) {
        teacher.fName = req.body.fName;
      }
      if (req.body.lName) {
        teacher.lName = req.body.lName;
      }
      if (req.body.school) {
        teacher.school = req.body.school;
      }
      if (req.body.pNumber) {
        teacher.pNumber = req.body.pNumber;
      }
      if (req.body.status) {
        teacher.status = req.body.status;
      }
      if (req.body.courses) {
        teacher.courses = req.body.courses;
      }
      if (req.body.officeHours) {
        teacher.officeHours = req.body.officeHours;
      }
      teacher.save((err: WriteError) => {
        if (err) {
          if (err.code === 11000) {
            // Write error from the db, email or username is taken
            // set header to 400 to indicate bad information
            return res.status(400).json({msg: "The email address you have entered is already associated with an account."});
          }
          // General error, set status to 400 to indicate bad information
          return res.status(500).json({err: err});
        }
        // Clean out unwanted fields from teacher
        // Clean out unwanted items from json in the return response
        _.forEach(teacher, function (teach) {
          teach.password = undefined;
          teach.passwordResetExpires = undefined;
          teach.passwordResetToken = undefined;
        });
        // Success, set status to 200 to indicate success
        return res.status(200).json({user: teacher});
      });
    });
  };

  /**
   * DELETE /teacher
   *
   */
  export let deleteTeacher = (req: Request, res: Response, next: NextFunction) => {
    console.log("DELETE /teachers");
    console.log(req.body);
    // Handle empty request or missing id
    if (!req.body || !req.body.id) {
      return res.status(400).json({msg: "Bad request"});
    }
    Teacher.remove({ _id: req.body.id }, (err) => {
      if (err) {
        return res.status(500).json({err: err});
      }
      return res.status(200).json({msg: "Account deleted"});
    });
  };