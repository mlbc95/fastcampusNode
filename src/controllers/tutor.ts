import * as passport from "passport";
import * as _ from "lodash";
import { Request, Response, NextFunction } from "express";
import * as admin from "firebase-admin";
import * as curl from "curl";

export let postTutor = (req: Request, res: Response, next: NextFunction) => {
    console.log(req.query);
    const userId: string = req.body.user;
    const convoRef = admin.database().ref("users");
    // Get a snapshot of the user
    admin.database().ref("users/" + userId).once("value", (snap) => {
        let courseArray: any = [];
        let returnArray: any = [];
        console.log(snap.val());
        // Get a snapshot of the courses
        admin.database().ref("courses").once("value", (coursesSnap) => {
            // Itterate over subjectrs
            _.forIn(coursesSnap.val(), (courses, subjectName) => {
                // Itterate over courses
                if (subjectName === "accounting") {
                    _.forIn(courses, (course, courseNumber) => {
                        // Itterate over sections
                        _.forEach(course.sections, (section: any, sectionName) => {
                            // Itterate over Users' CRN's VS ones here
                            _.forEach(snap.val().courses, (crn) => {
                                if (crn.match(section.crnNumber)) {
                                    const c = {subject: subjectName, courseNumber};
                                    courseArray.push(c);
                                    console.log("crn");
                                }
                            });
                        });
                    });
                }
            });
        }).then();
        console.log(courseArray);
        // Search for matches
        // Grab snapshot of users
        admin.database().ref("users").once("value", (userSnap) => {
            // Itterate over users
            _.forIn(userSnap.val(), (userObj, uid) => {
                // Itterate over subjects tutored
                _.forIn(userObj.tutors, (tutorsArray, subjectName) => {
                    // Itterate over courses tutored in subject
                    _.forEach(tutorsArray, (courseNumber) => {
                        // Itterate over coureses student has
                        _.forEach(courseArray, (userCourses: any) => {
                            // Check for match
                            if (userCourses.subject.match(subjectName) && userCourses.courseNumber.match(courseNumber)) {
                                console.log("HERE");
                                returnArray.push(userObj);
                                console.log(returnArray);
                            }
                        });
                    });
                });
            });
            console.log("return array");
            console.log(returnArray);
            res.json({tutors: returnArray});
        }).then();
    });
};