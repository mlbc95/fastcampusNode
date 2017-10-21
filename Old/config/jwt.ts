import * as jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import * as _ from "lodash";

export function  jwtKey () {
    return "1lt9OjjDO6bMcoi2na89";
}
export let verifyJwtToken = function (req: Request, res: Response, next: NextFunction) {
    jwt.verify(req.body.token, jwtKey(), function (err: jwt.JsonWebTokenError, decoded: any) {
        if (!_.isEmpty(err)) {
            return res.status(401).json({err});
        }
        return next();
    });
};