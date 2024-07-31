import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import RecipeItem from './RecipeItem';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
      const response = await axios.get('https://anchovy-aware-abnormally.ngrok-free.app/get-saved-recipes/', {
        params: { device_id: id }
      });
      const recipes = response.data.recipes;
      setSavedRecipes(recipes);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeviceId();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (deviceId) {
        setLoading(true);
        fetchSavedRecipes(deviceId);
      }
    }, [deviceId])
  );

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
        <Text style={styles.title}>No hay recetas guardadas.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {savedRecipes.map((recipe, index) => (
        <RecipeItem key={index} recipe={recipe} showStar={false} />
      ))}
    </ScrollView>
  );
};

export default SavedRecipesScreen;
