import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Video from './Video';

const userSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	avatarUrl: String,
	socialOnly: { type: Boolean, default: false },
	username: { type: String, required: true, unique: true },
	password: { type: String },
	name: { type: String, required: true },
	location: String,
	videos: [{ type: mongoose.Types.ObjectId, ref: "Video" }],
});

userSchema.pre("save", async function () {
	if (this.socialOnly) return;
	this.password = await bcrypt.hash(this.password, 5);
});

const User = mongoose.model("User", userSchema);
export default User;
