import React, { useEffect } from 'react';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './src/HomeScreen';
import RecipesScreen from './src/SavedRecipesScreen';
import SettingsScreen from './src/SettingsScreen';
import { View, StyleSheet } from 'react-native';
import store from './src/context/store';
import { Provider } from 'react-redux';
import IngredientScreen from './src/RecipeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import { MagicModalPortal } from "react-native-magic-modal";


const Drawer = createDrawerNavigator();
const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
  },
});

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
      <GestureHandlerRootView>
        <Provider store={store}>
        <NavigationContainer>
        <Drawer.Navigator 
        initialRouteName="Procesar ingredientes"
      >
                <Drawer.Screen name="Procesar ingredientes" component={HomeScreen} />
                <Drawer.Screen name="Nuestras recomendaciones" component={IngredientScreen} />
                <Drawer.Screen name="Recetas guardadas" component={RecipesScreen} />
                <Drawer.Screen name="Settings" component={SettingsScreen} />
            </Drawer.Navigator>
        </NavigationContainer>
        </Provider>
        <MagicModalPortal /> 
        </GestureHandlerRootView>
    );
};

export default App;
