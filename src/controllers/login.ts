import * as crypto from "crypto";
import * as passport from "passport";
import * as _ from "lodash";
import { ErrorArray, ErrorMessage } from "../helperclasses/errors";
import { default as User, UserModel, AuthToken  } from "../models/User";
import { prepForSend } from "../helperclasses/prepForSend";
import { Request, Response, NextFunction } from "express";
import { LocalStrategyInfo } from "passport-local";
import { WriteError } from "mongodb";
const request = require("express-validator");

// Handle preflighted requests
export let optionsSignin = (req: Request, res: Response, next: NextFunction) => {
  res.status(200).header("Allow", "POST, OPTIONS");
  res.send();
};
/**
 * POST /auth/login
 * Used to signin to the application
 */
 export let postSignin = (req: Request, res: Response, next: NextFunction) => {
  console.log("POST /auth/login") 
  console.log(req.body);
   // Check the incoming request
  req.assert("username", "Username is not valid").notEmpty();
  req.assert("password", "Password cannot be blank").notEmpty();

  // Create error array
  const errors = req.validationErrors();
  const erArray: ErrorArray = new ErrorArray();
  // If we have errors handle them
  if (!_.isEmpty(errors)) {
    return res.status(401).json({msg: "Not all data was present to login.  Please try again.", err: errors}).header("WWW-Authenticate", "Basic, realm=\"FASTCampus\"");
  }

  // No errors proceed and try to login
  passport.authenticate("local", (err: Error, orignalUser: UserModel, info: LocalStrategyInfo) => {
    console.log("here");
    // Handle error
    if (!_.isEmpty(err)) {
      return res.status(500).json({err: err});
    }
    // If we do not get a user
    if (_.isEmpty(orignalUser)) {
        // User did not authenticate, send 401 and approriate header
      return res.header("WWW-Authenticate", "Basic, realm=\"FASTCampus\"").status(401).json({err: {msg: info.message}});
    } else {
      req.logIn(orignalUser, (err) => {
        // Handle errors
        if (!_.isEmpty(err)) {
            erArray.errors.push(new ErrorMessage(err.errmsg.split(":")[0], err.errmsg.split(":")[1], err.errmsg.split(":")[3]));
            return res.status(500).json({err: erArray.errors});
        }
        // Prep for sending
        const user = prepForSend(orignalUser);
        return res.status(200).json({user: user});
      });
    }
  // Forward request
  })(req, res, next);
};
export let optionsLogout = (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).header("Allow", "POST, OPTIONS");
};
export let postLogout = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.body.id, function (err: any, user: UserModel) {
    // Handle error
    if (err) {
      return res.status(500).json({err: err});
    }
    user.lastLogin = new Date();
    user.save((err: any) => {
      if (err) {
        return res.status(500).json({err: err});
      }
      res.clearCookie("connect.sid");
    });
  });
  return res.status(200).json({msg: "loggedout"});
};