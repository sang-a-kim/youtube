import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Video from "./Video";

const userSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	avatarUrl: String,
	socialOnly: { type: Boolean, default: false },
	username: { type: String, required: true, unique: true },
	password: { type: String },
	name: { type: String, required: true },
	location: String,
	videos: [{
		title: { type: String, required: true, trim: true, maxlength: 80 },
		description: { type: String, required: true, trim: true, minlength: 20 },
		createdAt: { type: Date, required: true, default: Date.now },
		hashtags: [{ type: String, trim: true }],
		meta: {
			views: { type: Number, default: 0, required: true },
			rating: { type: Number, default: 0, required: true },
		},
		video: { type: String, required: true },
		createdBy: { type: String, required: true },
	}],
});

userSchema.pre("save", async function () {
	if (this.socialOnly) return;
	this.password = await bcrypt.hash(this.password, 5);
});

const User = mongoose.model("User", userSchema);
export default User;
