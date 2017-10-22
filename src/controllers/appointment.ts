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
    // Log incoming query
    console.log(req.query);
    // Create our user array
    const uArray: any = [];
    // Pack the user array
    _.forEach(req.body.users, (user) => {
      uArray.push(user);
    });
    // Handle missing data
    if (_.isEmpty(uArray)) {
        res.status(400).json({errors: {message: "missing users"}});
    }
    // Create db reference
    const apptRef = admin.database().ref("appointments");
    // Create new appointment id
    const newConvoRef = apptRef.push();
    // Create time stampe
    const today = new Date();
    // Update the appointment with info
    newConvoRef.update({users: uArray, messages: [], created: today, time: req.body.time, building: req.body.building, relatedCourses: req.body.courses}).then(() => {
        // Get snapshot of /users to go through
        admin.database().ref("users").once("value", (snap) => {
            console.log(snap.val());
            // Loop through all users in the snapshot
            _.forIn(snap.val(), (userBody, id) => {
                console.log(userBody);
                // Loop through all users we were sent
                _.forEach(req.body.users, (user) => {
                    // If we found a match between our ids, update them with new appointment
                    if (id === user) {
                        const userApptRef = admin.database().ref("users/" + user + "/appointments");
                        const c = newConvoRef.key;
                        if (_.isEmpty(userBody.appointments)) {
                            userBody.appointments = [];
                        }
                        userBody.appointments.push(c);
                        console.log(userBody.appointments);
                        const newApptArray = userBody.appointments;
                        userApptRef.set(newApptArray).then();
                    }
                });
            });
        });
    res.sendStatus(200);
    });
};