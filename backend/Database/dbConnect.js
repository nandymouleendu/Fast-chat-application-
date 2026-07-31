import mongoose from "mongoose";//This imports the Mongoose library — a popular tool that makes it easier to work with MongoDB from Node.js. It handles the actual connection to your database, plus gives you schema/model tools later on for structuring your data.


const dbConnect = async()=> {//The async keyword means this function can use await inside it, and it will automatically return a Promise (a placeholder for a value that will be available later — in this case, once the connection attempt finishes).
    try{
        await mongoose.connect(process.env.MONGODB_CONNECT);
                                                            //mongoose.connect(...) takes your connection string (the URL with username, password, cluster address, and database name) and tries to establish a connection,This is an asynchronous operation — it takes time (network request), so it returns a Promise.
                                                            //await pauses execution right here until that Promise resolves (connection succeeds) or rejects (connection fails) — instead of moving on to the next line immediately.
                                                             //process.env.MONGODB_CONNECT pulls the connection string value out of your .env file (loaded earlier via dotenv.config() in your main file).
        console.log("DB connected succesfully");

    }catch(error){
        console.log("DB connection failed:", error.message);//the db is still running but after exit its stops
        
        process.exit(1); 
        
    }
}

export default dbConnect