const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const textarea = form.querySelector("textarea");
const button = form.querySelector("button");

const handleSubmit = (e) => {
	e.preventDefault();
	const text = textarea.value;
	const videoId = videoContainer.dataset.videoid
	console.log(videoId)
};

form.addEventListener("submit", handleSubmit);
