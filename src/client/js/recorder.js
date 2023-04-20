const recordingBtn = document.getElementById("recordingBtn");
const preview = document.getElementById("preview");
const video = document.getElementById("video");

let mediaRecorder;
let srcURL;

const handleRecording = async () => {
	if (!mediaRecorder) {
		onRecord();
	} else {
		mediaRecorder.state === "recording" ? onPause() : onDownLoad();
	}
};

const onDownLoad = () => {
  const a = document.createElement('a')
	a.href = srcURL;
	a.download = 'my_video';
  a.click();
	preview.src = "";
	mediaRecorder = null;
  recordingBtn.innerText = 'record'
};

const onRecord = async () => {
	const stream = await navigator.mediaDevices.getUserMedia({
		audio: true,
		video: { width: 400, height: 400 },
	});

	preview.srcObject = stream;
	preview.play();

	mediaRecorder = new MediaRecorder(stream);
	mediaRecorder.start();
	recordingBtn.innerText = "stop";
};

const onPause = () => {
	preview.pause();

	mediaRecorder.stop();
	recordingBtn.innerText = "download";
	preview.srcObject = null;

	mediaRecorder.ondataavailable = (e) => {
		const blob = new Blob([e.data], { type: "video/mp4" });
		const videoURL = window.URL.createObjectURL(blob);
		srcURL = videoURL;
		preview.src = videoURL;
		preview.controls = true;
		preview.loop = true;
		preview.play();
		video.files;
	};
};

recordingBtn.addEventListener("click", handleRecording);
