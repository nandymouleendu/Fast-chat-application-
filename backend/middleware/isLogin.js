import jwt from 'jsonwebtoken'
import user from '../Models/userModels.js'

const isLogin = async(request,response,next) =>{
    try {
        // console.log(request.cookies.jwt);
        const token = request.cookies.jwt;
    if (!token) {
        return response.status(401).send({success:false,message:"User unauthorized"})
    }
    const decode = jwt.verify(token,process.env.JWT_SECRET);
    if (!decode) {
        return response.status(401).send({success:false,message:"User unauthorized - token invalid"})
    }
    const findUser = await user.findById(decode.userId).select("-Password");
    if (!findUser) {
        return response.status(401).send({success:false,message:"user not found"})

    }
        request.findUser = findUser;
        next();
        
    } catch (error) {
         console.log(`Error in isLogin middleware ${error.message}`);
        return response.status(500).send({ 
            success: false, 
            message: "Something went wrong during authentication"  
        });
        
    }
}

export default isLogin