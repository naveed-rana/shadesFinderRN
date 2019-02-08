import React from 'react';

import {
 
  createStackNavigator,
  createAppContainer,

} from 'react-navigation';

// import HomeScreen from "../screens/ActiveCases";

import HomeScreen from "./homeScreen";
import ShareScreens from './shareScreen';


const HomeStack = createStackNavigator({
  Homes: HomeScreen,
  ShareScreen:ShareScreens,
},
{
  headerMode: 'none',
}
);

export default createAppContainer(HomeStack)