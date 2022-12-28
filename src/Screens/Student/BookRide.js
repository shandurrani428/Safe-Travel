import { StyleSheet, Text, View, Dimensions, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { Button } from "@rneui/base";
import ShowError from '../../Components/ShowError';
import { ScrollView } from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GOOGLE_API_KEY } from "@env";


const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const BookRide = () => {

  const navigation = useNavigation();

  const [studentId, setStudentId] = useState();

  useEffect(() => {
    getId();
  }, [])

  const getId = async () => {
    try {
      const value = await AsyncStorage.getItem('student');
      setStudentId(value);
    }
    catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {

  }, [])
  //// Setting Pickup and Destination Route
  const [check, setCheck] = useState(false);
  const [pickupCords, setPickupCords] = useState({});
  const [destCords, setDestCords] = useState({});
  const [pickupAddress, setPickupAddress] = useState();
  const [destAddress, setDestAddress] = useState();
  ///********/


  ////////Getting driver pickup and destination cords from Vehicle Collection

  const [driverData, setDriverData] = useState([]);
  const list = [];

  const fetchDrivers = () => {

    console.log(pickupCords.latitude);
    console.log(destCords.latitude);

    firestore().collection('Vehicle').where('pickupLatitude', '==', pickupCords.latitude).
      where('destLatitude', '==', destCords.latitude).get().then((snapShot) => {
        snapShot.docs.forEach(doc => {
          list.push(doc.data());
        });
        setDriverData([...list]);
        if (list.length == 0) {
          console.log("No driver's available on your route");
          ShowError("No driver's available on your route");
          return;
        }
      });
  }



  //// if pickup and destination routes are null 
  if (check == false) {
    return (
      <SafeAreaView style={{ backgroundColor: 'white' }}>

        <View style={{ height: '50%', width: '100%' }}>
          <MapView
            style={{ flex: 1 }}
          >
          </MapView>
        </View>
        <View style={{ height: '50%', width: '100%' }}>
          <Text style={{ textAlign: 'center', fontSize: 20, padding: 20 }}>Book a Ride!</Text>
          <GooglePlacesAutocomplete
            placeholder='Enter pickup location'
            styles={toInputBoxStyles}
            fetchDetails={true}
            minLength={2}
            onPress={(data, details) => {
              setPickupCords({
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
              })
              setPickupAddress(data.description)
            }}
            enablePoweredByContainer={false}
            nearbyPlacesAPI="GooglePlacesSearch"
            debounce={400}
            query={{
              key: GOOGLE_API_KEY,
              language: "en"
            }}
          />
          <GooglePlacesAutocomplete
            placeholder='Enter dropoff location'
            styles={toInputBoxStyles}
            fetchDetails={true}
            minLength={2}
            onPress={(data, details) => {
              setDestCords({
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
              })
              setDestAddress(data.description)
            }}
            enablePoweredByContainer={false}
            nearbyPlacesAPI="GooglePlacesSearch"
            debounce={400}
            query={{
              key: GOOGLE_API_KEY,
              language: "en"
            }}
          />
          <View style={{ width: '40%', marginLeft: '30%', marginTop: 30 }}>
            <Button
              title='Done'
              radius='md'
              type='solid'
              size='md'
              onPress={() => {
                if (pickupCords.latitude == null && pickupCords.longitude == null) {
                  ShowError('Pickup location required');
                  return;
                }
                if (destCords.latitude == null && destCords.longitude == null) {
                  ShowError('Destination location required');
                  return;
                }
                else {
                  fetchDrivers();
                  setCheck(true);
                }
              }
              }
            ></Button>
          </View>
        </View>
      </SafeAreaView>

    )
  }


  //// if pickup and destination routes are not null this can runder
  else {
    return (
      <SafeAreaView style={{ backgroundColor: 'white' }}>
        <View style={{ height: '50%', width: '100%' }}>
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude: pickupCords.latitude,
              longitude: pickupCords.longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }}
          >
            <Marker
              coordinate={{
                latitude: pickupCords.latitude,
                longitude: pickupCords.longitude
              }}
              title="Pickup"
              identifier='pickup'
            />
            <Marker
              coordinate={{
                latitude: destCords.latitude,
                longitude: destCords.longitude
              }}
              title="Dropoff"
              identifier='destination'
            />

            <MapViewDirections
              apikey={GOOGLE_API_KEY}
              strokeWidth={3}
              strokeColor='black'
              optimizeWaypoints={true}
              origin={pickupCords}
              destination={destCords}
            />
          </MapView>
        </View>
        <View style={{ height: '50%', width: '100%', backgroundColor: 'white' }}>
          <Text style={{ color: 'black', textAlign: 'center', fontSize: 20, padding: 10, fontWeight: 'bold' }}>Available Rides</Text>
          <ScrollView>
            {
              driverData.map((val) => {
                return (
                  <View key={val.regisNo}>
                    <TouchableOpacity style={{ height: 150, width: '95%', backgroundColor: 'lightgrey', borderRadius: 10, marginLeft: 10 }}>
                      <Image
                        source={{ uri: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,w_956,h_537/v1568134115/assets/6d/354919-18b0-45d0-a151-501ab4c4b114/original/XL.png" }}
                        style={{ width: 90, height: 90, borderRadius: 90 / 2, resizeMode: 'contain', marginLeft: 10, marginTop: 5 }}
                      />
                      <Text style={{ color: 'black', marginTop: -80, marginLeft: 150, fontWeight: 'bold' }}>
                        {val.vehicleType}
                      </Text>
                      <Text style={{ color: 'black', marginLeft: 150, paddingTop: 5 }}>
                        {val.regisNo}
                      </Text>
                      <Text style={{ color: 'black', marginLeft: 150, paddingTop: 5 }}>
                        {val.vehicleColor}
                      </Text>
                      <Text style={{ color: 'black', marginLeft: 250, marginTop: -43, }}>
                        AC: <Text style={{ color: 'black', fontWeight: 'bold' }}>{val.vehicleAc}</Text>
                      </Text>
                      <View style={{ width: '40%', height: '35%', marginLeft: '58%', marginTop: '13%' }}>
                        <Button
                          onPress={() => navigation.navigate('Book Card', {
                            pickupCords: val.pickupCords,
                            destCords: val.destCords,
                            pickupAddress: pickupAddress,
                            destAddress: destAddress,
                            vehicleType: val.vehicleType,
                            regisNo: val.regisNo,
                            vehicleColor: val.vehicleColor,
                            vehicleAc: val.vehicleAc,
                            seatCapacity: val.seatCapacity,
                            driverId: val.driverId,
                            studentId: studentId
                          })}
                          title='Book'
                          radius='lg'
                          size='md'
                        ></Button>
                      </View>
                    </TouchableOpacity>
                    <Text></Text>
                  </View>
                )
              })
            }
          </ScrollView>
        </View>
      </SafeAreaView>
    )
  }

}

export default BookRide;

const toInputBoxStyles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 10,
    flex: 0,
  },
  textInput: {
    backgroundColor: '#F0F0F0',
    borderRadius: 0,
    fontSize: 18,
    borderRadius: 10,
  },
  textInputContainer: {
    paddingHorizontal: 20,
    paddingBottom: 0,
  },
  lisView: {
    height: 40
  }
})