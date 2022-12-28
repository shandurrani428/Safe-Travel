import { PermissionsAndroid, Platform, StyleSheet, Text, View, Dimensions, Image } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Geolocation from 'react-native-geolocation-service';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import { Button } from "@rneui/base";
import MapViewDirections from 'react-native-maps-directions';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { GOOGLE_API_KEY } from "@env";



const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;



const LiveTracking = ({ route }) => {

  const navigation = useNavigation();

  const driverId = route.params;

  const mapRef = useRef();

  const [check, setCheck] = useState(false);

  const [currentCords, setCurrentCords] = useState({});
  const [destCords, setDestCords] = useState({});


  useEffect(() => {
    firestore().collection('Tracking').doc(driverId).set({
      currentCords: {}
    })
    getCurrentLocation();
  }, []);


  useEffect(() => {

    const interval = setInterval(() => {
      getCurrentLocation();
    }, 3000);
    return () => clearInterval(interval);
  }, [])


  ///////Getting destination cords from firebase

  const fetcthDestCords = () => {

    let isMounted = true;

    const list = [];
    firestore().collection('Vehicle').where('driverId', '==', driverId).get().then((snapShot) => {
      snapShot.docs.forEach(doc => {
        list.push(doc.data());
        list.map((val) => {
          if(isMounted)
          {
            setDestCords({
              latitude: val.destCords.latitude,
              longitude: val.destCords.longitude
            })
          }
        })
      })
    })
    return () => { isMounted = false }
  }


  ///////////Getting Location Permission
  const locationPermission = () => new Promise(async (resolve, reject) => {
    if (Platform.OS === 'ios') {
      try {
        const permissionStatus = await Geolocation.requestAuthorization('whenInUse');
        if (permissionStatus === 'granted') {
          return resolve("granted");
        }
        reject('Permission not granted');
      } catch (error) {
        return reject(error);
      }
    }
    return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,).then((granted) => {
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        resolve("granted");
      }
      return reject('Location Permission denied');
    }).catch((error) => {
      console.log('Ask Location permission error: ', error);
      return reject(error);
    });
  });

  //////// getting current location function
  const getCurrentLocation = async () => {
    const permission = await locationPermission()
    if (permission) {
      Geolocation.getCurrentPosition(position => {
        setCurrentCords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        firestore().collection('Tracking').doc(driverId).update({
          currentCords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        });
      },
        error => {
          alert(error.message);
        },
        { enableHighAccuracy: false, timeout: 10000 },
      )
    }
  }


  /////// Distance and time calculate between current and destination locations
  const [state, setState] = useState({
    time: 0,
    distance: 0,
  })
  const { distance, time } = state
  const updateState = (data) => { setState((state) => ({ ...state, ...data })) };

  const fetchDistaneTime = (d, t) => {
    updateState({
      distance: d,
      time: t
    })
  }

  //////////////////////////////////////////////////////////////////////
  console.log('Live Location after 5 seconds');
  console.log(currentCords.latitude);
  console.log(currentCords.longitude);
  console.log(destCords.latitude);
  console.log(destCords.longitude);
  console.log('Distance left:', distance);
  console.log('Time Left:', time);


  if (check == true && Object.keys(currentCords).length > 0) {
    return (
      <SafeAreaView>
        <View style={{ height: '100%', width: '100%' }}>
          <Text style={{ color: 'black', textAlign: 'center', fontWeight: 'bold', padding: 8 }}>Distance left: {distance.toFixed(0)} km's</Text>
          <Text style={{ color: 'black', textAlign: 'center', fontWeight: 'bold', marginBottom: 5 }}>Time left: {time.toFixed(0)} min's</Text>
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude: currentCords.latitude,
              longitude: currentCords.longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA
            }}
            showsUserLocation={true}
            >
            <Marker.Animated
              coordinate={currentCords}
              title="Current Location"
              identifier="Current Location"
            >
              <Image
                source={require('../../../assets/car2.jpg')}
                style={{ width: 40, height: 40 }}
                resizeMode='contain'
              />
            </Marker.Animated>

            {Object.keys(destCords).length > 0 && (
              <Marker
                coordinate={destCords}
                image={require('../../../assets/greenMarker.png')}
                title="Destination"
                identifier="Destination"
              ></Marker>)}

            {Object.keys(destCords).length > 0 && (
              <MapViewDirections
                origin={currentCords}
                destination={destCords}
                apikey={GOOGLE_API_KEY}
                strokeWidth={3}
                strokeColor='black'
                optimizeWaypoints={true}
                onStart={(params) => {
                  console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                }}
                onReady={(result) => {
                  console.log(`Distance: ${result.distance} km.`)
                  console.log(`Duration: ${result.duration} min.`)
                  fetchDistaneTime(result.distance, result.duration)
                }}
              >
              </MapViewDirections>)}
          </MapView>
          <View style={{ width: '40%', marginLeft: '30%', marginTop: 10, marginBottom: 8 }}>
            <Button
              title='Go Live'
              radius='md'
              type='solid'
              size='md'
              onPress={() => { navigation.navigate('Go Live', { type: "create", channel: driverId }) }}
            >
            </Button>
          </View>
        </View>
      </SafeAreaView>
    )
  }
  else {
    fetcthDestCords();
    return (
      <SafeAreaView>
        <View style={{ height: '90%', width: '100%' }}>
          <MapView
            style={{ flex: 1 }}>
          </MapView>
        </View>
        <View style={{ height: '10%', width: '100%' }}>
          <View style={{ width: '40%', marginLeft: '30%', marginTop: 10 }}>
            <Button
              title='Start Ride'
              radius='md'
              type='solid'
              size='md'
              onPress={() => {
                setCheck(true)
              }}>
            </Button>
          </View>
        </View>
      </SafeAreaView>
    )
  }
}

export default LiveTracking;
const styles = StyleSheet.create({})