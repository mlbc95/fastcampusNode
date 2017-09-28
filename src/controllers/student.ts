import * as async from "async";
import * as crypto from "crypto";
import * as nodemailer from "nodemailer";
import * as passport from "passport";
import * as validator from "validator";
import * as lodash from "lodash";
import * as fc from "../helperclasses/fcValidation";
const typeCheck = require("type-check").typeCheck;
import { default as Student, StudentModel, Degree } from "../models/Student";
import { ErrorMessage, ErrorArray } from "../helperclasses/errors";
import { Request, Response, NextFunction } from "express";
import { LocalStrategyInfo } from "passport-local";
import { WriteError } from "mongodb";
const request = require("express-validator");
const MongoQS = require("mongo-querystring");
/**
 * GET Students
 * @param req
 * @param res
 * @param next
 */
export let getStudent = (req: Request, res: Response, next: NextFunction) => {
  // Log incoming query
  console.log(req.query);
  // Create custom query
  const qs = new MongoQS ({
      custom: {
        urlQueryParamName: function (query: StudentModel, input: StudentModel) {
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
          if (input.completedCourses) {
            query["completedCourses"] = input.completedCourses;
          }
          if (input.degrees) {
            query["degrees"] = input.degrees;
          }
        }
      }
  });
  // parse query
  const query = qs.parse(req.query);
  // query and return to front end
  Student.find(query, (err, ret: Document []) => {
      if (err) {
          return res.status(500).json({err: err});
      }
      console.log(ret);
      res.status(200).json({msg: ret});
  });
};
/**
 * PATCH /student
 * Update student information.
 */
export let patchStudent = (req: Request, res: Response, next: NextFunction) => {
  // Create array object we can push on for custom error messages
  const erArray: ErrorArray = new ErrorArray();
  // Error check through our wrapper class
  fc.FcValidation.studentValidationWrapper(req.body, erArray);

  console.log(erArray.errors);
  // If we got errors error out and return to client
  if (!lodash.isEmpty(erArray.errors)) {
    return res.status(400).json({msg: "Data did not pass validation", err: erArray.errors});
  }

  Student.findById(req.body.id, (err: any, user: StudentModel) => {
    // Handle Error
    if (err) {
      return res.status(500).json({err: err});
    }
    // Set objects that are present
    if (req.body.email) {
      user.email = req.body.email;
    }
    if (req.body.fName) {
      user.fName = req.body.fName;
    }
    if (req.body.lName) {
      user.lName = req.body.lName;
    }
    if (req.body.school) {
      user.school = req.body.school;
    }
    if (req.body.pNumber) {
      user.pNumber = req.body.pNumber;
    }
    if (req.body.degrees) {
      user.degrees = req.body.degrees;
    }
    if (req.body.courses) {
      user.courses = req.body.courses;
    }
    if (req.body.completedCourses) {
      user.completedCourses = req.body.completedCourses;
    }
    user.save((err: WriteError) => {
      if (err) {
        if (err.code === 11000) {
          // Write error from the db, email or username is taken
          // set header to 400 to indicate bad information
          res.status(400).json({msg: "The email address you have entered is already associated with an account."});
        }
        // General error, set status to 400 to indicate bad information
        return res.status(500).json({err: err});
      }
      // Success, set status to 200 to indicate success
      res.status(200).json({user: user});
    });
  });
};

/**
 * DELETE /student
 *
 */
export let deleteStudent = (req: Request, res: Response, next: NextFunction) => {
  Student.remove({ _id: req.body.id }, (err) => {
    if (err) {
      return res.status(500).json({err: err});
    }
    res.status(200).json({msg: "Account deleted"});
  });
};
