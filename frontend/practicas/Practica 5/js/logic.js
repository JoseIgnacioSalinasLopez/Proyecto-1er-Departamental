const API_KEY = '470043adc2730159427f11bc4e943fc7';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const GEO_API_URL = 'https://api.openweathermap.org/geo/1.0/direct';

/* ========================================
   ELEMENTOS DEL DOM
   ======================================== */

// Elementos principales de la interfaz
const loading = document.getElementById('loading');
const weatherInfo = document.getElementById('weatherInfo');
const errorMessage = document.getElementById('errorMessage');
const citySearch = document.getElementById('citySearch');
const searchBtn = document.getElementById('searchBtn');
const geoBtn = document.getElementById('geoBtn');

// Elementos de información del clima
const weatherIcon = document.getElementById('weatherIcon');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const locationElement = document.getElementById('location');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const pressure = document.getElementById('pressure');

// Contenedores de efectos visuales
const rainContainer = document.getElementById('rainContainer');
const snowContainer = document.getElementById('snowContainer');

/* ========================================
   FUNCIONES DE INTERFAZ DE USUARIO
   ======================================== */

/**
 * Función para mostrar el spinner de carga
 */
function showLoading() {
    loading.style.display = 'flex';
    weatherInfo.style.display = 'none';
    errorMessage.style.display = 'none';
}

/**
 * Función para mostrar la información del clima
 */
function showWeatherInfo() {
    loading.style.display = 'none';
    weatherInfo.style.display = 'block';
    errorMessage.style.display = 'none';
}

/**
 * Función para mostrar mensajes de error
 * @param {string} message - Mensaje de error a mostrar
 */
function showError(message) {
    loading.style.display = 'none';
    weatherInfo.style.display = 'none';
    errorMessage.style.display = 'block';
    errorMessage.textContent = message;
}

/* ========================================
   FUNCIONES DE ICONOS Y EFECTOS VISUALES
   ======================================== */

/**
 * Función para obtener el icono correspondiente al clima
 * @param {string} weatherMain - Tipo principal de clima
 * @param {number} weatherId - ID específico del clima
 * @returns {string} - Clase CSS del icono
 */
function getWeatherIcon(weatherMain, weatherId) {
    const iconMap = {
        'Clear': 'fas fa-sun',
        'Clouds': 'fas fa-cloud',
        'Rain': 'fas fa-cloud-rain',
        'Drizzle': 'fas fa-cloud-rain',
        'Thunderstorm': 'fas fa-bolt',
        'Snow': 'fas fa-snowflake',
        'Mist': 'fas fa-smog',
        'Smoke': 'fas fa-smog',
        'Haze': 'fas fa-smog',
        'Dust': 'fas fa-smog',
        'Fog': 'fas fa-smog',
        'Sand': 'fas fa-smog',
        'Ash': 'fas fa-smog',
        'Squall': 'fas fa-wind',
        'Tornado': 'fas fa-tornado'
    };
    
    return iconMap[weatherMain] || 'fas fa-question';
}

/**
 * Función para cambiar el fondo de la página según el clima
 * @param {string} weatherMain - Tipo principal de clima
 * @param {number} weatherId - ID específico del clima
 */
function changeBackgroundByWeather(weatherMain, weatherId) {
    const body = document.body;
    
    // Remover todas las clases de clima anteriores
    body.className = '';
    
    // Limpiar efectos de animación anteriores
    rainContainer.innerHTML = '';
    snowContainer.innerHTML = '';
    
    // Aplicar clase y efectos según el tipo de clima
    switch(weatherMain.toLowerCase()) {
        case 'clear':
            body.classList.add('sunny');
            break;
        case 'rain':
        case 'drizzle':
        case 'thunderstorm':
            body.classList.add('rainy');
            createRainEffect(); // Crear efecto de lluvia
            break;
        case 'clouds':
            body.classList.add('cloudy');
            break;
        case 'snow':
            body.classList.add('snowy');
            createSnowEffect(); // Crear efecto de nieve
            break;
        default:
            body.classList.add('cloudy');
    }
}

/**
 * Función para crear el efecto visual de lluvia
 */
function createRainEffect() {
    const raindrops = 50; // Número de gotas de lluvia
    
    for (let i = 0; i < raindrops; i++) {
        const raindrop = document.createElement('div');
        raindrop.classList.add('raindrop');
        
        // Posición aleatoria horizontal
        raindrop.style.left = Math.random() * 100 + '%';
        
        // Duración de animación aleatoria para naturalidad
        raindrop.style.animationDuration = (Math.random() * 0.5 + 0.5) + 's';
        
        // Retraso aleatorio para escalonar las gotas
        raindrop.style.animationDelay = Math.random() * 2 + 's';
        
        rainContainer.appendChild(raindrop);
    }
}

/**
 * Función para crear el efecto visual de nieve
 */
function createSnowEffect() {
    const snowflakes = 30; // Número de copos de nieve
    const snowSymbols = ['❄', '❅', '❆']; // Diferentes símbolos de nieve
    
    for (let i = 0; i < snowflakes; i++) {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        
        // Símbolo aleatorio de nieve
        snowflake.textContent = snowSymbols[Math.floor(Math.random() * snowSymbols.length)];
        
        // Posición horizontal aleatoria
        snowflake.style.left = Math.random() * 100 + '%';
        
        // Duración de caída aleatoria
        snowflake.style.animationDuration = (Math.random() * 3 + 2) + 's';
        
        // Retraso aleatorio
        snowflake.style.animationDelay = Math.random() * 2 + 's';
        
        // Tamaño aleatorio
        snowflake.style.fontSize = (Math.random() * 10 + 10) + 'px';
        
        snowContainer.appendChild(snowflake);
    }
}

/* ========================================
   FUNCIONES DE API
   ======================================== */

/**
 * Función para obtener datos del clima usando coordenadas geográficas
 * @param {number} lat - Latitud
 * @param {number} lon - Longitud
 */
async function getWeatherByCoords(lat, lon) {
    try {
        showLoading();
        
        // Realizar petición a la API de OpenWeatherMap
        const response = await fetch(
            `${WEATHER_API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`
        );
        
        // Verificar si la respuesta fue exitosa
        if (!response.ok) {
            throw new Error('Error al obtener datos del clima');
        }
        
        // Convertir respuesta a JSON
        const data = await response.json();
        
        // Mostrar datos en la interfaz
        displayWeatherData(data);
        
    } catch (error) {
        console.error('Error:', error);
        showError('Error al obtener datos del clima. Verifica tu conexión.');
    }
}

/**
 * Función para obtener datos del clima por nombre de ciudad
 * @param {string} cityName - Nombre de la ciudad a buscar
 */
async function getWeatherByCity(cityName) {
    try {
        showLoading();
        
        // Paso 1: Obtener coordenadas de la ciudad usando geocoding
        const geoResponse = await fetch(
            `${GEO_API_URL}?q=${encodeURIComponent(cityName)}&limit=1&appid=${API_KEY}`
        );
        
        if (!geoResponse.ok) {
            throw new Error('Error al buscar la ciudad');
        }
        
        const geoData = await geoResponse.json();
        
        // Verificar si se encontró la ciudad
        if (geoData.length === 0) {
            throw new Error('Ciudad no encontrada');
        }
        
        // Extraer coordenadas
        const { lat, lon } = geoData[0];
        
        // Paso 2: Obtener datos del clima usando las coordenadas
        const weatherResponse = await fetch(
            `${WEATHER_API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`
        );
        
        if (!weatherResponse.ok) {
            throw new Error('Error al obtener datos del clima');
        }
        
        const weatherData = await weatherResponse.json();
        
        // Mostrar datos en la interfaz
        displayWeatherData(weatherData);
        
    } catch (error) {
        console.error('Error:', error);
        
        // Manejo específico de diferentes tipos de error
        if (error.message === 'Ciudad no encontrada') {
            showError('Ciudad no encontrada. Intenta con otro nombre.');
        } else {
            showError('Error al buscar la ciudad. Verifica tu conexión.');
        }
    }
}

/* ========================================
   FUNCIÓN PARA MOSTRAR DATOS DEL CLIMA
   ======================================== */

/**
 * Función para mostrar los datos del clima en la interfaz
 * @param {Object} data - Datos del clima obtenidos de la API
 */
function displayWeatherData(data) {
    // Extraer y procesar datos importantes
    const temp = Math.round(data.main.temp);
    const feelsLikeTemp = Math.round(data.main.feels_like);
    const weatherMain = data.weather[0].main;
    const weatherDesc = data.weather[0].description;
    const cityName = data.name;
    const country = data.sys.country;
    const humidityValue = data.main.humidity;
    const windSpeedValue = Math.round(data.wind.speed * 3.6); // Convertir m/s a km/h
    const pressureValue = data.main.pressure;
    const weatherId = data.weather[0].id;

    // Actualizar elementos del DOM con los datos obtenidos
    weatherIcon.className = getWeatherIcon(weatherMain, weatherId);
    temperature.textContent = `${temp}°C`;
    description.textContent = weatherDesc;
    locationElement.textContent = `${cityName}, ${country}`; // Cambiado locationElement
    feelsLike.textContent = `${feelsLikeTemp}°C`;
    humidity.textContent = `${humidityValue}%`;
    windSpeed.textContent = `${windSpeedValue} km/h`;
    pressure.textContent = `${pressureValue} hPa`;

    // Cambiar fondo y efectos según el clima
    changeBackgroundByWeather(weatherMain, weatherId);
    
    // Mostrar la información del clima
    showWeatherInfo();
}

/* ========================================
   FUNCIÓN DE GEOLOCALIZACIÓN
   ======================================== */

/**
 * Función para obtener la ubicación actual del usuario
 */
function getCurrentLocation() {
    // Verificar si el navegador soporta geolocalización
    if (!navigator.geolocation) {
        showError('La geolocalización no está soportada en tu navegador.');
        return;
    }

    showLoading();

    // Solicitar ubicación actual
    navigator.geolocation.getCurrentPosition(
        // Función de éxito - se ejecuta si se obtiene la ubicación
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            getWeatherByCoords(lat, lon);
        },
        // Función de error - se ejecuta si hay problemas
        (error) => {
            console.error('Error de geolocalización:', error);
            let message = '';
            
            // Manejar diferentes tipos de error de geolocalización
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    message = 'Permiso de ubicación denegado. Puedes buscar por ciudad.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    message = 'Información de ubicación no disponible.';
                    break;
                case error.TIMEOUT:
                    message = 'Tiempo de espera agotado para obtener ubicación.';
                    break;
                default:
                    message = 'Error desconocido al obtener ubicación.';
            }
            
            showError(message);
        },
        // Opciones de geolocalización
        {
            enableHighAccuracy: true, // Solicitar alta precisión
            timeout: 10000, // Timeout de 10 segundos
            maximumAge: 300000 // Usar ubicación cacheada por máximo 5 minutos
        }
    );
}

/* ========================================
   EVENT LISTENERS Y EVENTOS
   ======================================== */

/**
 * Event listener para el botón de geolocalización
 */
geoBtn.addEventListener('click', getCurrentLocation);

/**
 * Event listener para el botón de búsqueda
 */
searchBtn.addEventListener('click', () => {
    const cityName = citySearch.value.trim();
    
    if (cityName) {
        getWeatherByCity(cityName);
    } else {
        showError('Por favor, ingresa el nombre de una ciudad.');
    }
});

/**
 * Event listener para presionar Enter en el campo de búsqueda
 */
citySearch.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

/* ========================================
   INICIALIZACIÓN DE LA APLICACIÓN
   ======================================== */

/**
 * Event listener que se ejecuta cuando se carga completamente el DOM
 */
document.addEventListener('DOMContentLoaded', () => {
    // Mostrar mensaje de bienvenida inicial
    showError('¡Bienvenido! Usa tu ubicación o busca una ciudad para ver el clima.');
});
