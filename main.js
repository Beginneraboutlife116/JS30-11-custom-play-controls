const container = document.querySelector(".player")
const video = document.querySelector(".player__video")
const poster = document.querySelector(".player__poster")
const controls = document.querySelector(".player__controls")
const progress = document.querySelector(".progress")
const progressBar = document.querySelector(".progress__bar")
const playOrPauseBtn = document.querySelector(".play-pause")
const volumeBtn = document.querySelector(".volume")
const settingBtn = document.querySelector(".setting")
const dialog = document.querySelector(".dialog")
const fullscreen = document.querySelector(".fullscreen")
let mouseDownForProgress

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
  if (type === "volume") {
    if (video.muted) volumeBtn.dataset.state = "mute"
    else if (video.volume === 0) volumeBtn.dataset.state = "mute"
    else volumeBtn.dataset.state = "sound"
  }
}

function setProgressTime(event) {
  const time = (event.offsetX / progress.clientWidth) * video.duration
  progress.value = time
  video.currentTime = time
  poster.dataset.state = video.currentTime !== 0 ? "hidden" : "visible"
}

//* Class
class Slider {
  #mouseDown = false
  constructor({ htmlElement, mediaAPI }) {
    this.htmlElement = htmlElement
    this.mediaAPI = mediaAPI
    this.step = Number.parseFloat(htmlElement.step)
    this.min = Number.parseFloat(htmlElement.min)
    this.max = Number.parseFloat(htmlElement.max)
    this.value = Number.parseFloat(htmlElement.value)
  }

  mouseEvent() {
    this.htmlElement.addEventListener(
      "mousedown",
      () => (this.#mouseDown = true)
    )
    this.htmlElement.addEventListener("mousemove", (event) => {
      if (!this.#mouseDown) return
      const value = Number.parseFloat(event.target.value)
      video[this.mediaAPI] = value.toString()
    })
    this.htmlElement.addEventListener(
      "mouseup",
      () => (this.#mouseDown = false)
    )
  }

  changeEvent() {
    this.htmlElement.addEventListener("change", (event) => {
      const value = Number.parseFloat(event.target.value)
      video[this.mediaAPI] = value.toString()
    })
  }

  wheelEvent() {
    this.htmlElement.addEventListener("wheel", (e) => {
      if (e.deltaY > 0) {
        this.value += this.step
        this.value = this.value >= this.max ? this.max : this.value
      } else if (e.deltaY < 0) {
        this.value -= this.step
        this.value = this.value <= this.min ? this.min : this.value
      }
      this.htmlElement.value = this.value.toString()
      video[this.mediaAPI] = this.value.toString()
    })
  }
}

//* Program
const volumeSlider = new Slider({
  htmlElement: document.querySelector("input[id='volume']"),
  mediaAPI: "volume"
})
const playbackRateSlider = new Slider({
  htmlElement: document.querySelector("input[name='playbackRate']"),
  mediaAPI: "playbackRate"
})
const supportsVideo = !!document.createElement("video").canPlayType
const supportsProgress = document.createElement("progress").max !== undefined

if (supportsVideo) {
  video.controls = false
  controls.dataset.state = "visible"
}

if (!supportsProgress) progress.setAttribute("data-state", "fake")

playOrPauseBtn.addEventListener("click", playOrPauseVideo)

volumeBtn.addEventListener("click", () => {
  video.muted = !video.muted
  changeButtonState("volume")
})

volumeSlider.mouseEvent()
volumeSlider.changeEvent()
volumeSlider.wheelEvent()
playbackRateSlider.mouseEvent()
playbackRateSlider.changeEvent()
playbackRateSlider.wheelEvent()

settingBtn.addEventListener("click", () => {
  dialog.open = !dialog.open
  settingBtn.style.setProperty("--degree", dialog.open ? "30deg" : "0deg")
})

progress.addEventListener("mousedown", () => (mouseDownForProgress = true))

progress.addEventListener("mousemove", (e) => {
  if (!mouseDownForProgress) return
  setProgressTime(e)
})

progress.addEventListener("mouseup", () => (mouseDownForProgress = false))

progress.addEventListener("click", (e) => {
  setProgressTime(e)
})

video.addEventListener("click", playOrPauseVideo)

video.addEventListener("volumechange", () => {
  changeButtonState("volume")
})

video.addEventListener("loadedmetadata", () => {
  progress.setAttribute("max", video.duration)
})

video.addEventListener("timeupdate", () => {
  if (!video.getAttribute("max")) progress.setAttribute("max", video.duration)

  progress.value = video.currentTime
  const progressBarWidth = (video.currentTime / video.duration) * 100
  progress.style.setProperty("--bar-width", `${progressBarWidth}%`)
  progressBar.style.setProperty("--bar-width", `${progressBarWidth}%`)
})

video.addEventListener("ended", () => {
  changeButtonState("playOrPause")
})

window.addEventListener("click", (e) => {
  if (e.target !== settingBtn) {
    if (dialog.open) {
      dialog.open = false
      settingBtn.style.setProperty("--degree", "0deg")
    }
  }
})

window.addEventListener("keydown", (e) => {
  if (e.code === "ArrowRight") video.currentTime += 10
  if (e.code === "ArrowLeft") video.currentTime -= 10
  poster.dataset.state = video.currentTime !== 0 ? "hidden" : "visible"
})
