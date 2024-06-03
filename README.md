# popeye

## Description

popeye does some very basic skeleton and hand tracking, and sends recognized landmarks via osc or mqtt.
it uses mediapipe internally.

popeye sends a separate message for each landmark point.
[session]/popeye/pose/{pointId}
[session]/popeye/hands/{handIndex}/{pointId}

Please note that mqtt topics have no leading slash.

## Installation
## Mac OS
download the packaged app from the [gh releases](https://github.com/thomasgeissl/popeye/releases/) pages or install it via brew.

```
brew tap thomasgeissl/tools
brew install --cask popeye
```
## Windows
download the packaged app from the [gh releases](https://github.com/thomasgeissl/popeye/releases/) pages.


## Development

- npm install
- npm run tauri dev
- npm run tauri build

## Online version

There is an [online version](https://thomasgeissl.github.io/popeye/) available. It is hosted via github pages, hence is is no OSC output, only mqtt for the moment.
