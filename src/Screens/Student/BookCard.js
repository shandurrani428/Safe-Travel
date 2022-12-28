import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { Button } from "@rneui/base";
import ShowSuccess from '../../Components/ShowSuccess';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import ShowError from '../../Components/ShowError';
import { GOOGLE_API_KEY } from "@env";



const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;



const BookCard = ({ route }) => {

    const navigation = useNavigation();

    const { pickupCords } = route.params;
    const { destCords } = route.params;
    const { pickupAddress } = route.params;
    const { destAddress } = route.params;
    const { vehicleType } = route.params;
    const { regisNo } = route.params;
    const { vehicleColor } = route.params;
    const { vehicleAc } = route.params;
    const { seatCapacity } = route.params;
    const { driverId } = route.params;
    const { studentId } = route.params;


    //////////// Booking Ride

    const [userName, setUserName] = useState();
    const [driverName, setDriverName] = useState();
    useEffect(() => {
        const studentList = [];
        firestore().collection('Students').doc(studentId).get().then(doc => {
            studentList.push(doc.data());
            studentList.map((val) => { setUserName(val.userName) });
        });

        const list = [];
        firestore().collection('Drivers').doc(driverId).get().then(doc => {
            list.push(doc.data());
            list.map((val) => { setDriverName(val.userName) });
        });
    }, [])

    const Book = () => {

        var check = [];
        firestore().collection('Booking').where('studentId', '==', studentId).get().then((snapShot) => {
            snapShot.docs.forEach(doc => {
                check.push(doc.id);
            })
            console.log(check);
            if (check.length <= 0) {
                firestore().collection('Booking').doc(studentId).set({
                    studentId: studentId,
                    driverId: driverId,
                    studentName: userName,
                    rideStatus: false,
                    pickupCords: pickupCords,
                    destCords: destCords,
                    pickupAddress: pickupAddress,
                    destAddress: destAddress
                }).then(() => {
                    firestore().collection('Vehicle').where('driverId', '==', driverId).get().then((snapShot) => {
                        snapShot.docs.forEach(doc => {
                            const id = doc.id;
                            firestore().collection('Vehicle').doc(id).update({
                                seatCapacity: seatCapacity - 1
                            })
                        })
                    })
                    ShowSuccess('Request sent');
                    navigation.navigate('Student Dashboard');
                }).catch((error) => {
                    console.log(error);
                })
            }
            else {
                ShowError('Booking already made!');
                navigation.navigate('Student Dashboard');
                return;
            }
        })
    }

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
            <View style={{ height: '50%', width: '100%' }}>
                <View style={{ height: '100%', width: '100%', padding: 5 }}>
                    <Image source={require('../../../assets/driver.png')} style={{ width: 50, height: 50, borderRadius: 50/2, resizeMode: 'contain', marginLeft: '45%'}}/>

                    <Text style={{ fontWeight: 'bold', fontSize: 18, color: 'black', marginTop: 10, marginLeft: '46%'}}>{driverName}</Text>
                  
                   <View style={{ backgroundColor: 'lightgrey', height: '40%'}}>
                    <Image
                        source={{ uri: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,w_956,h_537/v1568134115/assets/6d/354919-18b0-45d0-a151-501ab4c4b114/original/XL.png" }}
                        style={{ width: 100, height: 100, borderRadius: 100 / 2, resizeMode: 'contain', marginLeft: 10, marginTop: 5 }}
                    />
                    <Text style={{ marginTop: -80, marginLeft: 150, fontWeight: 'bold', fontSize: 16, color: 'black' }}>
                        {vehicleType}
                    </Text>
                    <Text style={{ color: 'black', marginLeft: 150, paddingTop: 10, fontSize: 14 }}>
                        {regisNo}
                    </Text>
                    <Text style={{ color: 'black', marginLeft: 150, paddingTop: 10, fontSize: 14 }}>
                        {vehicleColor}
                    </Text>
                    <Text style={{ color: 'black', marginLeft: 250, marginTop: -20, fontSize: 14 }}>
                        AC: <Text style={{ color: 'black', fontWeight: 'bold' }}>{vehicleAc}</Text>
                    </Text>
                    <Text style={{ color: 'black', marginLeft: 250, marginTop: -47, fontSize: 14 }}>
                        Seats Left: <Text style={{ color: 'black', fontWeight: 'bold' }}>{seatCapacity}</Text>
                    </Text>
                    </View>
                    <View style={{ width: '40%', height: '35%', marginLeft: '35%', marginTop: '2%' }}>
                        <Button
                            onPress={() => {
                                if (seatCapacity == 0) {
                                    ShowError('No seats left!');
                                    return;
                                }
                                else {
                                    Book()
                                }
                            }}
                            title='Book Ride'
                            radius='lg'
                            size='md'
                        ></Button>
                    </View>
                    <View style={{ width: '40%', height: '35%', marginLeft: '35%', marginTop: '-18%' }}>
                        <Button
                            onPress={() => { navigation.goBack() }}
                            title='Cancel'
                            radius='lg'
                            size='md'
                            color='error'
                        ></Button>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default BookCard;

const styles = StyleSheet.create({})