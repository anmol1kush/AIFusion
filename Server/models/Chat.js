import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  isImage: {
    type: Boolean,
    required: true,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    required: true, // e.g., "user" or "assistant"
  },
  content: {
    type: String, // should be String, not Number
    required: true,
  },
  timestamp: {
    type: Number,
    required: true,
  },
});

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // ✅ should be ObjectId
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    messages: [messageSchema], // ✅ now an array of message subdocuments
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
