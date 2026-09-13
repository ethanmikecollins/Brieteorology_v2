import { toAscii } from "./ascii.js";
import { apartmentTotal } from "./art.js";
import { updateTommy } from "./art.js";
import { treeFrames } from "./art.js";
import { apartmentTop } from "./art.js";
import { apartmentBot } from "./art.js";
import { renderAscii } from "./art.js";
import { moonFrames } from "./art.js";
import { sun } from "./art.js";
import { renderTree } from "./art.js";
import { thermometer } from "./art.js";
import { cloudFrames } from "./art.js";


let weather;
let predictionMode = false;
let predictionNow = null;
let timeFrame = 0;
let nextDay = 0;
let initHour;
let hourIndex;

async function startApp() {
    await loadWeather();

    requestAnimationFrame(updateFrame);

    setInterval(loadWeather, 5 * 60 * 1000);
}

startApp();

async function loadWeather(){
    const response = await fetch("weather.json", {cache: "no-store"});
    weather = await response.json();

    initHour = new Date(weather.hourly.time[0]);
}

function updateFrame(){
    let now;
    if (predictionMode){
        now = predictionNow;
    }else{
        now = new Date();
    }

    hourIndex = Math.floor((now - initHour)/(1000*60*60))
    
    updateTime(now);
    updateBackground(now, weather);
    updateApartment(weather);
    //updateApartment(now, windspeed, weather);
    //updateTrees(now, windspeed);
    //updateTommy(now)
    //updateWeather(now, weather, windspeed);
    updateSunMoon(weather);

    requestAnimationFrame(updateFrame);
}

function startPredictionMode(){
    predictionMode = true;
    predictionNow = new Date();

    predictionNow.setMinutes(0);
    predictionNow.setSeconds(0);
    predictionNow.setMilliseconds(0);
}

function stopPredictionMode(){
    predictionMode = false;
    predictionNow = null;
    timeFrame = 0;
    nextDay = 0;
}

function advancePrediction(){
    predictionNow.setHours(predictionNow.getHours() + 1);
    if (predictionNow.getHours() == 0){
        nextDay = 1;
    }
}

function reversePrediction(){
    predictionNow.setHours(predictionNow.getHours() - 1);
    if (predictionNow.getHours() == 23){
        nextDay = 0;
    }
}


document.addEventListener("keydown", (event) => {

    if (event.key === "p"){
        if (predictionMode){
            stopPredictionMode();
        }else{
            startPredictionMode();
        }
    }

    if (predictionMode && event.key === "ArrowRight" && timeFrame < 24) {
        advancePrediction();
        timeFrame += 1;
    }

    if (predictionMode && event.key === "ArrowLeft" && timeFrame > 0) {
        reversePrediction();
        timeFrame -= 1;
    }
});


function updateTime(now){
    const dateTimeDisplay = document.getElementById("dateTimeDisplay");
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const weekday = now.getDay();

    let weekdayStr = "SUN"
    if (weekday == 1){
        weekdayStr = "MON"
    }else if (weekday == 2){
        weekdayStr = "TUE"
    }else if (weekday == 3){
        weekdayStr = "WED"
    }else if (weekday == 4){
        weekdayStr = "THU"
    }else if (weekday == 5){
        weekdayStr = "FRI"
    }else if (weekday == 6){
        weekdayStr = "SAT"
    }

    let monthStr = "JAN"
    if (month == 2){
        monthStr = "FEB"
    }else if (month == 3){
        monthStr = "MAR"
    }else if (month == 4){
        monthStr = "APR"
    }else if (month == 5){
        monthStr = "MAY"
    }else if (month == 6){
        monthStr = "JUN"
    }else if (month == 7){
        monthStr = "JUL"
    }else if (month == 8){
        monthStr = "AUG"
    }else if (month == 9){
        monthStr = "SEP"
    }else if (month == 10){
        monthStr = "OCT"
    }else if (month == 11){
        monthStr = "NOV"
    }else if (month == 12){
        monthStr = "DEC"
    }


    let hours = now.getHours();
    let AMPM = "AM"
    if (hours === 0) {
        hours = 12;
    } else if (hours === 12) {
        AMPM = "PM";
    } else if (hours > 12) {
        hours = hours - 12;
        AMPM = "PM";
    }

    const minutes = now.getMinutes().toString().padStart(2, '0');
    let dateTime;

    if (predictionMode){
        dateTime = [toAscii(`${weekdayStr} ${monthStr} ${day}`), toAscii(`${hours}:${minutes} ${AMPM} (F)`)];
    }else{
        dateTime = [toAscii(`${weekdayStr} ${monthStr} ${day}`), toAscii(`${hours}:${minutes} ${AMPM}`)];
    }
    dateTimeDisplay.textContent = dateTime.join("\n")
}

function updateBackground(now, weather){
    const sunrise = new Date(weather.daily.sunrise[0 + nextDay]);
    const sunset = new Date(weather.daily.sunset[0 + nextDay]);

    if (now < sunrise || now > sunset){
        document.body.classList.add("night");
        document.body.classList.remove("day");
    }else{
        document.body.classList.add("day");
        document.body.classList.remove("night");
    }
}

let treeFrameCounter = 0;
function updateApartment(weather){
    const apartmentDisplay = document.getElementById("apartmentDisplay");
    const treeDisplay = document.getElementById("treeDisplay")
    const TommyFrame = updateTommy();
    const apartmentFrame = `${apartmentTop}${TommyFrame}${apartmentBot}`
    apartmentDisplay.innerHTML = renderAscii(apartmentFrame);

    let treeIndices;
    if (weather.hourly.wind_speed_10m[hourIndex] <= 3){
        treeDisplay.innerHTML = renderTree(treeFrames[0]);
    }else{
        if (weather.hourly.wind_speed_10m[hourIndex] <= 10){
            treeIndices = [0, 1, 0, 2];
        }else if (weather.hourly.wind_speed_10m[hourIndex] <= 15){
            treeIndices = [0, 1, 3, 1, 0, 2, 4, 2];
        }else{
            treeIndices = [0, 1, 3, 5, 3, 1, 0, 2, 4, 6, 4, 2];
        }

        let frameProgress;
        if (treeIndices.length == 4){
            frameProgress = Math.floor(treeFrameCounter/200) % treeIndices.length;
        }else if (treeIndices.length == 8){
            frameProgress = Math.floor(treeFrameCounter/100) % treeIndices.length;
        }else{
            frameProgress = Math.floor(treeFrameCounter/30) % treeIndices.length;
        }

        treeDisplay.innerHTML = renderTree(treeFrames[treeIndices[frameProgress]]);
    }
    
    treeFrameCounter += 1;
}

let sunMoonC = 0;
function updateSunMoon(weather){
    const sunMoon = document.getElementById("sunMoon");
    let planet;
    if (document.body.classList.contains("day")) {
        planet = sun;
    }else{
        const phase = weather.daily.moon_phase[0 + nextDay]
        let moon;

        if (phase < 0.0625 || phase >= 0.9375) {
            moon = moonFrames[4];
        } else if (phase < 0.1875) {
            moon = moonFrames[5];
        } else if (phase < 0.3125) {
            moon = moonFrames[6];
        } else if (phase < 0.4375) {
            moon = moonFrames[7];
        } else if (phase < 0.5625) {
            moon = moonFrames[0];
        } else if (phase < 0.6875) {
            moon = moonFrames[1];
        } else if (phase < 0.8125) {
            moon = moonFrames[2];
        } else {
            moon = moonFrames[3];
        }

        planet = moon;
    }

    
    if (sunMoonC <= 500){
        sunMoon.innerHTML = planet;
    }else{
        const bobbing = [" ", planet]
        sunMoon.innerHTML = bobbing.join("\n");
        if (sunMoonC == 1000){
            sunMoonC = 0;
        }
    }
    sunMoonC += 1;

    const clouds = document.getElementById("clouds");
    const cloudCover = weather.hourly.cloud_cover[hourIndex];

    if (cloudCover <= 25){
        clouds.innerHTML = " ";
    }else if (cloudCover <= 50){
        clouds.innerHTML = cloudFrames[0];
    }else if (cloudCover <= 75){
        clouds.innerHTML = cloudFrames[1];
    }else{
        clouds.innerHTML = cloudFrames[2];
    }
}

function updateStats(now, weather){
    //const tempDisplay = document.getElementById("tempDisplay");
    //tempDisplay.innerHTML = toAscii()
}

tempIconDisplay.innerHTML = thermometer