const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const full = document.getElementById("full");
const videoContainer = document.getElementById("videoContainer");
const videoController = document.getElementById("videoController");

let volumeValue = 0.5;

let timeout = null;

video.volume = volumeValue;

const handlePlayClick = (e) => {
	if (video.paused) {
		video.play();
	} else {
		video.pause();
	}

	playBtn.innerText = video.paused ? "Play" : "Pause";
};

const handleMute = () => {
	if (video.muted) {
		video.muted = false;
	} else {
		video.muted = true;
	}

	muteBtn.innerText = video.muted ? "Unmute" : "Mute";
	volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeChange = (event) => {
	const {
		target: { value },
	} = event;

	if (video.muted) {
		video.muted = false;
		muteBtn.innerText = "Mute";
	}

	if (value == 0) {
		video.muted = true;
		muteBtn.innerText = "Unmute";
	}

	volumeValue = value;
	video.volume = value;
};

const formatTime = (seconds) =>
	new Date(Math.floor(seconds) * 1000).toISOString().slice(11, 19);

const handelLoadedMetadata = () => {
	totalTime.innerText = formatTime(video.duration);
	timeline.max = Math.floor(video.duration);
};

const handelTimeUpdate = () => {
	currentTime.innerText = formatTime(video.currentTime);
	timeline.value = Math.floor(video.currentTime);
};

const handleTimeControl = () => {
	video.currentTime = timeline.value;
	currentTime.innerText = formatTime(timeline.value);
};

const handleFullScreen = () => {
	if (!document.fullscreenElement) {
		videoContainer.requestFullscreen();
		full.innerText = "Exit Full";
	} else {
		document.exitFullscreen();
		full.innerText = "Full";
	}
};

const handleVideoPlay = () => {
	videoController.classList.add("showing");
};

const hideVideoController = () => {
	timeout = setTimeout(() => {
		if (video.paused) return;
		videoController.classList.add("showing");
		timeout = null;
	}, 3000);
};

const handleMouseMove = () => {
	videoController.classList.remove("showing");

	if (timeout) {
		clearTimeout(timeout);
		timeout = null;
	}

	hideVideoController();
};

const handleMouseLeave = () => {
	hideVideoController();
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handelLoadedMetadata);
video.addEventListener("timeupdate", handelTimeUpdate);
video.addEventListener("play", handleVideoPlay);
video.addEventListener("mousemove", handleMouseMove);
video.addEventListener("mouseenter", handleMouseEnter);
video.addEventListener("mouseleave", handleMouseLeave);
timeline.addEventListener("input", handleTimeControl);
full.addEventListener("click", handleFullScreen);
