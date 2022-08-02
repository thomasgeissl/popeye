# popeye

## Description

popeye does some very basic skeleton and hand tracking, and sends recognized landmarks via osc or mqtt.
it uses mediapipe internally.

popeye sends a seperate message for each landmark point.
[session]/popeye/pose/{pointId}
[session]/popeye/hands/{handIndex}/{pointId}

Please note that mqtt topics have no leading slash.

## Dev

- yarn install
- yarn dev #to start the frontend dev process
- yarn electron-dev #to start the electron dev process
- yarn electron-build-mac
- yarn electron-build-win
- yarn electron-build-linux
