import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PostSchema = new Schema(
    {
        title: {type: String, minLength: 1, maxLength: 60, required: true},
        content: {type: String, minLength: 1, maxLength: 400, required: true},
        date_posted: {type: Date, default: Date.now},
        user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    }
);

export default mongoose.model('Post', PostSchema);