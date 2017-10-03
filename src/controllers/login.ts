import * as crypto from "crypto";
import * as passport from "passport";
import * as lodash from "lodash";
import { default as User, UserModel, AuthToken  } from "../models/User";
import { Request, Response, NextFunction } from "express";
import { LocalStrategyInfo } from "passport-local";
import { WriteError } from "mongodb";
const request = require("express-validator");

// Handle preflighted requests
export let optionsSignin = (req: Request, res: Response, next: NextFunction) => {
  return res.send(200).header("Allow", "POST, OPTIONS");
};
/**
 * POST /auth/login
 * Used to signin to the application
 */
 export let postSignin = (req: Request, res: Response, next: NextFunction) => {
   console.log(req);
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
    // console.log(user);
    // console.log("here");
    if (!user) {
        // User did not authenticate, send 401 and approriate header
      res.status(401).json({msg: info.message}).header("WWW-Authenticate", "Basic, realm=\"FASTCampus\"");
    } else {
      req.logIn(user, (err) => {
        if (err) {
            return res.status(500).json({err: err});
        }
        user.password = undefined;
        user.passwordResetExpires = undefined;
        user.passwordResetToken = undefined;
        return res.status(200).json({user: user});
      });
    }
  // Forward request
  })(req, res, next);
};
export let optionsLogout = (req: Request, res: Response, next: NextFunction) => {
  return res.send(200).header("Allow", "POST, OPTIONS");
};
export let postLogout = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.body.id, function (err: any, user: UserModel) {
    // Handle error
    if (err) {
      return res.status(500).json({err: err});
    }
    user.lastLoggedIn = new Date();
    user.save((err: any) {
      if (err) {
        return res.status(500).json({err: err});
      }
      res.clearCookie("connect.sid");
    });
  });
  return res.status(200).json({msg: "loggedout"});
};