import { validationResult, body } from "express-validator";

export function validate(req, res, next) {
     const errors = validationResult(req);

     if(!errors.isEmpty()){
          return res.status(400).json({
               
               errors:errors.array(),
          });
     }
     return next();
}

export const registerValidator = [
     body("username")
     .notEmpty().withMessage("Username is required")
     .isLength({min:3}).withMessage("Username must be at least 3 characters long")
     .trim()
     .matches(/^[a-zA-Z0-9]+$/).withMessage("Username must be alphanumeric"),

     body("email")
     .notEmpty().withMessage("Email is required")
     .isEmail().withMessage("Please provide a valid email")
     .trim(),

     body("password")
     .notEmpty().withMessage("Password is required")
     .isLength({min:6}).withMessage("Password must be at least 6 characters long"),

     validate
]


export const loginValidator = [
     body("email")
     .notEmpty().withMessage("Email is required")
     .isEmail().withMessage("Please provide a valid email")
     .trim(),

     body("password")
     .notEmpty().withMessage("Password is required")
     .isLength({min:6}).withMessage("Password must be at least 6 characters long"),

     validate
]