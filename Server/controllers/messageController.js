import axios from "axios";
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import imagekit from '../config/imagekit.js'
import openai from "../config/openai.js";


export const textMessageController= async (req ,res)=>{
    try {
        const userId= req.user._id;
            if( req.user.credits<1){
            return res.json({
                sucress: false,
                message: 'you dont have enough credites to use this features'
            })
        }
        const { chatId,prompt}= req.body;

        const chat = await Chat.findOne({userId,_id: chatId})
        chat.messages.push({role:"user",content:prompt,timestamp: Date.now(),isImage:false})
        const {choices} = await openai.chat.completions.create({
    model: "gemini-2.0-flash",
    messages: [
        {
            role: "user",
            content: prompt,
        },
    ],
});
const reply = {
    role: "assistant",
    content: choices[0].message.content, // this is the actual text
    timestamp: Date.now(),
    isImage: false
};

chat.messages.push(reply)
 await chat.save()


 await User.updateOne({ _id:userId },{ $inc:{credits:-1}})
   return res.json({
      success: true,
      message: "Message processed successfully",
      reply,
    });


        

    } catch (error) {
        res.json({
            success:false,
            message: error.message
        })
    }
}

//Image generation
export const imageMessageController = async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user.credits < 2) {
      return res.json({
        success: false,
        message: "You don't have enough credits to generate image",
      });
    }

    const { prompt, chatId, isPublished } = req.body;
    const chat = await Chat.findOne({ userId, _id: chatId });

    if (!chat) {
      return res.json({
        success: false,
        message: "Chat not found",
      });
    }

    // Push the user prompt message
    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
      isPublished: false,
    });

    // Generate encoded prompt for the ImageKit API
    const encodedPrompt = encodeURIComponent(prompt);

    const generatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/my_gemini/${Date.now()}.png?tr=w-800,h-800`;

    // Fetch AI-generated image
    const aiImageResponse = await axios.get(generatedImageUrl, {
      responseType: "arraybuffer",
    });

    // Convert to base64
    const base64Image = `data:image/png;base64,${Buffer.from(
      aiImageResponse.data,
      "binary"
    ).toString("base64")}`;

    // Upload to ImageKit
    const uploadResponse = await imagekit.upload({
      file: base64Image,
      fileName: `${Date.now()}.png`,
      folder: "my_gemini",
    });

    // Create assistant reply (✅ include `content`)
    const reply = {
      role: "assistant",
      content: uploadResponse.url, // ✅ content is required → store image URL as content
      timestamp: Date.now(),
      isImage: true,
      isPublished,
    };

    

    // Save to chat
    chat.messages.push(reply);
    await chat.save();

    // Deduct 2 credits
    await User.updateOne({ _id: userId }, { $inc: { credits: -2 } });

    // Send response to client
    return res.json({
      success: true,
      reply,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
