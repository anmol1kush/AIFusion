import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from 'jsonwebtoken'
import Chat from "../models/Chat.js";

const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:'30d'
    })
}


export const registerUser= async (req,res)=>{
    const {name,email,password}=req.body;

    try {
        const userExists = await User.findOne({email})
        if(userExists){
            return res.json({
                success:false,
                message:"User already Exist"
            })
        }
          const user=await User.create({name,email,password})

          const token= generateToken( user._id)
         return  res.json({
            success:true,
            token
          })


    } catch (error) {
        return res.json({
            success:false,
            message:error.message
        })
        
    }
}

export const loginUser= async ( req,res)=>{
    const {email,password}=req.body;
    try {
          const user = await User.findOne({email})
          if(user){
            const isMatch= await bcrypt.compare(password,user.password)
            if( isMatch){
                const token= generateToken(user._id);
                return res.json({
                    success:true,
                    token
                })
            }
          }
          return res.json({
            success:false,
            message:"Invalid user or password"

          })


        
    } catch (error) {
            return res.json({
            success:false,
            message:error.message
        })
    }
}
export const getUser= async (req,res)=>{
    try {
        const user= req.user;  // user we need middleware
        return res.json({
            success:true,
            user
        })
    } catch (error) {
        return res.json({
            success:false,
            message:error.message
        })
        
    }
}

// APi to published image
export const getPublishedImage = async (req, res) => {
  try {
    const publishedImageMessage = await Chat.aggregate([
      { $unwind: '$messages' },
      {
        $match: {
          "messages.isImage": true,
          "messages.isPublished": true, // ✅ fixed key name
        },
      },
      {
        $project: {
          _id: 0,
          imageUrl: "$messages.content",
          userName: "$userName",
        },
      },
    ]);
    console.log("hekko")

    return res.json({
      success: true,
      image: publishedImageMessage.reverse(),
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
