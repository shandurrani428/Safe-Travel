import { StyleSheet, Text, TextInput, View, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import ShowError from '../../Components/ShowError';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { Button } from "@rneui/base";
import { Dropdown } from 'react-native-element-dropdown';
import ColorPicker from 'react-native-wheel-color-picker';
import firestore from '@react-native-firebase/firestore';


const AddVehicle = ({ route }) => {

  const navigation = useNavigation();

  const driverId = route.params;

  const [regisNo, setRegisNo] = useState();
  const [vehicleColor, setVehicleColor] = useState();
  const [vehicleType, setVehicleType] = useState();
  const [seatCapacity, setSeatCapacity] = useState();
  const [vehicleAc, setVehicleAc] = useState();
  const [isFocus, setIsFocus] = useState(false);


  const type = [{ label: 'Bolan Carry', value: 'Bolan Carry' }]

  const seats = [{ label: '10', value: 10 }]

  const ac = [
    { label: 'AC', value: 'AC' },
    { label: 'Non-AC', value: 'Non-AC' }
  ]

  const [data, setData] = useState([]);
  const [check, setCheck] = useState(false);

  useEffect(() => {

    const list = [];
  firestore().collection('Vehicle').where('driverId', '==', driverId).get().then((snapShot) => {
    snapShot.docs.forEach(doc => {
      list.push(doc.data());
    })
    setData([...list]);
  })
  }, [data]);

  console.log(data);
  console.log(driverId);

  const onPress = () => {

    if (!regisNo) {
      ShowError('Registration no required');
      return;
    }
    if (!vehicleColor) {
      ShowError('Vechile color required');
      return;
    }
    if (!vehicleType) {
      ShowError('Select vehicle type');
      return;
    }
    if (!seatCapacity) {
      ShowError('Select seats capacity');
      return;
    }
    if (!vehicleAc) {
      ShowError('Select AC or NON-AC');
      return;
    }
    else {
      navigation.navigate('Add Route', {
        driverId: driverId, regisNo: regisNo, vehicleColor: vehicleColor,
        vehicleType: vehicleType, seatCapacity: seatCapacity, vehicleAc: vehicleAc
      });
    }
  }



  if (data.length <= 0 || check == true) {
    return (
      <SafeAreaView>
        <View style={{ height: '100%', width: '100%', backgroundColor: 'white', padding: 10 }}>

          <ScrollView>

            <Image
              style={{ width: 80, height: 80, borderRadius: 80 / 2, marginLeft: '35%' }}
              source={require('../../../assets/car1.jpg')}
            />

            <Text style={{ color: 'black', textAlign: 'center', fontWeight: 'bold', fontSize: 30, fontStyle: 'italic' }}>
              Add Vehicle</Text>

            <TextInput
              style={{ color: 'black', height: 50, textAlign: 'center', borderColor: 'gray', borderWidth: 0.5, borderRadius: 8, fontSize: 16, fontWeight: 'bold', width: '90%', marginStart: 15, marginTop: 40, }}
              placeholder='Registration number' value={regisNo} onChangeText={(e) => { setRegisNo(e) }}
            />

            <Dropdown
              style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={type}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? 'Select Vehicle Type' : '...'}
              searchPlaceholder="Search..."
              value={vehicleType}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setVehicleType(item.value);
                setIsFocus(false);
              }}>
            </Dropdown>

            <Dropdown
              style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={seats}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? "Seat's Capacity" : "..."}
              searchPlaceholder="Search..."
              value={seatCapacity}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setSeatCapacity(item.value);
                setIsFocus(false);
              }}>
            </Dropdown>

            <Dropdown
              style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={ac}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? 'Select AC' : '...'}
              searchPlaceholder="Search..."
              value={vehicleAc}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setVehicleAc(item.value);
                setIsFocus(false);
              }}>
            </Dropdown>


            <Text style={{ color: 'black', fontSize: 16, textAlign: 'center', backgroundColor: '#C8C8C8', width: '90%', marginStart: 15, marginTop: 40, height: 30 }}>Vehicle Color</Text>
            <View>
              <ColorPicker
                thumbSize={30}
                sliderHidden={true}
                onColorChangeComplete={(e) => { setVehicleColor(e) }}
              />
            </View>


            <View style={{ width: '40%', marginLeft: '30%', marginTop: 30 }}>
              <Button
                onPress={onPress}
                title='Add Route'
                radius='md'
                type='solid'
                size='md'>
              </Button>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    )
  }
  else {
    return (
      <SafeAreaView style={{ backgroundColor: 'white' }}>
        <View style={{ height: '100%', width: '100%', backgroundColor: 'lightgrey', padding: 20 }}>
          <ScrollView>
            {
              data.map((val) => {
                return (
                  <View key={val.regisNo}>
                    <TouchableOpacity style={{ backgroundColor: 'white', height: 150, borderRadius: 30, }}
                    onPress={() => {navigation.navigate('Manage Vehicle', 
                    {regisNo: val.regisNo, vehicleType: val.vehicleType, vehicleColor: val.vehicleColor,
                     vehicleAc: val.vehicleAc, seatCapacity: val.seatCapacity})}}>
                      <Image source={require('../../../assets/car1.jpg')} style={{ width: 90, height: 90, borderRadius: 90 / 2, marginLeft: '35%', marginTop: 10 }} />
                      <Text style={{ textAlign: 'center', marginTop: 25, fontWeight: 'bold', fontSize: 16 }}>{val.vehicleType}</Text>
                    </TouchableOpacity>
                    <Text></Text>
                  </View>
                )
              })
            }
            <View style={{ width: '40%', marginLeft: '30%'}}>
              <Button
              type='solid'
              radius='md'
              title='Add New'
              color='primary'
              onPress={() => {
                setCheck(true)
                }}></Button>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    )
  }

}

export default AddVehicle;

const styles = StyleSheet.create({
  dropdown: {
    marginLeft: '5%',
    marginTop: '10%',
    height: 50,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});