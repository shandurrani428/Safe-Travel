import { StyleSheet, Text, View, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { Button } from "@rneui/base";
import ShowError from "../../Components/ShowError";
import firestore from '@react-native-firebase/firestore';
import ShowSuccess from '../../Components/ShowSuccess';
import { useNavigation } from '@react-navigation/native';
import { GOOGLE_API_KEY } from "@env";


const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;



const AddRoute = ({ route }) => {

  const navigation = useNavigation();

  const { regisNo } = route.params;
  const { vehicleColor } = route.params;
  const { vehicleType } = route.params;
  const { seatCapacity } = route.params;
  const { vehicleAc } = route.params;
  const { driverId } = route.params;

  //// Setting Pickup and Destination Route
  const [check, setCheck] = useState(false);
  const [pickupCords, setPickupCords] = useState({});
  const [destCords, setDestCords] = useState({});

  ///////Adding Vehicle details and Route to database

  const addVehicle = () => {

    firestore().collection('Vehicle').doc().set({
      driverId: driverId,
      regisNo: regisNo,
      vehicleColor: vehicleColor,
      vehicleType: vehicleType,
      seatCapacity: seatCapacity,
      vehicleAc: vehicleAc,
      pickupCords: pickupCords,
      destCords: destCords,
      pickupLatitude: pickupCords.latitude,
      destLatitude: destCords.latitude,
    }).then(() => {
      ShowSuccess('Vehicle added successfully');
      navigation.navigate('Driver Dashboard');
    })
  }



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
          <Text style={{ color: 'black', textAlign: 'center', fontSize: 20, padding: 20 }}>Add Route!</Text>
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
  else {
    return (
      <SafeAreaView style={{ backgroundColor: 'white' }}>
        <View style={{ height: '90%', width: '100%' }}>
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
                longitude: pickupCords.longitude,
              }}
              title="Pickup"
              identifier='pickup'
            />
            <Marker
              coordinate={{
                latitude: destCords.latitude,
                longitude: destCords.longitude,
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
        <View style={{ height: '10%', width: '100%' }}>
          <View style={{ width: '40%', marginLeft: '30%', marginTop: 10 }}>
            <Button
              title='Add Vehicle'
              radius='md'
              type='solid'
              size='md'
              onPress={addVehicle}>
            </Button>
          </View>
        </View>
      </SafeAreaView>
    )
  }
}

export default AddRoute;

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
    borderRadius: 10
  },
  textInputContainer: {
    paddingHorizontal: 20,
    paddingBottom: 0,
  }
})