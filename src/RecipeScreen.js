import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import DefaultScreen from './DefaultScreen';
import RecipeItem from './RecipeItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';

const BING_SEARCH_API_KEY = '4614dcb86d834c11ac7f5c28dd1f3b77';  // Replace with your API key
const BING_SEARCH_URL = 'https://api.bing.microsoft.com/v7.0/images/search';
const PLACEHOLDER_IMAGE_URL = 'https://www.totalchaletservices.com/media/s43joq31/dinner-placeholder.png';

const searchImage = async (query) => {
  try {
    const response = await axios.get(BING_SEARCH_URL, {
      params: { q: query, count: 1 },
      headers: { 'Ocp-Apim-Subscription-Key': BING_SEARCH_API_KEY },
    });

    if (response.data.value && response.data.value.length > 0) {
      return response.data.value[0].contentUrl;
    } else {
      return PLACEHOLDER_IMAGE_URL;
    }
  } catch (error) {
    console.error('Error searching for image:', error);
    return PLACEHOLDER_IMAGE_URL;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212'
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#fff'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const RecipesScreen = ({ route, navigation }) => {
  const { recipes } = route.params || {};
  const [deviceId, setDeviceId] = useState('');
  const [recipesWithImages, setRecipesWithImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeviceId = async () => {
      try {
        const id = await DeviceInfo.getUniqueId();
        await AsyncStorage.setItem('device_id', id);
        setDeviceId(id);
      } catch (error) {
        console.error('Error fetching device ID:', error);
      }
    };

    const fetchImages = async () => {
      const updatedRecipes = await Promise.all(
        recipes?.map(async (recipe) => {
          const imageUrl = await searchImage(recipe.name);
          console.log(imageUrl);
          return { ...recipe, url: imageUrl };
        })
      );
      setRecipesWithImages(updatedRecipes);
      setLoading(false);
    };
    fetchDeviceId();
    if (recipes){
      fetchImages();
    }
  }, [recipes]);

  if (!recipes || recipes.length === 0) {
    return <DefaultScreen navigation={navigation} />;
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Nuestras recomendaciones para ti:</Text>
      {recipesWithImages.map((recipe, index) => (
        <RecipeItem key={index} recipe={recipe} deviceId={deviceId} />
      ))}
    </ScrollView>
  );
};

export default RecipesScreen;
