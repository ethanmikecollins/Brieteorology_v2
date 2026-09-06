import { toAscii } from "./ascii.js";
import { apartmentTotal } from "./art.js";
import { updateTommy } from "./art.js";
import { apartmentTop } from "./art.js";
import { apartmentBot } from "./art.js";
import { renderAscii } from "./art.js";


const sunriseSunset = [6, 23]

function updateFrame(){
    const now = new Date();

    titleDisplay.textContent = toAscii(`BRIETEOROLOGY`);

    updateTime(now);
    updateBackground(now, sunriseSunset);
    updateApartment(now);
    //updateApartment(now, windspeed, weather);
    //updateTrees(now, windspeed);
    //updateTommy(now)
    //updateWeather(now, weather, windspeed);
    //updateSunMoon(now, phase);

    requestAnimationFrame(updateFrame);
}

requestAnimationFrame(updateFrame)


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

    const dateTime = [toAscii(`${weekdayStr} ${month}-${day}-${year}`), toAscii(`${hours}:${minutes} ${AMPM}`)];
    dateTimeDisplay.textContent = dateTime.join("\n")
}


function updateBackground(now, sunriseSunset){
    const hour = now.getHours();
    const secs = now.getSeconds();

    if (hour < sunriseSunset[0] || hour > sunriseSunset[1]){
        document.body.classList.add("night");
        document.body.classList.remove("day");
    }else{
        document.body.classList.add("day");
        document.body.classList.remove("night");
    }
}


function updateApartment(now){
    const apartmentDisplay = document.getElementById("apartmentDisplay");
    const TommyFrame = updateTommy();
    const apartmentFrame = `${apartmentTop}${TommyFrame}${apartmentBot}`
    apartmentDisplay.innerHTML = renderAscii(apartmentFrame);
}