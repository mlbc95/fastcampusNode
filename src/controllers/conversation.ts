import * as _ from "lodash";
import { Request, Response, NextFunction } from "express";
import * as admin from "firebase-admin";
/**
 * @api {post} /conversation Create a new conversation between users
 * @apiName CreateConvo
 * @apiGroup Convo
 *
 * @apiParam {Array} userIds An array of ids to be associated with the conversation
 *
 * @apiParamExample {json} Request-Example:
 *  {
 *  "users": [
 *      "30O1unPDEwXMg5fnJSUCKMRahw02",
 *      "AQ1ukuK0Iudt8yTjW7NcFSYOMP03"
 *  ]
 *  }
 *
 * @apiSuccess {String} ok Sends 200 on success
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 */
export let postConvo = (req: Request, res: Response, next: NextFunction) => {
    // Log incoming query
    console.log(req.query);
    // Create new array to use
    const uArray: any = [];
    // Pack array
    _.forEach(req.body.users, (user) => {
      uArray.push(user);
    });
    // Handle missing data
    if (_.isEmpty(uArray)) {
        res.status(400).json({errors: {message: "missing users"}});
    }
    // Create db reference
    const convoRef = admin.database().ref("conversations");
    // create new convo id
    const newConvoRef = convoRef.push();
    const today = new Date();
    // Update convo with info
    newConvoRef.update({users: uArray, messages: [], created: today}).then(() => {
        // Get snapshot of /users to go through
        admin.database().ref("users").once("value", (snap) => {
            console.log(snap.val());
            // Loop through all users in the snapsho
            _.forIn(snap.val(), (userBody, id) => {
                console.log(userBody);
                // Loop through all of the users we were sent
                _.forEach(req.body.users, (user) => {
                    // If we found a match update the user with the new conversation
                    if (id === user) {
                        const userConvoRef = admin.database().ref("users/" + user + "/conversations");
                        const c = newConvoRef.key;
                        if (_.isEmpty(userBody.convos)) {
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