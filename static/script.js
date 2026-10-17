
const $ = (id) => document.getElementById(id);

const HISTORY_KEY = 'skycast-history';
const THEME_KEY = 'skycast-theme';

// Load saved theme
if (localStorage.getItem(THEME_KEY) === 'dark') {
    document.body.classList.add('dark');
}

// Dark mode toggle
$('themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark');

    const isDark = document.body.classList.contains('dark');

    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
    $('themeToggle').textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
});

// Load recent searches safely
let recent = [];

try {
    recent = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    if (!Array.isArray(recent)) recent = [];
} catch {
    recent = [];
}

function showHistory() {
    const history = $('searchHistory');
    history.replaceChildren();

    recent.forEach((city) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = city;

        button.addEventListener('click', () => search(city));

        history.appendChild(button);
    });
}

// Search for weather
async function search(city) {
    const message = $('errorMessage');
    const result = $('weatherResult');

    message.textContent = 'Loading weather...';
    result.hidden = true;

    try {
        const response = await fetch(
            '/weather?city=' + encodeURIComponent(city)
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Unable to load weather.');
        }

        // Update weather details using your HTML IDs
        $('cityName').textContent =
            data.city + (data.country ? ', ' + data.country : '');

        $('temperature').textContent = data.temperature;
        $('weatherCondition').textContent = data.condition;
        $('lastUpdated').textContent = 'Updated: ' + data.updated;

        $('feelsLike').textContent = data.feels_like + ' °C';
        $('minTemp').textContent = data.temp_min + ' °C';
        $('maxTemp').textContent = data.temp_max + ' °C';
        $('humidity').textContent = data.humidity + '%';
        $('windSpeed').textContent = data.wind_speed + ' m/s';
        $('pressure').textContent = data.pressure + ' hPa';

        $('sunrise').textContent = data.sunrise;
        $('sunset').textContent = data.sunset;
        $('weatherAdvice').textContent = data.advice;

        $('weatherIcon').src =
            'https://openweathermap.org/img/wn/' + data.icon + '@2x.png';

        $('weatherIcon').alt = data.condition || 'Weather icon';

        // Show results
        result.hidden = false;
        message.textContent = '';

        // Save only the latest five unique cities
        recent = [
            data.city,
            ...recent.filter(
                item => item.toLowerCase() !== data.city.toLowerCase()
            )
        ].slice(0, 5);

        localStorage.setItem(HISTORY_KEY, JSON.stringify(recent));
        showHistory();

    } catch (error) {
        message.textContent = error.message;
    }
}

// Handle the search form
$('weatherForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const city = $('cityInput').value.trim();

    if (city) {
        search(city);
    }
});

// Restore saved theme button label
if (document.body.classList.contains('dark')) {
    $('themeToggle').textContent = '☀️ Light Mode';
}

// Display saved recent searches
showHistory();
