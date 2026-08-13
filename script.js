let tempChart;
console.log("WeatherNow Started");
// API KEY
const API_KEY = "YOUR_API_KEY";

// URLs
const CURRENT_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

// Buttons
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

// Search
searchBtn.addEventListener("click", () => {

    const city = cityInput.value.trim();

    if(city===""){
        alert("Enter city name");
        return;
    }
    getWeather(city);

});

// Enter Key
cityInput.addEventListener("keyup",(e)=>{

    if(e.key==="Enter"){
        getWeather(cityInput.value.trim());
    }

});

async function getWeather(city){

    try{

        const response = await fetch(
            `${CURRENT_URL}?q=${city}&appid=${API_KEY}&units=metric`
        );

        const data = await response.json();

        if(data.cod!=200){

            alert(data.message);
            return;

        }

        updateCurrentWeather(data);
        console.log(data.weather[0].main);

        getForecast(city);

    }

    catch(error){

        console.log(error);

        alert("Unable to fetch weather.");

    }

}

function updateCurrentWeather(data){

    // Left Card
    document.getElementById("cityName").innerHTML = data.name;

    document.getElementById("temperature").innerHTML =
        Math.round(data.main.temp) + "°";

    document.getElementById("weatherDescription").innerHTML =
        data.weather[0].description;

    document.getElementById("wFeelsLikeMini").innerHTML =
        Math.round(data.main.feels_like) + "°C";

    document.getElementById("wHumidityMini").innerHTML =
        data.main.humidity + "%";

    document.getElementById("wWindMini").innerHTML =
        data.wind.speed + " m/s";

    // Highlight Cards
    document.getElementById("wPressureHL").innerHTML =
        data.main.pressure + " hPa";

    document.getElementById("wVisibilityHL").innerHTML =
        (data.visibility / 1000).toFixed(1) + " km";

    document.getElementById("wCloudCoverHL").innerHTML =
        data.clouds.all + "%";

    document.getElementById("wSunrise").innerHTML =
        formatTime(data.sys.sunrise);

    document.getElementById("wSunset").innerHTML =
        formatTime(data.sys.sunset);

    document.getElementById("wUVHL").innerHTML = "N/A";

    changeBackground(data.weather[0].main);

}

function changeBackground(weather){

    const bg=document.getElementById("weatherBackground");
    const canvas=document.getElementById("rainCanvas");

    bg.className="";

    canvas.style.display="none";

    stopRain();

    switch(weather){

        case "Clear":
            bg.classList.add("clear");
            break;

        case "Clouds":
            bg.classList.add("clouds");
            document.getElementById("rainCanvas").style.display = "block";
            startRain();
            break;

        case "Rain":
        case "Drizzle":

            bg.classList.add("rain");

            canvas.style.display="block";

            startRain();

            break;

        case "Thunderstorm":

            bg.classList.add("storm");

            canvas.style.display="block";

            startRain();

            break;

        case "Snow":

            bg.classList.add("snow");

            break;

        default:

            bg.classList.add("clear");

    }

}
let rainAnimation;

function startRain(){

    const canvas=document.getElementById("rainCanvas");

    const ctx=canvas.getContext("2d");

    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;

    const drops=[];

    for(let i=0;i<250;i++){

        drops.push({

            x:Math.random()*canvas.width,

            y:Math.random()*canvas.height,

            length:10+Math.random()*20,

            speed:6+Math.random()*8

        });

    }

function animate(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.strokeStyle="rgba(255,255,255,.55)";

    ctx.lineWidth=1.2;

    for(const d of drops){

        ctx.beginPath();

        ctx.moveTo(d.x,d.y);

        ctx.lineTo(d.x,d.y+d.length);

        ctx.stroke();

        d.y+=d.speed;

        if(d.y>canvas.height){

            d.y=-20;

            d.x=Math.random()*canvas.width;

        }

    }

        rainAnimation=requestAnimationFrame(animate);

    }

    animate();

}

function stopRain(){

    cancelAnimationFrame(rainAnimation);

    const canvas=document.getElementById("rainCanvas");

    const ctx=canvas.getContext("2d");

    ctx.clearRect(0,0,canvas.width,canvas.height);

}
function createRain(){

    const rain = document.getElementById("rain");

    rain.innerHTML = "";

    for(let i = 0; i < 50; i++){

        const drop = document.createElement("div");

        drop.className = "drop";

        drop.style.left = Math.random()*100 + "%";
        drop.style.top = "-20px";
        drop.style.opacity = Math.random();

        rain.appendChild(drop);

    }

    console.log("Rain Drops:", rain.children.length);
    console.log(rain.children.length);

}
function formatTime(time){

    return new Date(time*1000).toLocaleTimeString([],{
        hour:"2-digit",
        minute:"2-digit"
    });

}

async function getForecast(city){

    const response = await fetch(
        `${FORECAST_URL}?q=${city}&appid=${API_KEY}&units=metric`
    );

    const data = await response.json();

    console.log("Forecast Loaded");
    console.log(data.list);

    showHourlyForecast(data.list);
    drawTemperatureChart(data.list);
    showDailyForecast(data.list);
}

function showHourlyForecast(list){
    
    const hourly = document.getElementById("hourlyForecast");

    hourly.innerHTML = "";

    for(let i = 0; i < 8; i++){

        const item = list[i];

        const time = new Date(item.dt * 1000).toLocaleTimeString([],{
            hour:"numeric"
        });

        const temp = Math.round(item.main.temp);

        const icon = item.weather[0].icon;

        hourly.innerHTML += `
            <div class="hour-card">

                <p>${time}</p>

                <img src="https://openweathermap.org/img/wn/${icon}@2x.png">

                <h3>${temp}°</h3>

            </div>
        `;

    }

}
function showDailyForecast(list){

    const dailyForecast = document.getElementById("dailyForecast");

    dailyForecast.innerHTML = "";

    const days = {};

    list.forEach(item => {

        const date = item.dt_txt.split(" ")[0];

        if(!days[date]){
            days[date] = item;
        }

    });

    Object.values(days).slice(0,5).forEach(day => {

        const dayName = new Date(day.dt * 1000).toLocaleDateString("en-US",{
            weekday:"short"
        });

        const icon = day.weather[0].icon;

        const temp = Math.round(day.main.temp);

        dailyForecast.innerHTML += `

        <div class="day-card">

            <div class="day-name">${dayName}</div>

            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather">

            <div class="day-temp">${temp}°</div>

        </div>

        `;

    });

}
function drawTemperatureChart(list){
    console.log("Drawing Chart");

    const labels = [];
    const temps = [];

    for(let i = 0; i < 8; i++){

        labels.push(
            new Date(list[i].dt * 1000).toLocaleTimeString([],{
                hour:"numeric"
            })
        );

        temps.push(Math.round(list[i].main.temp));

    }

    const ctx = document.getElementById("tempChart").getContext("2d");

    if(tempChart){
        tempChart.destroy();
    }

    tempChart = new Chart(ctx,{

        type:"line",

        data:{
            labels:labels,
            datasets:[{
                label:"Temperature (°C)",
                data:temps,
                borderColor:"#ffffff",
                backgroundColor:"rgba(255,255,255,0.2)",
                fill:true,
                tension:0.4,
                borderWidth:3,
                pointRadius:5
            }]
        },

        options:{
            responsive:true,
            plugins:{
                legend:{
                    labels:{
                        color:"white"
                    }
                }
            },
            scales:{
                x:{
                    ticks:{
                        color:"white"
                    }
                },
                y:{
                    ticks:{
                        color:"white"
                    }
                }
            }

        }

    });

}
function changeBackground(weather){

    const bg = document.getElementById("weatherBackground");

    bg.className = "";

    switch(weather){

        case "Clear":
            bg.classList.add("clear");
            break;

        case "Clouds":
            bg.classList.add("clouds");
            break;

        case "Rain":
        case "Drizzle":
            bg.classList.add("rain");
            break;

        case "Thunderstorm":
            bg.classList.add("storm");
            break;

        case "Snow":
            bg.classList.add("snow");
            break;

        case "Mist":
        case "Fog":
        case "Haze":
            bg.classList.add("mist");
            break;

        default:
            bg.classList.add("clear");

    }

}