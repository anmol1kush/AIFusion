import Chat from "../models/Chat.js";

export const createChat = async (req, res) => {
  try {
    const userId = req.user._id;

    const chatData = {
      userId,
      messages: [],
      name: "New Chat",
      userName: req.user.name,
    };

    await Chat.create(chatData);
   return  res.json({
      success: true,
      message: "Chat created",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getChats = async (req, res) => {
  try {
    const userId = req.user._id;

    // ✅ Correct method is .sort(), not .toSorted()
    const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });

   return  res.json({
      success: true,
      message: chats,
    });
  } catch (error) {
   return  res.json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatId } = req.body; 

   
    await Chat.deleteOne({ _id: chatId, userId });

   return  res.json({
      success: true,
      message: "Chat deleted",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
