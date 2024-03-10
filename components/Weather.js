import { StyleSheet, Text, View, Image, FlatList } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

export default function Weather({weatherData, forecast}) {
    var dataObj = null;
    var dataArray = [];

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

            for (var i=0;i<weatherData.cnt;i++) {
                //console.log(weatherData.list[i]);
                minTempVals.push(weatherData.list[i].main.temp_min);
                maxTempVals.push(weatherData.list[i].main.temp_max);

                if(new Date(weatherData.list[i].dt*1000).getHours()==14){
                    tmpUri = (`https://openweathermap.org/img/wn/${weatherData.list[i].weather[0].icon}@2x.png`);
                    tmpDecs = (weatherData.list[i].weather[0].description);
                    tmpDate = (new Date(weatherData.list[i].dt*1000).toDateString());
                }

                if(weatherData.list[i+1]!=null && new Date(weatherData.list[i].dt*1000).getDate() != new Date(weatherData.list[i+1].dt*1000).getDate()){
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
            var tmpDate = (new Date(validData.dt*1000).toString());
            var tmpUri = (`https://openweathermap.org/img/wn/${validData.weather[0].icon}@2x.png`);
            var tmpTemp = (validData.main.temp+'°C')
            var tmpDeg = (validData.wind.deg);
            var tmpwind = (validData.wind.speed+'m/s');
            var tmpInfo = ('Humidity: '+validData.main.humidity+' % / '+validData.main.pressure+' hPa');
            var tmpDecs = (validData.weather[0].description);

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
