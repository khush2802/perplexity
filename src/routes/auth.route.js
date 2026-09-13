import { Router } from "express";
import { register , verifyEmail, login} from "../controllers/auth.controller.js";
import { registerValidator, loginValidator} from "../validators/auth.validator.js";
// import { authUser } from "../middleware/auth.middleware.js";

const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 * @body { username, email, password }
 */
authRouter.post("/register", registerValidator, register);


/**
 * @route GET /api/auth/verify-email
 * @desc Verify user's email address
 * @access Public
 * @query { token }
 */

authRouter.get("/verify-email", verifyEmail);


authRouter.post("/login", loginValidator, login);



export default authRouter;