import React from 'react';
import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './src/HomeScreen';
import RecipesScreen from './src/SavedRecipesScreen';
import store from './src/context/store';
import { Provider } from 'react-redux';
import IngredientScreen from './src/RecipeScreen';

const Drawer = createDrawerNavigator();

const App = () => {
    return (
        <Provider store={store}>
        <NavigationContainer>
            <Drawer.Navigator initialRouteName="Home">
                <Drawer.Screen name="Home" component={HomeScreen} />
                <Drawer.Screen name="Recipes" component={IngredientScreen} />
                <Drawer.Screen name="Saved Recipes" component={RecipesScreen} />
            </Drawer.Navigator>
        </NavigationContainer>
        </Provider>
    );
};

export default App;
