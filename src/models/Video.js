import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
	title: { type: String, required: true, trim: true, maxlength: 80 },
	description: { type: String, required: true, trim: true, minlength: 20 },
	createdAt: { type: Date, required: true, default: Date.now },
	hashtags: [{ type: String, trim: true }],
	meta: {
		views: { type: Number, default: 0, required: true },
		rating: { type: Number, default: 0, required: true },
	},
});

videoSchema.pre("save", async function () {
	console.log(this)
	this.hashtags = this.hashtags[0]
		.split(",")
		.map((el) => el.trim())
		.map((el) => (el.startsWith("#") ? el : "#" + el));
});

videoSchema.pre("findOneAndUpdate", async function () {
	const docToUpdate = await this.model.findOne(this.getQuery());
	docToUpdate.hashtags = docToUpdate.hashtags[0]
		.split(",")
		.map((el) => el.trim())
		.map((el) => (el.startsWith("#") ? el : "#" + el));
});

const Video = mongoose.model("Video", videoSchema);
export default Video;
