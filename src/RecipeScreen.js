import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import axios from 'axios';
import DefaultScreen from './DefaultScreen';  // Import the DefaultScreen component

const deviceWidth = Dimensions.get('window').width;

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
  recipeContainer: {
    marginBottom: 20,
    backgroundColor: '#FFD369',
    borderRadius: 10,
    overflow: 'hidden',
  },
  recipeImage: {
    width: deviceWidth - 40,
    height: 200,
  },
  recipeDetails: {
    padding: 10,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  recipeDescription: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const RecipeItem = ({ recipe }) => (
  <View style={styles.recipeContainer}>
    <Image source={{ uri: recipe.url }} style={styles.recipeImage} />
    <View style={styles.recipeDetails}>
      <Text style={styles.recipeTitle}>{recipe.name}</Text>
      <Text style={styles.recipeDescription}>{recipe.directions}</Text>
    </View>
  </View>
);

const RecipesScreen = ({ route, navigation }) => {
  const { recipes } = route.params || {};

  if (!recipes || recipes.length === 0) {
    return <DefaultScreen navigation={navigation} />;
  }

  const [recipesWithImages, setRecipesWithImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      const updatedRecipes = await Promise.all(
        recipes.map(async (recipe) => {
          const imageUrl = await searchImage(recipe.name);
          return { ...recipe, url: imageUrl };
        })
      );
      setRecipesWithImages(updatedRecipes);
      setLoading(false);
    };

    fetchImages();
  }, [recipes]);

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
        <RecipeItem key={index} recipe={recipe} />
      ))}
    </ScrollView>
  );
};

export default RecipesScreen;
