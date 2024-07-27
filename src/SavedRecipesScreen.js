import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import RecipeItem from './RecipeItem';

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
    color: '#000000'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const SavedRecipesScreen = ({ navigation }) => {
  const [deviceId, setDeviceId] = useState('');
  const [savedRecipes, setSavedRecipes] = useState([]);
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

    const fetchSavedRecipes = async (id) => {
      try {
        const response = await axios.get('http://localhost:8000/get-saved-recipes/', {
          params: { device_id: id }
        });
        const recipes = response.data.recipes;
        setSavedRecipes(recipes);
      } catch (error) {
        console.error('Error fetching saved recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeviceId().then(() => {
      if (deviceId) {
        fetchSavedRecipes(deviceId);
      }
    });
  }, [deviceId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (savedRecipes.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.title}>No saved recipes found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Saved Recipes:</Text>
      {savedRecipes.map((recipe, index) => (
        <RecipeItem key={index} recipe={recipe} showStar={false} />
      ))}
    </ScrollView>
  );
};

export default SavedRecipesScreen;
