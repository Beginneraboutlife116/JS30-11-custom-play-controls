# JS30 - 11 - custom video play controls

## Table of contents

- [JS30 - 11 - custom video play controls](#js30---11---custom-video-play-controls)
  - [Table of contents](#table-of-contents)
  - [Overview](#overview)
    - [The challenge](#the-challenge)
    - [Screenshot](#screenshot)
    - [Links](#links)
  - [My process](#my-process)
    - [Built with](#built-with)
    - [What I learned](#what-i-learned)
    - [Useful resources](#useful-resources)
  - [Author](#author)

## Overview

### The challenge

Users should be able to:

- see the controls by using mouse to hover or focusing on any button.
- click the video to play or pause the video.
- click the play or pause button to play or pause video.
- click the volume button could mute the video.
- change in volume slider could change the volume of the sound.
- use mouse wheel could change the volume of the sound.
- focus on volume slider to use keyboard to change the volume of the sound.
- see the current played time and the total time.
- click on setting button to see the adjustment of playback rate.
- change in playback rate slider to change the rate of playback
- use mouse wheel could change the rate of playback.
- drag in the progress bar to desire time stamp.
- press `ArrowRight` or `ArrowLeft` key to skip ahead video.
- click the full screen button to view in full screen mode.
- escape the full screen mode by `ESC` key

### Screenshot

![without controls](./src/screenshot/without-controls.png)
![with controls](./src/screenshot/with-controls.png)

### Links

- [My repo](https://github.com/Beginneraboutlife116/JS30-11-custom-play-controls)
- [Live Site URL](https://beginneraboutlife116.github.io/JS30-11-custom-play-controls/)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- Mobile-first workflow

### What I learned

I think the most thing that I have learned is how to deal with video, media API.
This is the purpose of this challenge. Like `volumechange`, `timeupdate`, `ended`.

And also, I have learned a unknown html tag, `<progress>`, it's quite useful in creating loading bar.
And in this scenario, it's easy to record the time by using progress' properties, `value`, `min`, `max`.

And the last thing I learned is how to use full screen API, all process are according to these articles: [Cross browser video player](https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/cross_browser_video_player), [Video player styling basics](https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/Video_player_styling_basics).
Knowing the API: `fullscreenEnabled`, `fullscreenElement`, `exitFullscreen`, `requestFullscreen`, `fullscreenchange`, `fullscreenerror` and so on.

### Useful resources

- [Cross browser video player](https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/cross_browser_video_player) - This helped me how ot build a custom player video controls for cross browser.
- [Video player styling basics](https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/Video_player_styling_basics) - This helped me how to style the progress bar and how to deal with some browser which doesn't support progress tag.
- [Create custom range input](https://www.smashingmagazine.com/2021/12/create-custom-range-input-consistent-browsers/?utm_source=convertkit&utm_medium=email&utm_campaign=Outlined+text%2C+centering+content%2C+Open+Props%2C+and+even+some+JS+content%21%20-%207624173) - This helped me to custom my input bar to mimic youtube player.

## Author

- Twitter - [@WeiKaiLin2](https://twitter.com/weikailin2)
