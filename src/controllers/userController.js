import User from "../models/User";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
	const { name, email, username, password, location } = req.body;
	try {
		await User.create({
			name,
			username,
			email,
			password,
			location,
		});
	} catch (e) {
		console.log(e);
	}
	res.redirect('/');
};
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
export const login = (req, res) => res.send("Login");
export const logout = (req, res) => res.send("Logout");
export const see = (req, res) => res.send("See");
