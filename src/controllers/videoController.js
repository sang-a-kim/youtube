import Video from "../models/Video";

export const home = async (req, res) => {
	const videos = await Video.find({});
	return res.render("home", { pageTitle: "Home", videos });
};
export const watch = (req, res) => {
	const { id } = req.params;
	return res.render("watch", { pageTitle: `Watching` });
};
export const getEdit = (req, res) => {
	const { id } = req.params;
	return res.render("edit", { pageTitle: `Editing: ` });
};
export const postEdit = (req, res) => {
	const { id } = req.params;
	const { title } = req.body;
	return res.redirect(`../${id}`);
};
export const getUpload = (req, res) => {
	return res.render("upload", { pageTitle: `Upload Video` });
};
export const postUpload = async (req, res) => {
	const { title, description, hashtags } = req.body;
	try {
		await Video.create({
			title,
			description,
			hashtag: hashtags
				.split(",")
				.map((el) => el.trim())
				.map((el) => (el.startsWith("#") ? el : "#" + el)),
		});
		return res.redirect("/");
	} catch (e) {
		return res.render("upload", {
			pageTitle: `Upload Video`,
			errorMessage: e._message,
		});
	}
};
