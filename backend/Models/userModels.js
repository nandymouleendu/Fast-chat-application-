//for creating a general schema for the users,it can be known by node js properly
// this is a Mongoose Schema/Model, which is basically the blueprint for how your user data is structured in MongoDB.
// and which features i can be able to integrate in here
// import { Timestamp } from "mongodb";
import mongoose from "mongoose";
// import bcrypt from "bcryptjs";// hash or encrypt the user password

const userSchema = mongoose.Schema({//This starts creating a Schema — think of a schema as a form template or blueprint. It defines exactly what fields a "user" document must have, what type each field is, and what rules apply to each field (required, unique, etc.). It doesn't create any data yet — it just defines the shape that data must follow.
    
    Fullname:{
        type:String,
        required:true,//means every user document must have this field — Mongoose will throw a validation error if you try to save a user without it.
        trim:true//remove accidental whitespace

    },
    Username:{
        type:String,
        required:true,
        unique:true,//it gives a unique username to each user
        trim:true,
        lowercase:true//Automatically converts the value to lowercase before saving — prevents issues like "John" and "john" being treated as different usernames when they logically shouldn't be.
    },
    Email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        match:[/^\S+@\S+\.\S+$/, "Please enter a valid email"]//match runs a regex validation against the field. This particular pattern checks for a basic valid email shape (text@text.text). If it doesn't match, Mongoose throws a validation error with the message "Please enter a valid email".

    },
    Gender:{
        type:String,
        required:true,
        enum:["male","female","other"]

    },
    Password:{
        type:String,
        required:true,
        minlength:4,

    },
    ProfilePic:{
        type:String,
        // required:true,
        default:""//someone who wants a id without a profile pic
        // default:"https://example.com/default-avatar.png"//sets the profilepic as a unknown man without a face like previous wp user icon without a pp

    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    isVerified:{//cheaks if a user is verified their email
        type:Boolean,//you correctly removed it, following the security reasoning from earlier: never trust role/isVerified from the client
        default:false
    }

}, {timestamps:true}) //add a time stamp to the user that when its created and it autometically manage createdAt — when the user document was first created,updatedAt — when it was last modified

// Runs automatically before a document is saved
// userSchema.pre("save", async function(next){//This is Mongoose middleware — code that runs automatically before a document is saved to the database (.save() is called). "pre" means "before," and "save" is the event we're hooking into.
//                                             // function(next) — note this is a regular function, not an arrow function. That's intentional! Inside Mongoose middleware, this needs to refer to the document being saved. Arrow functions don't have their own this, so they'd break this.
//                                             // next is a callback you call once your logic is done, telling Mongoose "okay, continue with the save."

//     if(!this.isModified("Password")){
//         return next();
//     }                                       //This checks: "Has the password field actually changed?" This matters because this same pre("save") hook runs every time you save a user document — not just on creation. So if someone updates their Fullname only, you don't want to re-hash an already-hashed password (that would break login entirely, since hashing an already-hashed string gives a different result). If the password wasn't touched, skip straight to next().
//     const salt = await bcrypt.genSalt(10);//Generates a salt — random data mixed into the hashing process so that even if two users have the same password, their hashes look completely different. 10 is the "cost factor" — how many rounds of processing, balancing security vs. speed (10 is a common safe default).
//     this.Password = await bcrypt.hash(this.Password, salt);//Takes the plain-text password currently on the document (this.Password), hashes it using the salt, and overwrites the field with the hashed version. This is what actually gets saved to MongoDB.
//     next();                                     //Tells Mongoose we're done — proceed with saving the document.
// });

// // Custom method to compare login password with hashed password
// userSchema.methods.comparePassword = async function(enteredPassword){
//     return await bcrypt.compare(enteredPassword, this.Password);
// }                                               //This adds a custom method to every user document. Later, during login, you can't "un-hash" a password to check it — instead, you hash the entered password using the same algorithm and compare the two hashes. bcrypt.compare() handles this safely and returns true/false.
                                                //from pre till this is a additional part for encypting the password from claude

const user = mongoose.model("user", userSchema);// important .it takes your blueprint (userSchema) and turns it into an actual usable Model.

                                                //A Model is like a factory/class you use to actually create, read, update, and delete documents in your database that follow this schema's shape.
                                                //The first argument, "user", is the name of the model. Mongoose will automatically look for (or create) a MongoDB collection called users (it lowercases and pluralizes the name automatically) to store these documents in.

export default user;//This makes the user model available to import and use elsewhere in your app


//What are you actually achieving with this file overall?
// You're defining the rules and structure for what a "user" looks like in your database, so that:

// Every user document saved to MongoDB is consistent (same fields, same types).
// Mongoose automatically validates data before saving (rejecting bad data like missing fields, wrong gender values, too-short passwords, duplicate usernames/emails).
// You get a reusable user model/object to create, find, update, or delete user records anywhere in your app, without writing raw MongoDB queries by hand.

// Quick analogy
// Think of the schema like an application form for a club:

// Each field (Fullname, Email, etc.) is a required box on the form, with rules about what counts as a valid answer.
// The model (user) is like the filing cabinet system the club uses — once someone fills out the form correctly, the model handles storing it, retrieving it later, and organizing it in the "users" drawer of your database.