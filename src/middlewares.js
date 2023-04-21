import multer from "multer";

export const localsMiddleware = (req, res, next) => {
	res.locals.loggedIn = !!req.session.loggedIn;
	res.locals.siteName = "Youtube";
	res.locals.loggedInUser = req.session.user || {};
	next();
};

export const protectorMiddleware = (req, res, next) => {
	if (req.session.loggedIn) {
		next();
	} else {
		req.flash("error", "Login first.")
		return res.redirect("/login");
	}
};

export const publicOnlyMiddleware = (req, res, next) => {
	if (!req.session.loggedIn) {
		next();
	} else {
		req.flash("error", "Not authorized")
		return res.redirect("/");
	}
};

export const uploadImg = multer({
	dest: "uploads/avatars/",
	fileSize: 1000000,
});
export const uploadVideo = multer({
	dest: "uploads/videos/",
	fileSize: 10000000,
});
