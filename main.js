const container = document.querySelector(".player")
const video = document.querySelector(".player__video")
const poster = document.querySelector(".player__poster")
const controls = document.querySelector(".player__controls")
const progress = document.querySelector(".progress")
const progressBar = document.querySelector(".progress__bar")
const playOrPauseBtn = document.querySelector(".play-pause")
const volumeBtn = document.querySelector(".volume")
const volumeSlider = document.querySelector("input[id='volume']")
const settingBtn = document.querySelector(".setting")
const dialog = document.querySelector(".dialog")
const playbackRateSlider = document.querySelector("input[name='playbackRate']")
const fullscreen = document.querySelector(".fullscreen")

//* Functions
function playOrPauseVideo() {
  poster.dataset.state = "hidden"
  const currentState = video.paused || video.ended ? "play" : "pause"
  video[currentState]()
  changeButtonState("playOrPause")
}

function changeButtonState(type) {
  if (type === "playOrPause") {
    playOrPauseBtn.dataset.state =
      video.paused || video.ended ? "play" : "pause"
  }
}

//* Program
const supportsVideo = !!document.createElement("video").canPlayType

if (supportsVideo) {
  video.controls = false
  controls.dataset.state = "visible"
}

video.addEventListener("click", playOrPauseVideo)
playOrPauseBtn.addEventListener("click", playOrPauseVideo)
