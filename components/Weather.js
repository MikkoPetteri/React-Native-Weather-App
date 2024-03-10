import { StyleSheet, Text, View, Image, FlatList } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

export default function Weather({weatherData, forecast}) {
    var dataObj = null; // Current weather JSON object.
    var dataArray = []; // Forecast JSON object array.

    if(weatherData!==null){
        validData = JSON.parse(JSON.stringify(weatherData));
        if(validData===null){
            console.error('Invalid JSON!')
            return;
        }

        if(forecast){
            var tmpUri = null;
            var tmpDecs = null;
            var tmpDate = null;
            var minTempVals = new Array();
            var maxTempVals = new Array();
            var tmpDataObj = null;

            /* For 5days forecast the data has to parsed out from 3h steps. This occurred to be little hazard 
            because forecast has already current day forecast data depend on what time you send request to API.
            Solution was that temperature max and min values are parsed from the day data and snap shot to
            forecast info is taken from midday forecast. */
            for (var i=0;i<weatherData.cnt;i++) {
                //console.log(weatherData.list[i]);
                if(new Date(weatherData.list[i].dt*1000).getDate() == new Date().getDate()) continue;
                minTempVals.push(weatherData.list[i].main.temp_min);
                maxTempVals.push(weatherData.list[i].main.temp_max);

                // Midday forecast:
                if(new Date(weatherData.list[i].dt*1000).getHours()==14){
                    tmpUri = (`https://openweathermap.org/img/wn/${weatherData.list[i].weather[0].icon}@2x.png`);
                    tmpDecs = (weatherData.list[i].weather[0].description);
                    tmpDate = (new Date(weatherData.list[i].dt*1000).toDateString());
                }

                // Forecast object data are saved to array when day number changes to another or the last index has been reached.
                if((dataArray.length==4 && i+1==weatherData.cnt) ||
                 (weatherData.list[i+1]!=null && new Date(weatherData.list[i].dt*1000).getDate() != new Date(weatherData.list[i+1].dt*1000).getDate())){
                    var mintemp=Math.min(...minTempVals);
                    var maxtemp=Math.max(...maxTempVals);;
                    var tmpTemp = (mintemp+'°C / '+maxtemp+'°C')
                    tmpDataObj = { "date":tmpDate, "icon":tmpUri, "temp":tmpTemp, "decs":tmpDecs };
                    //console.log(tmpDataObj);
                    dataArray.push(tmpDataObj);
                    minTempVals=[];
                    maxTempVals=[];
                }
            }
        }
        else{
            // Simple parsing from current weather data to view.
            var tmpDate = (new Date(weatherData.dt*1000).toString());
            var tmpUri = (`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`);
            var tmpTemp = (weatherData.main.temp+'°C')
            var tmpDeg = (weatherData.wind.deg);
            var tmpwind = (weatherData.wind.speed+'m/s');
            var tmpInfo = ('Humidity: '+weatherData.main.humidity+' % / '+weatherData.main.pressure+' hPa');
            var tmpDecs = (weatherData.weather[0].description);
            dataObj = { "date":tmpDate, "icon":tmpUri, "temp":tmpTemp, "winddeg":tmpDeg, 
                        "windstr":tmpwind, "info":tmpInfo, "decs":tmpDecs };
        }
    }
    
    return (
		  <View>
        { (weatherData && !forecast) ? (
        <View>
            <View style={styles.weatherRow}>
                <Text style={styles.infoTxt}>{dataObj.date}</Text>
            </View>
            <View style={styles.weatherRow}>
                <Image source={{uri: dataObj.icon}} style={styles.bigIcon}/>
                <Text style={styles.infoTxt}>{dataObj.temp}</Text>
                <MaterialIcons name="arrow-upward" size={40} color="#ffffff" 
                    style={{transform: [{rotate: dataObj.winddeg+"deg"}]}} />
                <Text style={styles.infoTxt}>{dataObj.windstr}</Text>
            </View>
            <View style={styles.weatherRow}>
                <Text style={styles.infoTxt}>{dataObj.info}</Text>
            </View>
            <View style={styles.weatherRow}>
                <Text style={styles.infoTxt}>{dataObj.decs}</Text>
            </View>
        </View>
        ) :
        (weatherData && forecast) ? (
        <View>
        <FlatList
            data={dataArray}
            renderItem={({ item }) => (
                <View style={styles.forecastContainer}>
                <Text style={styles.forecastTxt}>{item.date}</Text>
                <View style={styles.forecastRow}>
                    <Image source={{uri: item.icon}} style={styles.smallIcon}/>
                    <Text style={styles.forecastTxt}>{item.temp}</Text>
                    <Text style={styles.forecastTxt}>{item.decs}</Text>
                </View>
                </View>
        )}/>
        </View>   
        ) : (
        <View>
            <Text style={styles.loadingText}>Loading Data...</Text>
        </View>
        )}
		  </View>
	);
}

var styles = StyleSheet.create({
  loadingText: {
    fontSize: 30,
    color: '#fff',
  },
  tempTxt: {
    fontSize: 40,
    color: '#fff',
    textAlign: 'center',
  },
  infoTxt: {
    fontSize: 23,
    color: '#fff',
    textAlign: 'center',
  },
  bigIcon: {
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
  weatherRow: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    flexDirection: 'row',
  },
  forecastRow: {
    alignItems: 'center',
    justifyContent: 'left',
    gap: 10,
    flexDirection: 'row',
  },
  forecastTxt: {
    fontSize: 15,
    color: '#fff',
    textAlign: 'left',
  },
  smallIcon: {
    width: 50,
    height: 50,
    alignSelf: 'center',
  },
  forecastContainer: {
    paddingTop: 10,
  }
});
