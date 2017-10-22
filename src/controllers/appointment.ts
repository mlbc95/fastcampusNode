import * as _ from "lodash";
import { Request, Response, NextFunction } from "express";
import * as admin from "firebase-admin";
/**
 * @api {post} /appointment Create a new conversation between users
 * @apiName CreateAppointment
 * @apiGroup Appointment
 *
 * @apiParam {Array} users An array of ids to be associated with the appointment
 * @apiParam {String} building Building where the meeting is taking place
 * @apiParam {String} time Time when the meeting is taking place, perferably in the format 01:00 pm
 * @apiParam {Object} courses An object of arrays containing the courses related to the meeting
 * @apiParamExample {json} Request-Example:
 *  {
 *  "users": [
 *          "30O1unPDEwXMg5fnJSUCKMRahw02",
 *          "AQ1ukuK0Iudt8yTjW7NcFSYOMP03"
 *  ],
 *  "time": "01:00 pm",
 *  "building": "Lucas Hall 00217",
 *  "courses": {
 *  "accounting": [
 *               "2400"
 *           ]
 *  }
 *  }
 *
 * @apiSuccess {String} ok Sends 200 on success
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 */
export let postAppointment = (req: Request, res: Response, next: NextFunction) => {
    console.log(req.query);
    const uArray: any = [];
    _.forEach(req.body.users, (user) => {
      uArray.push(user);
    });
    const apptRef = admin.database().ref("appointments");
    const newConvoRef = apptRef.push();
    const today = new Date();
    newConvoRef.update({users: uArray, messages: [], created: today, time: req.body.time, building: req.body.building, relatedCourses: req.body.courses}).then(() => {
        admin.database().ref("users").once("value", (snap) => {
            console.log(snap.val());
            _.forIn(snap.val(), (userBody, id) => {
                console.log(userBody);
                _.forEach(req.body.users, (user) => {
                    if (id === user) {
                        const userConvoRef = admin.database().ref("users/" + user + "/appointments");
                        const c = newConvoRef.key;
                        if (_.isEmpty(userBody.appointments)) {
                            userBody.convos = [];
                        }
                        userBody.convos.push(c);
                        console.log(userBody.convos);
                        const newConvoArray = userBody.convos;
                        userConvoRef.set(newConvoArray).then();
                    }
                });
            });
        });
    res.sendStatus(200);
    });
};