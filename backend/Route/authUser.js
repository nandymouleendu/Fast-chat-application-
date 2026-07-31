//used for actual user registration 
import express from "express";//Imports the Express library. You need this here specifically to access express.Router(), which is a feature built into Express for organizing routes into separate, reusable files.

import { userLogin, userLogOut, userRegister } from "../RouteController/userRouteController.js";//Imports three specific functions — userLogin, userLogOut, and userRegister — from your controller file. These are the actual pieces of logic that run when someone hits each route (checking credentials, saving to the database, etc.). The { } syntax means these are named exports — you're grabbing them by their exact exported names from that file.

const router = express.Router();//Creates a Router object — think of it as a "mini Express app" that only handles routing. Instead of defining all your routes directly on your main app object (in index.js), you define them here on router, then plug the whole thing into your main app later

router.post('/register', userRegister);
//Defines a route: when a POST request comes in to /register, run the userRegister function.

// .post(...) specifically listens for the POST HTTP method (used for creating/submitting data — like signing up).
// '/register' is the path, relative to wherever this router gets mounted in your main app (we'll get to that below).
// userRegister is the handler function — Express automatically calls it with (request, response) whenever a matching request arrives.

router.post('/login', userLogin);//sees jwt cookie

router.post('/logout', userLogOut);//sees jwt cookie and execute


export default router;