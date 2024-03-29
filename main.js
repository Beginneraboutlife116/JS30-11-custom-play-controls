const container = document.querySelector(".player")
const video = document.querySelector(".player__video")
const poster = document.querySelector(".player__poster")
const controls = document.querySelector(".player__controls")

const progress = document.querySelector(".progress")
const progressBar = document.querySelector(".progress__bar")

const playOrPauseBtn = document.querySelector(".play-pause")
const volumeBtn = document.querySelector(".volume")
const settingBtn = document.querySelector(".setting")
const inputs = document.querySelectorAll("input[type='range']")
let doesInputFocus = false

const dialog = document.querySelector(".dialog")

const skipSignal = document.querySelector(".player__skip-signal")
const skipCircle = document.querySelector(".circle")
const skipArrows = document.querySelectorAll(".arrow")

const fullscreenBtn = document.querySelector(".fullscreen")
let mouseDownForProgress

const currentTime = document.querySelector(".current-time")
const totalTime = document.querySelector(".total-time")

//* Functions
function playOrPauseVideo() {
  poster.dataset.state = "hidden"
  const currentState = video.paused || video.ended ? "play" : "pause"
  video[currentState]()
  changeButtonState("playOrPause")
  controls.dataset.style = currentState
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

//* Function: fullscreen
function handleFullscreen() {
  if (isFullScreen()) {
    if (document.exitFullscreen) document.exitFullscreen()
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen()
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen()
    else if (document.msExitFullscreen) document.msExitFullscreen()

    this.dataset.state = "go-fullscreen"
  } else {
    if (container.requestFullscreen) container.requestFullscreen()
    else if (container.mozRequestFullScreen()) container.mozRequestFullScreen()
    else if (container.webkitRequestFullScreen)
      container.webkitRequestFullScreen()
    else if (container.msRequestFullscreen) container.msRequestFullscreen()

    this.dataset.state = "out-fullscreen"
  }
}

function isFullScreen() {
  return !!(
    document.fullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement ||
    document.webkitFullscreenElement
  )
}

//* Function: timer
function formatVideoTime(second) {
  if (typeof second !== "number") {
    throw new Error(
      "If you want to format time, you need to input seconds which type is number"
    )
  }
  const residualSecond = Math.floor(second % 60)
    .toString()
    .padStart(2, "0")
  let minute = Math.floor(second / 60)
  if (!minute) {
    return `0:${residualSecond}`
  }
  const hour = Math.floor(minute / 60)
  if (!hour) {
    return `${minute}:${residualSecond}`
  }
  minute %= 60
  return `${hour}:${minute.toString().padStart(2, "0")}:${residualSecond}`
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
      this.showValue(value)
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
      this.showValue(value)
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
      this.htmlElement.value = this.value.toFixed(1)
      video[this.mediaAPI] = this.value.toFixed(1)
      this.showValue(this.value.toFixed(1))
    })
  }

  showValue(value) {
    if (this.mediaAPI === "playbackRate") {
      this.htmlElement.nextElementSibling.textContent = `${value}x`
    }
  }
}

//* Program
const volumeSlider = new Slider({
  htmlElement: inputs[0],
  mediaAPI: "volume"
})
const playbackRateSlider = new Slider({
  htmlElement: inputs[1],
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

video.addEventListener(
  "loadedmetadata",
  () => {
    progress.setAttribute("max", video.duration)
    currentTime.textContent = formatVideoTime(video.currentTime)
    totalTime.textContent = formatVideoTime(video.duration)
  },
  { once: true }
)

video.addEventListener("timeupdate", () => {
  if (!video.getAttribute("max")) {
    progress.setAttribute("max", video.duration)
    totalTime.textContent = formatVideoTime(video.duration)
  }

  currentTime.textContent = formatVideoTime(video.currentTime)
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

inputs.forEach(input => {
  input.addEventListener('focusin', () => doesInputFocus = true)
  input.addEventListener('focusout', () => doesInputFocus = false)
})

window.addEventListener("keydown", (e) => {
  let lastArrow
  if (e.code === "ArrowRight" && !doesInputFocus) {
    video.currentTime += 10
    skipSignal.dataset.state = "visible"
    skipCircle.setAttribute("data-state", "forward")
    lastArrow = 2
    skipArrows.forEach((arrow, index) => {
      arrow.setAttribute("data-order", `${index + 1}`)
      arrow.addEventListener(
        "animationend",
        () => {
          arrow.removeAttribute("data-order")
          if (index === lastArrow) skipSignal.dataset.state = "hidden"
        },
        { once: true }
      )
    })
  }
  if (e.code === "ArrowLeft" && !doesInputFocus) {
    video.currentTime -= 10
    skipSignal.dataset.state = "visible"
    skipCircle.setAttribute("data-state", "backward")
    lastArrow = 0
    skipArrows.forEach((arrow, index) => {
      arrow.setAttribute("data-order", `${3 - index}`)
      arrow.addEventListener(
        "animationend",
        () => {
          arrow.removeAttribute("data-order")
          if (index === lastArrow) skipSignal.dataset.state = "hidden"
        },
        { once: true }
      )
    })
  }
  poster.dataset.state = video.currentTime !== 0 ? "hidden" : "visible"
})

//* FullScreen

const fullScreenEnabled = !!(
  document.fullscreenEnabled ||
  document.mozFullScreenEnabled ||
  document.msFullscreenEnabled ||
  document.webkitFullscreenEnabled
)

if (!fullScreenEnabled) fullscreenBtn.dataset.state = "hidden"

fullscreenBtn.addEventListener("click", handleFullscreen)

document.addEventListener("fullscreenchange", () => {
  fullscreenBtn.dataset.state = isFullScreen()
    ? "out-fullscreen"
    : "go-fullscreen"
})

document.addEventListener("webkitfullscreenchange", () => {
  fullscreenBtn.dataset.state = isFullScreen()
    ? "out-fullscreen"
    : "go-fullscreen"
})
