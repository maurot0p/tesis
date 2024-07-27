import React, { useEffect } from 'react';
import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './src/HomeScreen';
import RecipesScreen from './src/SavedRecipesScreen';
import SettingsScreen from './src/SettingsScreen';
import CustomDrawerContent from './src/CustomDrawerContent';

import store from './src/context/store';
import { Provider } from 'react-redux';
import IngredientScreen from './src/RecipeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';

const Drawer = createDrawerNavigator();

const App = () => {
    useEffect(() => {
        const storeDeviceId = async () => {
          try {
            const deviceId = await DeviceInfo.getUniqueId();
            await AsyncStorage.setItem('device_id', deviceId);
          } catch (error) {
            console.error('Error storing device ID:', error);
          }
        };
        storeDeviceId();
      }, []);
    return (
        <Provider store={store}>
        <NavigationContainer>
        <Drawer.Navigator 
        initialRouteName="Home"
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
                <Drawer.Screen name="Home" component={HomeScreen} />
                <Drawer.Screen name="Recipes" component={IngredientScreen} />
                <Drawer.Screen name="Saved Recipes" component={RecipesScreen} />
                <Drawer.Screen name="Settings" component={SettingsScreen} />
            </Drawer.Navigator>
        </NavigationContainer>
        </Provider>
    );
};

export default App;
