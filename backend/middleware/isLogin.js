import jwt from 'jsonwebtoken'
import user from '../Models/userModels.js'

const isLogin = async(request,response,next) =>{//its an express middle wire a function that runs before your actual route handler (e.g., getAllUsers, sendMessage).
    try {
        const token = request.cookies.jwt;//pulls the value of the cookie called jwt out of the incoming request,works coz of cookie parser ,where i already parsed raw cookie header into request.cookies 
    if (!token) {
        return response.status(401).send({success:false,message:"User unauthorized"})
    }
    const decode = jwt.verify(token,process.env.JWT_SECRET);//cheaks for jwt signature with a secret key,and also cheaks the expiration date 
    if (!decode) {
        return response.status(401).send({success:false,message:"User unauthorized - token invalid"})
    }
    const findUser = await user.findById(decode.userId).select("-Password");//verifies the password from mongodb which is hashed by re hashing from your current given pass
    if (!findUser) {
        return response.status(401).send({success:false,message:"user not found"})

    }
        request.findUser = findUser;//This is the payoff: it attaches the fetched user document onto the request object itself, under a custom property findUser,can access request.findUser._id, request.findUser.Username, etc.
        next();//hands control forward to whatever route handler comes next in the chain
        
    } catch (error) {
         console.log(`Error in isLogin middleware ${error.message}`);
        return response.status(500).send({ 
            success: false, 
            message: "Something went wrong during authentication"  
        });
        
    }
}

export default isLogin