import * as passport from "passport";
import * as _ from "lodash";
import { Request, Response, NextFunction } from "express";
import * as admin from "firebase-admin";
import * as curl from "curl";
/**
 * @api {post} /tutor Requests tutors available for student
 * @apiName PostTutor
 * @apiGroup Tutor
 *
 * @apiParam {String} id Users unique ID
 *
 * @apiSuccess {Array} tutors An arrya of tutors available for the user
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 * {
 *   "tutors": [
 *       {
 *           "courses": [
 *               "11117",
 *               "11120"
 *           ],
 *           "degrees": [
 *               {
 *                   "level": "Professional",
 *                   "name": "Computer Science"
 *               }
 *           ],
 *           "email": "andrese.rodriguezh@gmail.com",
 *           "fName": "Andres",
 *           "id": "AQ1ukuK0Iudt8yTjW7NcFSYOMP03",
 *           "lName": "Rodriguez",
 *           "pNumber": "6185206363",
 *           "school": "University of Missouri - St. Louis",
 *           "tutors": {
 *               "accounting": [
 *                   "2400",
 *                   "2410"
 *               ],
 *               "engligh": [
 *                   "4000",
 *                   "4100"
 *               ]
 *           }
 *       }
 *   ]
 * }
 */
export let postTutor = (req: Request, res: Response, next: NextFunction) => {
    console.log(req.query);
    // Check to make sure that id is present
    if (_.isEmpty(req.body.user)) {
        return res.status(400).json({errors: {message: "missing user id"}});
    }
    const userId: string = req.body.user;
    const convoRef = admin.database().ref("users");
    // Get a snapshot of the user
    admin.database().ref("users/" + userId).once("value", (snap) => {
        const courseArray: any = [];
        const returnArray: any = [];
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
                                let idCheck = false;
                                // Check to make sure we only add once
                                _.forEach(returnArray, (tutors: any) => {
                                    if (uid.match(tutors.id)) {
                                        idCheck = true;
                                    }
                                });
                                if (!idCheck) {
                                    returnArray.push(userObj);
                                }
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