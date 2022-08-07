import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        first_name: {type: String, minLength: 1, maxLength: 20, required: true},
        last_name: {type: String, minLength: 1, maxLength: 20, required: true},
        isMember: {type: Boolean, default: false},
        username: {type: String, minLength: 4, maxLength: 15, required: true},
    }
);

export default mongoose.model('User', UserSchema);