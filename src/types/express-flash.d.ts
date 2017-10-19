
/// <reference types="express" />

// Add RequestValidation Interface on to Express's Request Interface.
declare namespace Express {
    interface Request extends Flash {}
}

interface Flash {
    flash(type: string, message: any): void;
}
declare module 'curl';
declare module "express-flash";

