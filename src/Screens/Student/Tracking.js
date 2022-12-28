import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import firestore from '@react-native-firebase/firestore';
import BookRide from './BookRide';
import { Button } from '@rneui/base';
import { useNavigation } from '@react-navigation/native';
import { GOOGLE_API_KEY } from "@env";



const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;



const Tracking = ({ route }) => {

    const navigation = useNavigation();

    const studentId = route.params;

    const [currentCords, setCurrentCords] = useState({});
    const [destCords, setDestCords] = useState({});
    const [driverId, setDriverId] = useState();


    /////////////Getting ride satus & Dest Cords & Driver Id from firestore
    const [data, setData] = useState([]);
    const [rideStatus, setRideStatus] = useState(false);
    useEffect(() => {

        const list = [];
        firestore().collection('Booking').doc(studentId).get().then((doc) => {
            list.push(doc.data());
            list.map((val) => {
                setRideStatus(val.rideStatus);
                setDriverId(val.driverId);
                setDestCords(val.destCords);
            });
                setData([...list]);
                getLocation();
        });
    }, [data])


    useEffect(() => {

        const interval = setInterval(() => {
            getLocation();
        }, 3000);
        return () => clearInterval(interval);
    }, [])

    //////// Live Location from firestore
    const getLocation = async () => {
        try {
            const list = [];
            await firestore().collection('Tracking').doc(driverId).get().then((doc) => {
                list.push(doc.data());
                list.map((val) => { setCurrentCords(val.currentCords) });
            });
            setData([...list]);
        }
        catch (e) {
            console.log(e);
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

      ////////////////////////////////////////

    if (rideStatus == true && Object.keys(currentCords).length > 0) {
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
                            title='Join Live'
                            radius='md'
                            type='solid'
                            size='md'
                            onPress={() => { navigation.navigate('Join Live', { type: "join", channel: driverId }) }}
                        >
                        </Button>
                    </View>
                </View>
            </SafeAreaView>
        )
    }

    else {
        return (
            <BookRide />
        )
    }
}

export default Tracking;

const styles = StyleSheet.create({})