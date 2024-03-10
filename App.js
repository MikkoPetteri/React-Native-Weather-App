import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, TextInput, Pressable } from 'react-native';
import React, { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

import { getCoordinates } from './components/Geocode';
import { getCurrentWeather, getForecast } from './components/Forecast';
import Weather from './components/Weather';

export default function App() {
  const [location, setLocation] = useState("");
  const [noneData, setNone] = useState(true);
  const [forecast, forecastView] = useState(false);
  const [geoData, setGeoData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  const currentWeather = () => {
    setNone(false);
    forecastView(false);
    setWeatherData(null);

    if(geoData===null){
      getCoordinates(location, setGeoData)
        .then((result)=>{
          if(result === undefined || result.lat==null || result.lon==null) setNone(true);
          else getCurrentWeather(result.lat, result.lon, setWeatherData);
        });
    }
    else{
      getCurrentWeather(geoData.lat, geoData.lon, setWeatherData)
        .then((result)=>{
          if(result === undefined) setNone(true);
        });
    }
  };

  const ForecastFor5Days = () => {
    setNone(false);
    forecastView(true);
    setWeatherData(null);
    
    if(geoData===null){
      getCoordinates(location, setGeoData)
        .then((result)=>{
          if(result === undefined || result.lat==null || result.lon==null) setNone(true);
          else getForecast(result.lat, result.lon, setWeatherData);
        });
    }
    else{
      getForecast(geoData.lat, geoData.lon, setWeatherData)
        .then((result)=>{
          if(result === undefined) setNone(true);
        });
    }
  };

  const HandleLocation = (text) => {
    setLocation(text);
    setGeoData(null);
  }

  return (
    <SafeAreaView style={styles.base}>
      <View style={styles.headContainer}>
        <Text style={styles.titleTxt}>Weather & Forecast by Location</Text>
        <TextInput style={styles.input}
          placeholder="Enter Location..."
          value={location}
          onChangeText={HandleLocation}/>
        <View style={styles.btnRow}>
          <Pressable 
            onPress={currentWeather}
            style={({ pressed }) => [styles.btn,{ backgroundColor: pressed ? '#c8c6c1' : '#6d6b69'},]}>
            <Text style={styles.btnLabel}>Current Weather</Text>
          </Pressable>
          <Pressable 
            onPress={ForecastFor5Days}
            style={({ pressed }) => [styles.btn,{ backgroundColor: pressed ? '#c8c6c1' : '#6d6b69'},]}>
            <Text style={styles.btnLabel}>5 Days Forecast</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.weatherContainer}>
        { noneData ? (
          <Text style={styles.helpTxt}>Enter wanted location to fetch the current weather data or the 5 days forecast.</Text>
          ) : (
          < Weather weatherData={weatherData} forecast={forecast} />
        )}
      </View>

      <Pressable style={styles.ibtn}>
          <MaterialIcons name="info" size={30} color="#fff" />
      </Pressable>
      
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: '#464748',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headContainer: {
    flexGrow: 1,
    paddingTop: 75,
    alignItems: 'center',
    alignContent: 'center,'
  },
  input: {
    height: 50,
    borderWidth: 2,
    borderRadius: 5,
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    fontSize: 15,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    borderWidth: 2,
  },
  ibtn: {
    alignItems: 'center',
    padding: 10,
  },
  btnLabel: {
    fontSize: 15,
    color: '#ffffff',
  },
  btnRow: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 25,
    flexDirection: 'row',
  },
  helpTxt: {
    color: '#fff',
    padding: 40,
    fontSize: 20,
    textAlign: 'center',
  },
  titleTxt: {
    color: '#fff',
    paddingBottom: 20,
    fontSize: 20,
  },
  weatherContainer: {
    flexGrow: 1,
    paddingTop: 5,
    width: '90%',
    height: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '10%'
  }
});
