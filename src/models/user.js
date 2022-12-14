import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        first_name: {type: String, minLength: 1, maxLength: 20, required: true},
        last_name: {type: String, minLength: 1, maxLength: 20, required: true},
        isMember: {type: Boolean, default: false},
        isAdmin: {type: Boolean, default: false},
        username: {type: String, minLength: 4, maxLength: 15, required: true},
        password: {type: String, minLength: 5, required: true}
    }
);

UserSchema.virtual('full_name').get(function() {
    return this.first_name + ' ' + this.last_name;
});

export default mongoose.model('User', UserSchema);