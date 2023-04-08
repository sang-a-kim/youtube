import User from "../models/User";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
	const { name, email, username, password, password2, location } = req.body;
	const pageTitle = "Join";

	if (password !== password2) {
		return res.status(400).render("join", {
			pageTitle,
			errorMessage: "Password confirmation does not match",
		});
	}

	const exists = await User.exists({
		$or: [{ username }, { email }],
	});
	if (exists) {
		return res.status(400).render("join", {
			pageTitle,
			errorMessage: "This username/email is already taken",
		});
	}
	try {
		await User.create({
			name,
			username,
			email,
			password,
			location,
		});
		res.redirect("/");
	} catch (e) {
		return res.status(400).render("join", {
			pageTitle,
			errorMessage: e._message,
		});
	}
};
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
export const getLogin = (req, res) => {
	return res.render("login", { pageTitle: "Login" });
};
export const postLogin = async (req, res) => {
	const { username, password } = req.body;
	const exists = await User.exists({ username });
	if (!exists) {
		return res.status(400).render("login", {
			pageTitle: "Login",
			errorMessage: "An account with this username does not exists.",
		});
	}
	res.end();
};
export const logout = (req, res) => res.send("Logout");
export const see = (req, res) => res.send("See");
