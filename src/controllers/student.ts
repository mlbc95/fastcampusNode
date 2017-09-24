import * as async from "async";
import * as crypto from "crypto";
import * as nodemailer from "nodemailer";
import * as passport from "passport";
import * as validator from "validator";
import * as lodash from "lodash";
const typeCheck = require("type-check").typeCheck;
import { default as Student, StudentModel, Degree, Course } from "../models/Student";
import { ErrorMessage, ErrorArray } from "../helperclasses/errors";
import { Request, Response, NextFunction } from "express";
import { LocalStrategyInfo } from "passport-local";
import { WriteError } from "mongodb";
const request = require("express-validator");
// Custom classes

/**
 * PATCH /student
 * Update student information.
 */
export let patchStudent = (req: Request, res: Response, next: NextFunction) => {
  // Create array object we can push on for custom error messages
  const erArray: ErrorArray = new ErrorArray();

  // Validation of inputs
  if (req.body.fName && !validator.isAlpha(req.body.fName)) {
    const erObj: ErrorMessage = new ErrorMessage("Please use only letters for first name", "fName", req.body.fName);
    erArray.errors.push(erObj);
  }
  if (req.body.lName && !validator.isAlpha(req.body.lName)) {
    const erObj: ErrorMessage = new ErrorMessage("Please use only letters for last name", "fName", req.body.lName);
    erArray.errors.push(erObj);
  }
  if (req.body.email && !validator.isEmail(req.body.email)) {
    const erObj: ErrorMessage = new ErrorMessage("Please use a valid email address", "eamil", req.body.email);
    erArray.errors.push(erObj);
  }
  const schoolRegex = /[A-Za-z ]*/;
  if (req.body.school && !schoolRegex.test(req.body.school)) {
    const erObj: ErrorMessage = new ErrorMessage("Please enter a valid school name", "school", req.body.school);
    erArray.errors.push(erObj);
  }
  const phoneRegex = /\d{10,12}/;
  if (req.body.pNumber && !phoneRegex.test(req.body.pNumber)) {
    const erObj: ErrorMessage = new ErrorMessage("Please enter a valid phone number", "pNumber", req.body.pNumber);
    erArray.errors.push(erObj);
  }

  // Create counter for our array
  let x: number = 0;

  // Loop through the degrees and add error message onto our array if degrees are present
  if (req.body.degrees) {
    lodash.forEach(req.body.degrees, function (value: Degree) {
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
  }


  // Reset array counter
  x = 0;

  // Loop through courses and validate them if present
  if (req.body.courses) {
    lodash.forEach(req.body.courses, function (value: Course) {
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
  }

  console.log(erArray.errors);
  // If we got errors error out and return to client
  if (!lodash.isEmpty(erArray.errors)) {
    req.flash("errors", erArray);
    return res.status(400).json({msg: "Data did not pass validation", err: erArray.errors, data: req.body});
  }

  Student.findById(req.body.id, (err, user: StudentModel) => {
    // Handle Error
    if (err) { return next(err); }
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
    user.save((err: WriteError) => {
      if (err) {
        if (err.code === 11000) {
          // Write error from the db, email or username is taken
          // set header to 400 to indicate bad information
          res.status(400).json({msg: "The email address you have entered is already associated with an account."});
        }
        // General error, set status to 400 to indicate bad information
        return res.status(400).json({err: err});
      }
      // Success, set status to 201 to indicate resouce created
      res.status(201).json({user: user});
    });
  });
};

export let deleteStudent = (req: Request, res: Response, next: NextFunction) => {
  Student.remove({ _id: req.body.id }, (err) => {
    if (err) { return next(err); }
    req.logout();
    res.status(200).json({msg: "Account deleted"});
  });
};
