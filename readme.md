# Three.js Megan

- Please keep your web browser console open to see the logs.

- I tried to describe through all my comnments my approach and shared some examples, documentations I was working with.

- At this time, I'm not done with the .rts to animation clip part still WIP. See in `animation.js` the `buildAnimationClip()` function. I think something is wrong with my `new QuaternionKeyframeTrack` and the duration + values given on initialising a new KeyFrameTrack.

- Even if I could not finish the last part as I wish. It was fun and interesting to go through this. I would be interested if possible to know how the "rts to AnimationClip" should has been done properly. Thank you

[demo](https://threejs-megan.netlify.app/)

## Setup

Download [Node.js](https://nodejs.org/en/download/).
Run this followed commands:

```bash
# Install dependencies
npm install

# Run the local server at localhost:8080
npm run dev

# Build for production in the dist/ directory
npm run build
```
