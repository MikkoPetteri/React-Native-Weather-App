import { API_KEY } from "../utils/WeatherAPIKey";
import { Alert } from "react-native";

// Fetching Current weather data from OpenWeather database, JSON-format
export const getCurrentWeather = async (lat, lon, setWeatherData) => {
    if(lat==null || lon==null) {
        Alert.alert('Error', 'Invalid or unknown location.');
        return;
    }
    console.log('Fetching Current weather:', lat, lon)
    try {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.cod && data.cod !== 200) {
            throw new Error(data.message || 'Failed to fetch weather data');
        }
        console.log(data);

        var dataJson = JSON.parse(JSON.stringify(data));
        setWeatherData(dataJson);
        return dataJson;
        
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        Alert.alert('Error', 'Failed to fetch forecast data. Please try again.');
    }
};

// Fetching 5 day forecast data from OpenWeather database, JSON-format
export const getForecast = async (lat, lon, setWeatherData) => {
    if(lat==null || lon==null) {
        Alert.alert('Error', 'Invalid or unknown location.');
        return;
    }
    console.log('Fetching 5 days forecast (with 3h steps):', lat, lon)
    try {
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.cod && data.cod !== '200') {
            throw new Error(data.message || 'Failed to fetch forecast data');
        }
        console.log(data);
        
        var dataJson = JSON.parse(JSON.stringify(data));
        setWeatherData(dataJson);
        return dataJson;

    } catch (error) {
        console.error('Error fetching forecast data:', error.message);
        Alert.alert('Error', 'Failed to fetch forecast data. Please try again.');
    }
};

