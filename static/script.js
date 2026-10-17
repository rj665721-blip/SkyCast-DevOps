const weatherForm = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");
const weatherResult = document.getElementById("weatherResult");
const errorMessage = document.getElementById("errorMessage");
const themeToggle = document.getElementById("themeToggle");
const searchHistory = document.getElementById("searchHistory");

const HISTORY_KEY = "skycast_recent_cities";
const THEME_KEY = "skycast_theme";

let recentCities = [];

try {
    recentCities = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];

    if (!Array.isArray(recentCities)) {
        recentCities = [];
    }
} catch {
    recentCities = [];
}

// Display weather information
function displayWeather(data) {

    document.getElementById("cityName").textContent =
        `${data.city}, ${data.country}`;

    document.getElementById("weatherCondition").textContent =
        data.condition;

    document.getElementById("lastUpdated").textContent =
        `Last Updated: ${data.updated}`;

    document.getElementById("temperature").textContent =
        Number(data.temperature).toFixed(1);

    document.getElementById("feelsLike").textContent =
        `${data.feels_like} °C`;

    document.getElementById("minTemp").textContent =
        `${data.temp_min} °C`;

    document.getElementById("maxTemp").textContent =
        `${data.temp_max} °C`;

    document.getElementById("humidity").textContent =
        `${data.humidity}%`;

    document.getElementById("windSpeed").textContent =
        `${data.wind_speed} m/s`;

    document.getElementById("pressure").textContent =
        `${data.pressure} hPa`;

    document.getElementById("sunrise").textContent =
        data.sunrise;

    document.getElementById("sunset").textContent =
        data.sunset;

    document.getElementById("weatherAdvice").textContent =
        data.advice;

    const icon = document.getElementById("weatherIcon");

    if (/^\d{2}[dn]$/.test(data.icon)) {
        icon.src =
            `https://openweathermap.org/img/wn/${data.icon}@2x.png`;
        icon.hidden = false;
    } else {
        icon.hidden = true;
    }

    icon.alt = data.condition || "Weather condition";

    weatherResult.hidden = false;
}

// Search weather using Flask API
async function searchWeather(city) {

    const cleanCity = city.trim();

    if (!cleanCity) {
        errorMessage.textContent = "Please enter a city name.";
        return;
    }

    errorMessage.textContent = "";
    weatherResult.hidden = true;

    try {
        const response = await fetch(
            `/weather?city=${encodeURIComponent(cleanCity)}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || "Unable to fetch weather."
            );
        }

        displayWeather(data);
        saveSearch(data.city);

    } catch (error) {
        errorMessage.textContent =
            error.message || "Something went wrong.";
    }
}

// Save recently searched cities
function saveSearch(city) {

    recentCities = recentCities.filter(
        item => item.toLowerCase() !== city.toLowerCase()
    );

    recentCities.unshift(city);

    recentCities = recentCities.slice(0, 5);

    localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(recentCities)
    );

    displayHistory();
}

// Display search history
function displayHistory() {

    searchHistory.innerHTML = "";

    recentCities.forEach(city => {

        const button = document.createElement("button");

        button.type = "button";
        button.textContent = city;

        button.addEventListener("click", () => {
            cityInput.value = city;
            searchWeather(city);
        });

        searchHistory.appendChild(button);
    });
}

// Search form event
weatherForm.addEventListener("submit", event => {

    event.preventDefault();

    searchWeather(cityInput.value);
});

// Dark mode
function updateThemeButton() {

    themeToggle.textContent =
        document.body.classList.contains("dark")
            ? "☀️ Light Mode"
            : "🌙 Dark Mode";
}

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    const theme = document.body.classList.contains("dark")
        ? "dark"
        : "light";

    localStorage.setItem(THEME_KEY, theme);

    updateThemeButton();
});

// Load saved theme
if (localStorage.getItem(THEME_KEY) === "dark") {
    document.body.classList.add("dark");
}

updateThemeButton();
displayHistory();