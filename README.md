# Expo / React Native iOS File Upload Test for MP4 Files

Pre-reqs: mySQL, a public AWS S3 bucket at your disposal, yarn, expo-cli

Instructions:
1) In /backend/settings/environment_settings/development.js -> enter your local mySQL username & password into lines 8 and 9
  - Add / Ensure that a database with the name "testfileupload" exists in your mySQL instance. Sequelize will write a table to it.
2) In /backend/app/controllers/content/media.server.controller.js -> enter your AWS Access Key Id, Secret Access Key, Region and Bucket Name into lines 11, 12, 13 and 20, respectively.
3) Open two terminal windows and navigate one to /backend and one to /frontend
4) Run `yarn install` in both terminal windows
5) Run `yarn start` in both terminal windows
6) In /frontend/constants/HTTP -> enter your local IP address into line 3, keeping http and PORT 4000 the same. You should see it in the terminal window for frontend printed above the QR code that the Expo CLI produced. Usually in the form of 192.168.0.XXX.
7) Two mp4 files are included in this repo for you to test with.
8) Several console logs have been left in, both in the frontend and backend code for you to see the file moving from gallery to home to backend.
