export function prepForSend (obj: any) {
    if(obj.password) {
        delete obj.password;
    }
    if (obj.passwordResetExpires) {
        delete obj.passwordResetExpires;
    }
    if (obj.passwordResetToken) {
        
    }
    delete obj.passwordResetToken;
    const newObj = {
        id: obj._id,
        ...obj._doc
    }
    delete newObj._id;
    return newObj;
}