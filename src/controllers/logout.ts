import * as crypto from "crypto";
import * as passport from "passport";
import * as _ from "lodash";
import { ErrorArray, ErrorMessage } from "../helperclasses/errors";
import { default as User, UserModel, AuthToken  } from "../models/User";
import { prepForSend } from "../helperclasses/prepForSend";
import { Request, Response, NextFunction } from "express";
import { LocalStrategyInfo } from "passport-local";
import { jwtKey } from "../config/jwt";
import * as jwt from "jsonwebtoken";
const request = require("express-validator");

/**
 * /auth/logout | POST | Used to logout to the application
 *  Content-type: application/json
 *  Information Expected:
 *      req.body (JSON):
 *          id | string | Mongo DB ID
 *  Returns:
 *      Fail:
 *          400 (Bad Request):
 *              Caused by validation errors, username/email being present
 *              err | Error Array | contains an array of msg, param, value of the issues
 *          500 (Internal Serve Error):
 *              Caused by the server encountering an internal error
 *              err | Error Array | contains an array of msg, param, value of the issues
 *      Success:
 *          200 (Success):
 *              msg | string | message to let frontend know that we logged out
 */

export let postLogout = (req: Request, res: Response, next: NextFunction) => {
    const erArray: ErrorArray = new ErrorArray();
    // Find user
    User.findById(req.body.id, function (error: any, user: UserModel) {
      // Handle error
      if (!_.isEmpty(error)) {
        erArray.errors.push(new ErrorMessage(error.errmsg.split(":")[0], error.errmsg.split(":")[1], error.errmsg.split(":")[3]));
        return res.status(500).json({error: erArray.errors});
      }
      // Update last login
      user.lastLogin = new Date();
      // Save user
      user.save((err: any) => {
        if (!_.isEmpty(err)) {
          erArray.errors.push(new ErrorMessage(err.errmsg.split(":")[0], err.errmsg.split(":")[1], err.errmsg.split(":")[3]));
          return res.status(500).json({error: erArray.errors});
        }
        res.clearCookie("connect.sid");
      });
    });
    return res.status(200).json({message: "loggedout"});
  };