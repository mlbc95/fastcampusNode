import * as async from "async";
import * as crypto from "crypto";
import * as nodemailer from "nodemailer";
import * as passport from "passport";
import * as validator from "validator";
import * as lodash from "lodash";
const typeCheck = require("type-check").typeCheck;
import { default as User, UserModel, AuthToken } from "../models/User";
import { Request, Response, NextFunction } from "express";
import { LocalStrategyInfo } from "passport-local";
import { WriteError } from "mongodb";
import { ErrorArray, ErrorMessage } from "../helperclasses/errors";
const request = require("express-validator");
// Custom classes

/**
 * This is the User routes that all objects inherit
 * This should only be used for generic objects and routes
 */