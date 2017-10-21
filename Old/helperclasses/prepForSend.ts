import * as _ from "lodash";
export function prepForSend (obj: any) {
    if (!_.isEmpty(obj.password)) {
        delete obj.password;
        obj.password = undefined;
    }
    if (obj._doc.passwordResetExpires) {
        delete obj.passwordResetExpires;
    }
    if (obj._doc.passwordResetToken) {
        delete obj.passwordResetToken;
    }
    const newObj = {
        id: obj._id,
        ...obj._doc
    };
    delete newObj._id;
    return newObj;
}