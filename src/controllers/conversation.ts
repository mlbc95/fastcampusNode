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
    console.log(req.query);
    const uArray: any = [];
    _.forEach(req.body.users, (user) => {
      uArray.push(user);
    });
    const convoRef = admin.database().ref("convos");
    const newConvoRef = convoRef.push();
    const today = new Date();
    newConvoRef.update({users: uArray, messages: [], created: today}).then(() => {
        admin.database().ref("users").once("value", (snap) => {
            console.log(snap.val());
            _.forIn(snap.val(), (userBody, id) => {
                console.log(userBody);
                _.forEach(req.body.users, (user) => {
                    if (id === user) {
                        const userConvoRef = admin.database().ref("users/" + user + "/convos");
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