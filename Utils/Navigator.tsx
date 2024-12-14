import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";

import Login from "../Screens/Login";
import ChooseRoom from "../Screens/ChooseRoom";
import Match from "../Screens/Match";

export type NavigatorParams = {
  Login: undefined;
  ChooseRoom: undefined;
  Match: undefined;
};

const Stack = createNativeStackNavigator<NavigatorParams>();

export default () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Match">
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="ChooseRoom" component={ChooseRoom} />
      <Stack.Screen name="Match" component={Match}/>
    </Stack.Navigator>
  </NavigationContainer>
);
