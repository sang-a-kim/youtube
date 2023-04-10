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
		return res.redirect("/login");
	}
};

export const publicOnlyMiddleware = (req, res, next) => {
	if (!req.session.loggedIn) {
		next();
	} else {
		return res.redirect("/");
	}
};
