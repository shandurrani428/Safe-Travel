import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  Image,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ShowError from "../../Components/ShowError";
import ShowSuccess from "../../Components/ShowSuccess";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../config";
import firestore from "@react-native-firebase/firestore";
import { ScrollView } from "react-native-gesture-handler";
import { Button } from "@rneui/base";

const DriverRegisterScreen = () => {
  const navigation = useNavigation();

  const [indicator, setIndicator] = useState(false);

  const [userName, setUsername] = useState();
  const [email, setEmail] = useState();
  const [phoneNo, setPhoneNo] = useState();
  const [cnic, setCnic] = useState();
  const [license, setLicense] = useState();
  const [password, setPassword] = useState();
  const [cPassword, setCpassword] = useState();

  const Register = () => {
    if (!userName) {
      ShowError("Username required");
      return false;
    }
    if (!email) {
      ShowError("Email required");
      return false;
    }
    if (!phoneNo) {
      ShowError("Phone No required");
      return false;
    }
    if (!cnic) {
      ShowError("CNIC required");
      return false;
    }
    if (!license) {
      ShowError("License no required");
      return false;
    }
    if (!password) {
      ShowError("Password required");
      return false;
    }
    if (!cPassword) {
      ShowError("Confirm password required");
      return false;
    }
    if (password !== cPassword) {
      ShowError("Password not match");
      return false;
    }
    if (phoneNo.length != 11) {
      ShowError("Phone No must contain 11 digits");
      return false;
    }
    if (cnic.length != 13) {
      ShowError("CNIC must contain 13 digits");
      return false;
    }
    if (license.length != 7) {
      ShowError("License no must contain 7 digits");
      return false;
    } else {
      setIndicator(true);
      createUserWithEmailAndPassword(auth, email, password)
        .then((cred) => {
          firestore().collection("Drivers").doc(cred.user.uid).set({
            userName: userName,
            email: email.trim(),
            phoneNo: phoneNo,
            cnic: cnic,
            license: license,
            userType: "driver",
            status: false,
          });
          setIndicator(false);
          console.log("Register Successfully");
          ShowSuccess("Register Successfully");
          setUsername("");
          setEmail("");
          setPassword("");
          setCpassword("");
          navigation.navigate("Driver Login");
        })
        .catch((error) => {
          console.log(error);
          alert(error);
          setIndicator(false);
        });
    }
  };

  return (
    <SafeAreaView>
      <View style={{ height: "100%", width: "100%", backgroundColor: "white" }}>
        <ScrollView>
          <Image
            style={{
              width: 100,
              height: 100,
              borderRadius: 100 / 2,
              marginLeft: "35%",
              marginTop: "5%",
            }}
            source={require("../../../assets/driver.png")}
          />

          <Text
            style={{
              color: "#FF8C00",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 30,
              fontStyle: "italic",
              marginTop: "5%",
            }}
          >
            Driver Register
          </Text>

          <TextInput
            style={{
              color: "black",
              fontSize: 16,
              height: "6%",
              marginLeft: 35,
              marginTop: 30,
              textAlign: "center",
              padding: 10,
              borderWidth: 1,
              width: "80%",
              borderRadius: 30,
            }}
            placeholder="Enter Username"
            value={userName}
            onChangeText={(e) => setUsername(e)}
          />

          <TextInput
            style={{
              color: "black",
              fontSize: 16,
              height: "6%",
              marginLeft: 35,
              marginTop: 30,
              textAlign: "center",
              padding: 10,
              borderWidth: 1,
              width: "80%",
              borderRadius: 30,
            }}
            placeholder="Enter email"
            value={email}
            onChangeText={(e) => setEmail(e.trim())}
          />

          <TextInput
            style={{
              color: "black",
              fontSize: 16,
              height: "6%",
              marginLeft: 35,
              marginTop: 30,
              textAlign: "center",
              padding: 10,
              borderWidth: 1,
              width: "80%",
              borderRadius: 30,
            }}
            placeholder="Enter Phone no"
            value={phoneNo}
            onChangeText={(e) => setPhoneNo(e.trim())}
            keyboardType="numeric"
          />

          <TextInput
            style={{
              color: "black",
              fontSize: 16,
              height: "6%",
              marginLeft: 35,
              marginTop: 30,
              textAlign: "center",
              padding: 10,
              borderWidth: 1,
              width: "80%",
              borderRadius: 30,
            }}
            placeholder="Enter cnic without dashes"
            value={cnic}
            onChangeText={(e) => setCnic(e.trim())}
            keyboardType="numeric"
          />

          <TextInput
            style={{
              color: "black",
              fontSize: 16,
              height: "6%",
              marginLeft: 35,
              marginTop: 30,
              textAlign: "center",
              padding: 10,
              borderWidth: 1,
              width: "80%",
              borderRadius: 30,
            }}
            placeholder="Enter license no"
            value={license}
            onChangeText={(e) => setLicense(e.trim())}
          />

          <TextInput
            secureTextEntry={true}
            style={{
              color: "black",
              fontSize: 16,
              height: "6%",
              marginLeft: 35,
              marginTop: 30,
              textAlign: "center",
              padding: 10,
              borderWidth: 1,
              width: "80%",
              borderRadius: 30,
            }}
            placeholder="Enter password"
            value={password}
            onChangeText={(e) => setPassword(e.trim())}
          />

          <TextInput
            secureTextEntry={true}
            style={{
              color: "black",
              fontSize: 16,
              height: "6%",
              marginLeft: 35,
              marginTop: 30,
              textAlign: "center",
              padding: 10,
              borderWidth: 1,
              width: "80%",
              borderRadius: 30,
            }}
            placeholder="Enter confirm password"
            value={cPassword}
            onChangeText={(e) => setCpassword(e.trim())}
          />

          <View style={{ width: "40%", marginLeft: "30%", marginTop: 30 }}>
            <Button
              title="Register"
              onPress={Register}
              radius="md"
              type="solid"
              size="md"
            ></Button>
          </View>

          <ActivityIndicator
            style={{ padding: 15 }}
            size="large"
            animating={indicator}
          ></ActivityIndicator>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default DriverRegisterScreen;

const styles = StyleSheet.create({});
