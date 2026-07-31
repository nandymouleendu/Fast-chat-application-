
// import user from "../Models/userModels.js";//this is my interface for creating, finding, and saving user documents in MongoDB.
// import bcrypt from "bcryptjs";
// import jwtToken from "../Utils/jsonWebToken.js"//A "utils" (utilities) module typically contains small, reusable helper functions designed to handle repetitive, low-level tasks across a software project like mask sensitive info,cheaking if text is empty,verify valis int,float,ip address,data conversions etc
// //Imports your custom helper function that creates a signed JWT and attaches it as a cookie to the response — this is what "logs a user in" from the browser's perspective.cookie r sathe/pichone lagano sighned permit for every entry

// export const userRegister = async(request,response)=>{//Defines and exports an async function — async is required here because you use await inside (for database calls)
//     try {
//         const{Fullname, Username, Email, Gender, Password, ProfilePic} = request.body; //if any data comes from frontend just forward it, then Destructuring — pulls these six named fields directly out of the JSON body sent by the client (e.g., from Postman), so instead of writing request.body.Fullname repeatedly, you can just use Fullname. 
//         const User = await user.findOne({ 
//             $or: [{ Username }, { Email }] //Queries MongoDB: "find one user where either the Username matches or the Email matches." $or is a MongoDB operator that checks multiple conditions and matches if any of them are true. await pauses here until the database responds.
//         });
//         if (User) { return response.status(400).send({success:false,message:" username or email is already taken by another person"});
//     }//yeah for this companies uses bloom filter

//         const hashPassword = bcrypt.hashSync(Password,10);//Hashes the plain-text password synchronously. 10 is the salt rounds — how many times the hashing algorithm processes the data (more rounds = more secure, but slower). This scrambled version is what actually gets saved — never the original password.
// //salt round-determine the computational complexity and time required to calculate a single cryptographic hash to prevent bruteforce attacks like 10 rounds = 2¹⁰ = 1,024 iterations,: If a database is leaked, hackers use powerful hardware to guess billions of combinations per second. Raising the salt rounds forces their hardware to work thousands of times harder per guess.
// //its basically a rate limiter

//         const profileBoy = `https://avatar.iran.liara.run/public/boy?Username=${Username}`
//         const profileGirl = `https://avatar.iran.liara.run/public/girl?Username=${Username}`
//         const profileOther = `https://avatar.iran.liara.run/public/old?Username=${Username}`
// //Three template strings, each building a URL to a placeholder avatar image API, personalized with the user's Username as a query parameter

//         let defaultProfilePic;
//         if (Gender === "male") {
//             defaultProfilePic = profileBoy;
//         } else if (Gender === "female") {
//             defaultProfilePic = profileGirl;
//         } else {
//             defaultProfilePic = profileOther;
//         }

//         const newUser = new user({
//             Fullname,
//             Username,
//             Email,
//             Gender,
//             Password:hashPassword,
//             ProfilePic: ProfilePic || defaultProfilePic,
//         });
// //Creates a new, in-memory document using your Mongoose model — this doesn't touch the database yet, just builds the object in JavaScript. Notice Password is set to the hashed version, not the raw one.

//         if (newUser) {
//             await newUser.save();//if newuser comes just save them in database
//             jwtToken(newUser._id,response)
//         } else {
//             return response.status(400).send({success:false,message:" Invalid user data mama "});
//         }
//         //for send it to frontend just send these items not the password to show everyone
// //newUser will basically always be truthy here (object creation with new doesn't fail silently — it would've thrown an error already if something was wrong), so this else branch rarely triggers in practice, but it's there as a defensive fallback. newUser.save() is what actually writes the document to MongoDB. Once saved, jwtToken(...) generates a signed token containing the user's ID and attaches it as a cookie on the response — this is what keeps the user "logged in" after registering.

//         return response.status(201).send({
//             success: true,
//             message: "User registered successfully",
//             user: {
//                 id: newUser._id,
//                 Fullname: newUser.Fullname,
//                 Username: newUser.Username,
//                 Email: newUser.Email,
//                 ProfilePic: newUser.ProfilePic,
//             }
//         });
// //Sends a 201 ("resource created") response back with selected user details — deliberately excluding the password so it's never exposed to the client.


//     } catch (error) {
//         //now if any error comes in try block but not resolving and not just crashing so then we use these
//          console.log("Registration error:", error.message);
//         return response.status(500).send({ 
//             success: false, 
//             message: "Something went wrong during registration" 
//         });
        
//     }
// }
// //If anything above throws (bad DB connection, validation error, unexpected bug), execution jumps here. Logs the real error to your terminal (for you to debug) and sends a generic 500 message to the client (so you don't leak internal details to users).
// //Yes, a 201 and a 500 are completely different. These are standard HTTP status codes used to communicate the result of a web or API request.
// //201 Created: This means the request was successful. and 500 means internal error occured,400 Bad Request (Client Error)

// export const userLogin = async(request,response) =>{
//     try {
//         const {Email,Password} = request.body;//taking email and pass from frntend,Pulls just Email and Password from the login request body — that's all login needs.

//         //cheak if email is exist or not
//         const foundUser = await user.findOne({Email})
//         if(!foundUser) {//if user doesnt exist
//             return  response.status(400).send({ 
//             success: false, 
//             message: "Email or password is incorrect" 
//         });
//     }
//     const comparePasss= bcrypt.compareSync(Password,foundUser.Password||"")//its for bcrypt.compareSync(enteredPlainPassword, storedHashedPassword) for extra security and the password never recovered
// //Since the stored password is hashed, you can't directly compare strings. bcrypt.compareSync re-hashes the entered password internally using the same salt and checks if it matches the stored hash — returns true/false. The || "" fallback prevents a crash if foundUser.Password were ever missing/undefined.
//         if(!comparePasss){//if user doesnt exist
//             return  response.status(400).send({ 
//             success: false, 
//             message: "Email or password doesnt exist" 
//         });
//     }
//         jwtToken(foundUser._id, response);//after taking everything from frontend we save it in the backend for future use

//         return response.status(200).send({
//             success: true,
//             message: "Login successful",
//             user: {
//                 id: foundUser._id,
//                 Fullname: foundUser.Fullname,
//                 Username: foundUser.Username,
//                 Email: foundUser.Email,
//                 ProfilePic: foundUser.ProfilePic,
//             }
//         });//Sends back user info (again excluding the password) with a 200 OK status. (Same ProfilePic → Profilepic fix needed here.)


//     } catch (error) {
//         console.log("Login error:", error.message);
//         return response.status(500).send({ 
//             success: false, 
//             message: "Something went wrong during Login" 
        
//         })
// }
// }

// export const userLogOut = (request, response) => {
//     try {
//         response.cookie("jwt", "", { maxAge: 0 });//Overwrites the existing jwt cookie with an empty value and sets maxAge: 0, which tells the browser to immediately expire/delete it. This is the entire mechanism of "logging out" — there's no server-side session to destroy, just the cookie the client was using to prove who they are.
//         response.status(200).send({message:"User LogOut"})
//         return response;

//     } catch (error) {
//         console.log("Logout error:", error.message);
//         return response.status(500).send({
//             success: false,
//             message: "Something went wrong during logout"
//         });
//     }
// };









// //Postman is an industry-standard software platform that simplifies the entire API (Application Programming Interface) lifecycle. It allows developers to build, test, document, and monitor APIs from a single workspace. Instead of using complex command-line tools to send requests, users can use its interface to send data (like HTTP or GraphQL) and view server responses.
// //Big picture: how this all fits together

// // Register → validates uniqueness → hashes password → saves user to MongoDB → issues a JWT cookie → responds with safe user data.
// // Login → looks up user by email → verifies password against the stored hash → issues a fresh JWT cookie → responds with safe user data.
// // Logout → simply deletes the JWT cookie from the browser, so future requests no longer carry proof of identity.


import user from "../Models/userModels.js";
import bcrypt from "bcryptjs";
import jwtToken from "../Utils/jsonWebToken.js";

export const userRegister = async (request, response) => {
    try {
        const { Fullname, Username, Email, Gender, Password, ProfilePic } = request.body;
        const User = await user.findOne({
            $or: [{ Username }, { Email }]
        });
        if (User) {
            return response.status(400).send({ success: false, message: "username or email is already taken by another person" });
        }

        const hashPassword = bcrypt.hashSync(Password, 10);

        // DiceBear avatar API — reliable, no key needed, seeded by Username so it's consistent per user
        const defaultProfilePic = `https://api.dicebear.com/9.x/avataaars/svg?seed=${Username}`;

        const newUser = new user({
            Fullname,
            Username,
            Email,
            Gender,
            Password: hashPassword,
            ProfilePic: ProfilePic || defaultProfilePic,
        });

        if (newUser) {
            await newUser.save();
            jwtToken(newUser._id, response);
        } else {
            return response.status(400).send({ success: false, message: "Invalid user data mama" });
        }

        return response.status(201).send({
            success: true,
            message: "User registered successfully",
            user: {
                _id: newUser._id,
                Fullname: newUser.Fullname,
                Username: newUser.Username,
                Email: newUser.Email,
                ProfilePic: newUser.ProfilePic,
            }
        });

    } catch (error) {
        console.log("Registration error:", error.message);
        return response.status(500).send({
            success: false,
            message: "Something went wrong during registration"
        });
    }
};

export const userLogin = async (request, response) => {
    try {
        const { Email, Password } = request.body;

        const foundUser = await user.findOne({ Email });
        if (!foundUser) {
            return response.status(400).send({
                success: false,
                message: "Email or password is incorrect"
            });
        }

        const comparePasss = bcrypt.compareSync(Password, foundUser.Password || "");
        if (!comparePasss) {
            return response.status(400).send({
                success: false,
                message: "Email or password doesnt exist"
            });
        }

        jwtToken(foundUser._id, response);

        return response.status(200).send({
            success: true,
            message: "Login successful",
            user: {
                _id: foundUser._id,
                Fullname: foundUser.Fullname,
                Username: foundUser.Username,
                Email: foundUser.Email,
                ProfilePic: foundUser.ProfilePic,
            }
        });

    } catch (error) {
        console.log("Login error:", error.message);
        return response.status(500).send({
            success: false,
            message: "Something went wrong during Login"
        });
    }
};

export const userLogOut = (request, response) => {
    try {
        response.cookie("jwt", "", { maxAge: 0 });
        response.status(200).send({ message: "User LogOut" });
        return response;

    } catch (error) {
        console.log("Logout error:", error.message);
        return response.status(500).send({
            success: false,
            message: "Something went wrong during logout"
        });
    }
};