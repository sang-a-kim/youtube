import Video from "../models/Video";
import Comment from "../models/Comment";
import User from "../models/User";

export const home = async (req, res) => {
	const videos = await Video.find({}, null, { sort: { createdAt: "desc" } });
	return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
	const { id } = req.params;
	const video = await Video.findById(id)
		.populate("owner")
		.populate("comments");

	if (!video) {
		return res.status(404).render("404", { pageTitle: "Video not found" });
	}

	return res.render("watch", { pageTitle: video.title, video });
};

export const getEdit = async (req, res) => {
	const {
		params: { id },
		session: {
			user: { _id: userId },
		},
	} = req;
	const video = await Video.findById(id);

	if (!video) {
		return res.status(404).render("404", { pageTitle: "Video not found" });
	}

	if (userId != video.owner) {
		req.flash("error", "Not authorized");
		return res.status(403).redirect("/");
	}

	return res.render("edit", {
		pageTitle: `Edit ${video.title}`,
		video,
	});
};

export const postEdit = async (req, res) => {
	const { id } = req.params;
	const {
		body: { title, description, hashtags },
		session: {
			user: { _id: userId },
		},
	} = req;

	const video = await Video.findOne({ _id: id });

	if (!video) {
		return res.status(404).render("404", { pageTitle: "Video not found" });
	}

	if (userId != video.owner._id.toString()) {
		return res.status(403).redirect("/");
	}

	await Video.findByIdAndUpdate(id, {
		title,
		description,
		hashtags: Video.formatHashtags(hashtags),
	});

	req.flash("success", "Changes saved.");
	return res.redirect(`../${id}`);
};

export const getUpload = (req, res) => {
	return res.render("upload", { pageTitle: `Upload Video` });
};

export const postUpload = async (req, res) => {
	const {
		body: { title, description, hashtags },
		file: { location },
		session: {
			user: { _id },
		},
	} = req;

	try {
		await Video.create({
			title,
			description,
			hashtags: Video.formatHashtags(hashtags),
			video: location,
			owner: _id,
		});

		return res.redirect("/");
	} catch (e) {
		return res.status(400).render("upload", {
			pageTitle: `Upload Video`,
			errorMessage: e._message,
		});
	}
};

export const deleteVideo = async (req, res) => {
	const {
		params: { id },
		session: {
			user: { _id: userId },
		},
	} = req;

	const video = await Video.findById(id);

	if (!video) {
		return res.status(404).render("404", { pageTitle: "Video not found" });
	}

	if (userId != video.owner._id.toString()) {
		return res.status(403).redirect("/");
	}

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
	return res.render("search", { pageTitle: "search", videos });
};

export const regiseterView = async (req, res) => {
	const { id } = req.params;
	const video = await Video.findById(id);
	if (!video) {
		return res.sendStatus(404);
	}

	await Video.findByIdAndUpdate(id, {
		meta: { views: video.meta.views + 1 },
	});

	return res.sendStatus(200);
};

export const createComment = async (req, res) => {
	const {
		params: { id: videoId },
		body: { text },
		session: {
			user: { _id: userId },
		},
	} = req;

	try {
		const comment = await Comment.create({
			text,
			owner: userId,
			video: videoId,
		});

		const video = await Video.findById(videoId);

		if (!video) {
			return res.sendStatus(404);
		}

		await Video.findByIdAndUpdate(videoId, {
			comments: [comment.id, ...video.comments],
		});

		return res.sendStatus(201);
	} catch (e) {
		console.log(e);
		return res.sendStatus(400);
	}
};
