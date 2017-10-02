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
const request = require("express-validator");

 export let postSignin = (req: Request, res: Response, next: NextFunction) => {
   // Check the incoming request
  req.assert("username", "Email is not valid").notEmpty();
  req.assert("password", "Password cannot be blank").notEmpty();

  // Create error array
  const errors = req.validationErrors();

  // If we have errors handle them
  if (errors) {
    return res.status(401).json({msg: "Not all data was present to login.  Please try again.", err: errors}).header("WWW-Authenticate", "Basic, realm=\"FASTCampus\"");
  }

  // No errors proceed and try to login
  passport.authenticate("local", (err: Error, user: UserModel, info: LocalStrategyInfo) => {
    // Handle error
    if (err) {
      return res.status(500).json({err: err});
    }
    // If we do not get a user
    console.log(user);
    console.log("here");
    if (!user) {
        // User did not authenticate, send 401 and approriate header
      res.status(401).json({msg: info.message}).header("WWW-Authenticate", "Basic, realm=\"FASTCampus\"");
    } else {
      req.logIn(user, (err) => {
        if (err) {
            return res.status(500).json({err: err});
        }
        return res.status(200).json({user: user});
      });
    }
  // Forward request
  })(req, res, next);
};
