import mongoose from "mongoose";
import User from './User';

const videoSchema = new mongoose.Schema({
	title: { type: String, required: true, trim: true, maxlength: 80 },
	description: { type: String, required: true, trim: true, minlength: 20 },
	createdAt: { type: Date, required: true, default: Date.now },
	hashtags: [{ type: String, trim: true }],
	meta: {
		views: { type: Number, default: 0, required: true },
	},
	video: { type: String, required: true, default: [] },
	owner: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
});

videoSchema.static("formatHashtags", function (hashtags) {
	return hashtags
		.split(",")
		.map((el) => el.trim())
		.map((el) => (el.startsWith("#") ? el : "#" + el));
});

const Video = mongoose.model("Video", videoSchema);
export default Video;
