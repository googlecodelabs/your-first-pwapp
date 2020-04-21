/* eslint-env node */
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
"use strict";

require('dotenv').config()
const express = require("express");
const fetch = require("node-fetch");
const redirectToHTTPS = require("express-http-to-https").redirectToHTTPS;

// CODELAB: Change this to add a delay (ms) before the server responds.
const FORECAST_DELAY = 0;

// CODELAB: If running locally, set your Open Weather Map API key here
const API_KEY = process.env.OPEN_WEATHER_MAP_API_KEY;
console.log(API_KEY);
const BASE_URL = `https://api.openweathermap.org/data/2.5/onecall`;

// Fake forecast data used if we can't reach the Open Weather Map API
const fakeForecast = {
  fakeData: true,
  latitude: 0,
  longitude: 0,
  timezone: "America/New_York",
  current: {
    dt: 0,
    sunrise: 1587463629,
    sunset: 1587512484,
    temp: 43.4,
    humidity: 62,
    wind_speed: 3.74,
    wind_deg: 208,
    weather: [{
      description: "clear sky",
      icon: "01d"
    }]
  },
  daily: [{
      dt: 0,
      temp: {
        min: 52.91,
        max: 41.35,
      },
      weather: [{
        icon: "04n"
      }],
    },
    {
      dt: 86400,
      temp: {
        min: 48.01,
        max: 44.17,
      },
      weather: [{
        icon: "10d"
      }],
    },
    {
      dt: 172800,
      temp: {
        min: 50.31,
        max: 33.61,
      },
      weather: [{
        icon: "10d"
      }],
    },
    {
      dt: 259200,
      temp: {
        min: 46.44,
        max: 33.82,
      },
      weather: [{
        icon: "04n"
      }],
    },
    {
      dt: 345600,
      temp: {
        min: 60.5,
        max: 43.82,
      },
      weather: [{
        icon: "04n"
      }],
    },
    {
      dt: 432000,
      temp: {
        min: 61.79,
        max: 32.8,
      },
      weather: [{
        icon: "10d"
      }],
    },
    {
      dt: 518400,
      temp: {
        min: 48.28,
        max: 33.49,
      },
      weather: [{
        icon: "10d"
      }],
    },
    {
      dt: 604800,
      temp: {
        min: 48.58,
        max: 33.68,
      },
      weather: [{
        icon: "13d"
      }],
    },
  ]
};

/**
 * Generates a fake forecast in case the weather API is not available.
 *
 * @param {String} location GPS location to use.
 * @return {Object} forecast object.
 */
function generateFakeForecast(location) {
  location = location || "40.7720232,-73.9732319";
  const commaAt = location.indexOf(",");

  // Create a new copy of the forecast
  const result = Object.assign({}, fakeForecast);
  result.latitude = parseFloat(location.substr(0, commaAt));
  result.longitude = parseFloat(location.substr(commaAt + 1));
  return result;
}

/**
 * Gets the weather forecast from the Open Weather Map API for the given location.
 *
 * @param {Request} req request object from Express.
 * @param {Response} resp response object from Express.
 */
function getForecast(req, resp) {
  const location = req.params.location || "40.7720232,-73.9732319";
  const commaAt = location.indexOf(",");
  const latitude = parseFloat(location.substr(0, commaAt));
  const longitude = parseFloat(location.substr(commaAt + 1));
  const url = `${BASE_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=imperial`;
  console.log(url);
  fetch(url)
    .then(resp => {
      if (resp.status !== 200) {
        throw new Error(resp.statusText);
      }
      return resp.json();
    })
    .then(data => {
      setTimeout(() => {
        resp.json(data);
      }, FORECAST_DELAY);
    })
    .catch(err => {
      console.error("Open Weather Map API Error:", err.message);
      resp.json(generateFakeForecast(location));
    });
}

/**
 * Starts the Express server.
 *
 * @return {ExpressServer} instance of the Express server.
 */
function startServer() {
  const app = express();

  // Redirect HTTP to HTTPS,
  app.use(redirectToHTTPS([/localhost:(\d{4})/], [], 301));

  // Logging for each request
  app.use((req, resp, next) => {
    const now = new Date();
    const time = `${now.toLocaleDateString()} - ${now.toLocaleTimeString()}`;
    const path = `"${req.method} ${req.path}"`;
    const m = `${req.ip} - ${time} - ${path}`;
    // eslint-disable-next-line no-console
    console.log(m);
    next();
  });

  // Handle requests for the data
  app.get("/forecast/:location", getForecast);
  app.get("/forecast/", getForecast);
  app.get("/forecast", getForecast);

  // Handle requests for static files
  app.use(express.static("public"));

  // Start the server
  return app.listen("8000", () => {
    // eslint-disable-next-line no-console
    console.log("Local DevServer Started on port 8000...");
  });
}

startServer();
