import User from "../models/User";
import Video from "../models/Video";

export const home = async (req, res) => {
	const videos = await Video.find({}, null, { sort: { createdAt: "desc" } });
	return res.render("video/home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
	const { id } = req.params;
	const video = await Video.findById(id).populate('owner')

	if (!video) {
		return res.status(404).render("404", { pageTitle: "Video not found" });
	}
	return res.render("video/watch", { pageTitle: video.title, video });
};

export const getEdit = async (req, res) => {
	const { id } = req.params;
	const video = await Video.findById(id);
	if (!video) {
		return res.status(404).render("404", { pageTitle: "Video not found" });
	}
	return res.render("video/edit", {
		pageTitle: `Edit ${video.title}`,
		video,
	});
};

export const postEdit = async (req, res) => {
	const { id } = req.params;
	const { title, description, hashtags } = req.body;
	try {
		await Video.exists({ _id: id });
	} catch {
		return res.status(404).render("404", { pageTitle: "Video not found" });
	}
	await Video.findByIdAndUpdate(id, {
		title,
		description,
		hashtags: Video.formatHashtags(hashtags),
	});
	return res.redirect(`../${id}`);
};
export const getUpload = (req, res) => {
	return res.render("video/upload", { pageTitle: `Upload Video` });
};
export const postUpload = async (req, res) => {
	const {
		body: { title, description, hashtags },
		file: { path },
		session: {
			user: { _id, videos },
		},
	} = req;

	try {
		await Video.create({
			title,
			description,
			hashtags: Video.formatHashtags(hashtags),
			video: path,
			owner: _id,
		});

		return res.redirect("/");
	} catch (e) {
		return res.status(400).render("video/upload", {
			pageTitle: `Upload Video`,
			errorMessage: e._message,
		});
	}
};

export const deleteVideo = async (req, res) => {
	const { id } = req.params;
	console.log({ id });
	await Video.findByIdAndDelete(id);
	return res.redirect("/");
};

export const search = async (req, res) => {
	const { keyword } = req.query;
	let videos = [];
	if (keyword) {
		videos = await Video.find({ title: new RegExp(keyword, "ig") }, null, {
			sort: { createdAt: "desc" },
		});
	}
	return res.render("video/search", { pageTitle: "search", videos });
};
