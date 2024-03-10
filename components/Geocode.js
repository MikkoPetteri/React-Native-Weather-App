import { API_KEY } from "../utils/WeatherAPIKey";
import { Alert } from "react-native";

// Solve geocode: Finding coordinates by wanted laction to fetch weather data later on.
export const getCoordinates = async (location, setGeoData) => {
    console.log('Getting Coordinates:', location);
	try {
		const apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${API_KEY}`;
		const response = await fetch(apiUrl);
		const data = await response.json();
        var dataJson = JSON.parse(JSON.stringify(data));
		if (dataJson === null || dataJson.length === 0) {
            throw new Error('Failed to fetch Coordinates data');
		}

        // Some location names have more than 1 coordinates, but I am interesting at this point only One. 
        // And its limited in upper API request.
        var lonValue = null;
        var latValue = null;
        for (var i=0;i<dataJson.length;i++) {
            lonValue = dataJson[i].lon;
            latValue = dataJson[i].lat;
        }
        geodata = {"lat":latValue, "lon":lonValue}; 
        setGeoData(geodata);
        return geodata;

	} catch (error) {
		console.error('Error fetching Geocode data:', error.message);
        Alert.alert('Error', 'Failed to fetch location coordinates. Please try again.');
	}
};