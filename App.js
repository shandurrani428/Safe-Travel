/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import FlashMessage from "react-native-flash-message";
import HomeScreen from "./src/Screens/Home/HomeScreen";
import DriverLoginScreen from "./src/Screens/Driver/DriverLoginScreen";
import StudentLoginScreen from "./src/Screens/Student/StudentLoginScreen";
import StudentRegisterScreen from "./src/Screens/Student/StudentRegisterScreen";
import DriverRegisterScreen from "./src/Screens/Driver/DriverRegisterScreen";
import DriverDashboardScreen from "./src/Screens/Driver/DriverDashboardScreen";
import { KeyboardAvoidingView } from "react-native";
import AddVehicle from "./src/Screens/Driver/AddVehicle";
import LiveTracking from "./src/Screens/Driver/LiveTracking";
import AddRoute from "./src/Screens/Driver/AddRoute";
import AdminLoginScreen from "./src/Screens/Admin/AdminLoginScreen";
import RideRequest from "./src/Screens/Driver/RideRequest";
import RidesList from "./src/Screens/Driver/RidesList";
import BookCard from "./src/Screens/Student/BookCard";
import StudentDashboardScreen from "./src/Screens/Student/StudentDashboardScreen";
import BookRide from "./src/Screens/Student/BookRide";
import Tracking from "./src/Screens/Student/Tracking";
import AdminDashboardScreen from "./src/Screens/Admin/AdminDashboardScreen";
import DriversManage from "./src/Screens/Admin/DriversManage";
import StudentsManage from "./src/Screens/Admin/StudentsManage";
import DriversRequests from "./src/Screens/Admin/DriversRequests";
import StudentsRequests from "./src/Screens/Admin/StudentsRequests";
import GoLive from "./src/Screens/Driver/GoLive";
import JoinLive from "./src/Screens/Student/JoinLive";
import DriverManageCard from "./src/Screens/Admin/DriverManageCard";
import StudentManageCard from "./src/Screens/Admin/StudentManageCard";
import DriverRequestCard from "./src/Screens/Admin/DriverRequestCard";
import CnicVerify from "./src/Screens/Admin/CnicVerify";
import ManageVehicle from "./src/Screens/Driver/ManageVehicle";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="Admin Login"
              component={AdminLoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Admin Dashboard"
              component={AdminDashboardScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Drivers Manage"
              component={DriversManage}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Students Manage"
              component={StudentsManage}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Drivers Requests"
              component={DriversRequests}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Students Requests"
              component={StudentsRequests}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Driver Manage Card"
              component={DriverManageCard}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Student Manage Card"
              component={StudentManageCard}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Driver Request Card"
              component={DriverRequestCard}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Cnic Verify"
              component={CnicVerify}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="Driver Login"
              component={DriverLoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Driver Register"
              component={DriverRegisterScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Driver Dashboard"
              component={DriverDashboardScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Add Vehicle"
              component={AddVehicle}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Add Route"
              component={AddRoute}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Manage Vehicle"
              component={ManageVehicle}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Live Tracking"
              component={LiveTracking}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Ride Request"
              component={RideRequest}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Rides List"
              component={RidesList}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Go Live"
              component={GoLive}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="Student Login"
              component={StudentLoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Student Register"
              component={StudentRegisterScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Book Card"
              component={BookCard}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Student Dashboard"
              component={StudentDashboardScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Book Ride"
              component={BookRide}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Tracking"
              component={Tracking}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Join Live"
              component={JoinLive}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </KeyboardAvoidingView>
        <FlashMessage position="top" />
      </SafeAreaProvider>
    </NavigationContainer>
  );
};

export default App;
