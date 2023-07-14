import  mongoose from "mongoose";

const PostSchema = new mongoose.Schema ({
    title: {type: String},
    summary: {type: String},
    content: {type: String},
    photo: {type: String},
    author: {type: mongoose.Types.ObjectId, ref: 'User', required: true },
}, {
    timestamps: true
})

const PostModel = mongoose.model("Post", PostSchema);
export default PostModel;