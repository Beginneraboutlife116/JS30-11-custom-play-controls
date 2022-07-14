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
    if (video.muted) {
      volumeBtn.dataset.state = "mute"
    } else if (video.volume === 0) {
      volumeBtn.dataset.state = "mute"
    } else {
      volumeBtn.dataset.state = "sound"
    }
  }
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
    this.htmlElement.addEventListener("mousedown", () => {
      this.#mouseDown = true
    })
    this.htmlElement.addEventListener("mousemove", (event) => {
      if (!this.#mouseDown) return
      const value = Number.parseFloat(event.target.value)
      video[this.mediaAPI] = value.toString()
    })
    this.htmlElement.addEventListener("mouseup", (event) => {
      const value = Number.parseFloat(event.target.value)
      video[this.mediaAPI] = value.toString()
      this.#mouseDown = false
    })
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
const supportsVideo = !!document.createElement("video").canPlayType

if (supportsVideo) {
  video.controls = false
  controls.dataset.state = "visible"
}

video.addEventListener("click", playOrPauseVideo)
playOrPauseBtn.addEventListener("click", playOrPauseVideo)
volumeBtn.addEventListener("click", () => {
  video.muted = !video.muted
  changeButtonState("volume")
})

const volumeSlider = new Slider({
  htmlElement: document.querySelector("input[id='volume']"),
  mediaAPI: "volume"
})
const playbackRateSlider = new Slider({
  htmlElement: document.querySelector("input[name='playbackRate']"),
  mediaAPI: "playbackRate"
})

volumeSlider.mouseEvent()
volumeSlider.changeEvent()
volumeSlider.wheelEvent()

video.addEventListener("volumechange", () => {
  changeButtonState("volume")
})
