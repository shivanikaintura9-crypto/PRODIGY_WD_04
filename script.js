const apiKey = "YOUR_API_KEY"; // Replace with your OpenWeatherMap API key
const weatherInfo = document.getElementById("weatherInfo");
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");

// Fetch weather by city name
async function getWeatherByCity(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  fetchWeather(url);
}

// Fetch weather by location (lat, lon)
async function getWeatherByLocation(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  fetchWeather(url);
}

// Common fetch function
async function fetchWeather(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod === "404") {
      weatherInfo.innerHTML = `<p>❌ City not found. Please try again.</p>`;
      return;
    }

    const { name } = data;
    const { temp, humidity } = data.main;
    const { description, icon } = data.weather[0];
    const { speed } = data.wind;

    weatherInfo.innerHTML = `
      <h2>${name}</h2>
      <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather Icon">
      <p><strong>${description.toUpperCase()}</strong></p>
      <p>🌡️ Temperature: ${temp} °C</p>
      <p>💧 Humidity: ${humidity}%</p>
      <p>🌬️ Wind Speed: ${speed} m/s</p>
    `;
  } catch (error) {
    weatherInfo.innerHTML = `<p>⚠️ Unable to fetch weather data.</p>`;
  }
}

// Search button click event
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    getWeatherByCity(city);
    cityInput.value = "";
  }
});

// Detect user location automatically
window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        getWeatherByLocation(latitude, longitude);
      },
      () => {
        weatherInfo.innerHTML = `<p>⚠️ Location access denied. Please enter a city manually.</p>`;
      }
    );
  } else {
    weatherInfo.innerHTML = `<p>⚠️ Geolocation not supported by this browser.</p>`;
  }
});