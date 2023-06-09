import User from "../models/User";
import bcrypt from "bcrypt";
import Video from "../models/Video";

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
export const getEdit = (req, res) => {
	return res.render("edit-profile", {
		pageTitle: "Edit Profile",
		user: req.session.user,
	});
};
export const postEdit = async (req, res) => {
	const {
		session: { user },
		body: { name, email, username, location },
		file,
	} = req;

	const existedUserName = await User.exists({ username });

	if (user.username !== username && existedUserName) {
		return res.status(400).render("edit-profile", {
			pageTitle: "Edit Profile",
			errorMessage: "This username has already taken.",
			user,
		});
	}

	const existedEmail = await User.exists({ email });

	if (user.email !== email && existedEmail) {
		return res.status(400).render("edit-profile", {
			pageTitle: "Edit Profile",
			errorMessage: "This email has already taken.",
			user,
		});
	}

	const updatedUser = await User.findByIdAndUpdate(
		user._id,
		{
			avatarUrl: file?.location ?? user.avatar,
			name,
			email,
			username,
			location,
		},
		{ new: true }
	);

	req.session.user = updatedUser;

	return res.redirect("/users/edit");
};
export const remove = (req, res) => res.send("Remove User");
export const getLogin = (req, res) => {
	return res.render("login", { pageTitle: "Login" });
};
export const postLogin = async (req, res) => {
	const pageTitle = "Login";
	const { username, password } = req.body;
	const user = await User.findOne({ username, socialOnly: false });
	if (!user) {
		return res.status(400).render("login", {
			pageTitle,
			errorMessage: "An account with this username does not exists.",
		});
	}

	const match = await bcrypt.compare(password, user.password);
	if (!match) {
		return res.status(400).render("login", {
			pageTitle,
			errorMessage: "Password is not matched.",
		});
	}

	req.session.loggedIn = true;
	req.session.user = user;
	res.redirect("/");
};
export const logout = (req, res) => {
	req.session.destroy();
	return res.redirect("/");
};
export const getProfile = async (req, res) => {
	const { id } = req.params;
	const user = await User.findById(id);

	if (!user) {
		return res.status(404).render("404", { pageTitle: "Video not found" });
	}

	const videos = await Video.find({ owner: id });

	return res.render("users/profile", { pageTitle: user.name, user, videos });
};
export const startGithubLogin = (req, res) => {
	const baseUrl = "https://github.com/login/oauth/authorize";
	const config = {
		client_id: process.env.GH_CLIENT,
		allow_signup: false,
		scope: "read:user user:email",
	};
	const params = new URLSearchParams(config);
	const finalUrl = `${baseUrl}?${params}`;

	res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
	const baseUrl = "https://github.com/login/oauth/access_token";
	const config = {
		client_id: process.env.GH_CLIENT,
		client_secret: process.env.GH_SECRET,
		code: req.query.code,
	};
	const params = new URLSearchParams(config);
	const finalUrl = `${baseUrl}?${params}`;

	const tokenRequest = await (
		await fetch(finalUrl, {
			method: "POST",
			headers: {
				Accept: "application/json",
			},
		})
	).json();

	if ("access_token" in tokenRequest) {
		const { access_token } = tokenRequest;
		const apiUrl = "https://api.github.com";

		const userData = await (
			await fetch(`${apiUrl}/user`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${access_token}`,
				},
			})
		).json();


		let user = await User.findOne({ email: userData.email });

		if (!user) {
			user = await User.create({
				name: userData.name,
				username: userData.login,
				email: userData.email,
				avatarUrl: userData.avatar_url,
				socialOnly: true,
				location: userData.location,
			});
		}
		req.session.loggedIn = true;
		req.session.user = user;
		return res.redirect("/");
	} else {
		res.redirect("/login");
	}
};

export const getChangePassword = (req, res) => {
	if (req.session.user.socialOnly) {
		req.flash("error", "Can't change password.")
		return res.redirect("/");
	}
	return res.render("users/change-password", {
		pageTitle: "Change Password",
	});
};

export const postChangePassword = async (req, res) => {
	const {
		session: { user },
		body: { OldPassword, NewPassword, NewPasswordConfirmation },
	} = req;

	const pageTitle = "Change Password";

	if (NewPassword !== NewPasswordConfirmation) {
		return res.status(400).render("users/change-password", {
			pageTitle,
			errorMessage: "The password does not match the confirmation",
		});
	}

	const match = await bcrypt.compare(OldPassword, user.password);
	if (!match) {
		return res.status(400).render("users/change-password", {
			pageTitle,
			errorMessage: "Password is not matched.",
		});
	}

	const updatedUser = await User.findByIdAndUpdate(
		user._id,
		{
			...user,
			password: NewPassword,
		},
		{ new: true }
	);

	req.session.user = updatedUser;
	req.flash("info", "Password updated")
	return res.redirect("/");
};
