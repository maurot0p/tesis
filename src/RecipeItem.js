import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Snackbar from 'react-native-snackbar';
import axios from 'axios';

const deviceWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  recipeContainer: {
    marginBottom: 20,
    backgroundColor: '#ADD8E6',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  recipeImage: {
    width: deviceWidth - 40,
    height: 200,
  },
  recipeDetails: {
    padding: 10,
  },
  recipeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    color: '#222222',
  },
  recipeDescription: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  ingredients: {
    fontSize: 14,
    color: '#555',
  },
  directions: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  expandButton: {
    marginLeft: 10,
  },
  starButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  directionsList: {
    marginTop: 10,
  },
  directionItem: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
});

const RecipeDirections = ({ directions }) => {
    return (
      <View style={styles.directionsList}>
        {directions.split(/\d+\./).filter(Boolean).map((direction, index) => (
          <Text key={index} style={styles.directionItem}>
            {index + 1}. {direction.trim()}
          </Text>
        ))}
      </View>
    );
  };
  
const RecipeItem = ({ recipe, deviceId, isSaved = false, showStar = true }) => {
  const [expanded, setExpanded] = useState(false);
  const [saved, setSaved] = useState(isSaved);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const saveRecipe = async () => {
    try {
      await axios.post('https://anchovy-aware-abnormally.ngrok-free.app/save-recipes/', {
        recipe_id: recipe.id,
        device_id: deviceId,
        url: recipe.url,
      });
      Snackbar.show({
        text: 'Successfully saved recipe',
        duration: Snackbar.LENGTH_SHORT,
      });
      setSaved(true);
    } catch (error) {
      console.error('Error saving recipe:', error);
      Snackbar.show({
        text: 'Failed to save recipe',
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  };

  return (
    <View style={styles.recipeContainer}>
      <Image source={{ uri: recipe.url }} style={styles.recipeImage} />
      {showStar && (
        <TouchableOpacity
          onPress={!saved ? saveRecipe : null}
          style={styles.starButton}
          disabled={saved}
        >
          <Icon name={saved ? 'star' : 'star-outline'} size={24} color="#FFD700" />
        </TouchableOpacity>
      )}
      <View style={styles.recipeDetails}>
        <View style={styles.recipeHeader}>
          <Text style={styles.recipeTitle}>{recipe.name}</Text>
          <TouchableOpacity onPress={toggleExpand} style={styles.expandButton}>
            <Icon name={expanded ? 'chevron-up-outline' : 'chevron-down-outline'} size={24} color="#007BFF" />
          </TouchableOpacity>
        </View>
        {expanded && (
          <View>
            <Text style={styles.ingredients}>Ingredientes: {recipe.ingredients}</Text>
            <Text style={styles.directions}>Pasos:</Text>
            <RecipeDirections directions={recipe.directions} />
          </View>
        )}
      </View>
    </View>
  );
};

export default RecipeItem;
