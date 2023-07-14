import {mongoose} from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {type: String, required:true, unique: true, min: 4},
    password: {type: String, required: true}
})

const UserModel = mongoose.model('User', UserSchema);

export default UserModel