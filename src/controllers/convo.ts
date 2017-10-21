import * as passport from "passport";
import * as _ from "lodash";
import { Request, Response, NextFunction } from "express";
import * as admin from "firebase-admin";
import * as curl from "curl";

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