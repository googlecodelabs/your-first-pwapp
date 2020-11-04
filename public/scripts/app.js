/*
 * @license
 * Your First PWA Codelab (https://g.co/codelabs/pwa)
 * Copyright 2019 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License
 */
'use strict';

const videoElem = document.getElementById("video");
const logElem = document.getElementById("log");
const startElem = document.getElementById("start");
const stopElem = document.getElementById("stop");

// Options for getDisplayMedia()

var displayMediaOptions = {
  video: {cursor: "always"},
  audio: false
};

var tracks = null;
var imageCapture = null;
var timeoutID = null;


async function startCapture() {
  logElem.innerHTML = "";

  navigator.mediaDevices.getDisplayMedia(displayMediaOptions)
  .then(mediaStream => {
    videoElem.srcObject = mediaStream;

    tracks = videoElem.srcObject.getTracks();
    imageCapture = new ImageCapture(tracks[0]);
    dumpOptionsInfo();

    timeoutID = window.setInterval(imageSnap, 1000);
  })
  .catch(error => console.error("Error: " + error));
}

function imageSnap() {
    console.log("imageSnap:" + Date.now());
}

function stopCapture(evt) {
  if (tracks == null) return;

  tracks.forEach(track => track.stop());
  videoElem.srcObject = null;

  if (timeoutID ==  null) return;
  window.clearTimeout(timeoutID);
  timeoutID=null;
} 
function dumpOptionsInfo() {
  if (tracks == null) return;

  console.info("time:" + Date.now());
  console.info("Track settings:");
  console.info(JSON.stringify(tracks[0].getSettings(), null, 2));
  console.info("Track constraints:");
  console.info(JSON.stringify(tracks[0].getConstraints(), null, 2));
}

/**
 * Initialize the app, gets the list of locations from local storage, then
 * renders the initial data.
 */
function init() {
  // Set event listeners for the start and stop buttons
  startElem.addEventListener("click", function(evt) {
    startCapture();
  }, false);

  stopElem.addEventListener("click", function(evt) {
    stopCapture();
  }, false); 

  console.log = msg => logElem.innerHTML += `${msg}<br>`;
  console.error = msg => logElem.innerHTML += `<span class="error">${msg}</span><br>`;
  console.warn = msg => logElem.innerHTML += `<span class="warn">${msg}<span><br>`;
  console.info = msg => logElem.innerHTML += `<span class="info">${msg}</span><br>`; 
}

init();
