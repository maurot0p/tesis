// IngredientScreen.js
import React from 'react';
import { View, Text, FlatList } from 'react-native';

class IngredientScreen extends React.Component {
  renderIngredient = ({ item }) => (
    <View style={{ padding: 10 }}>
      <Text>{item}</Text>
    </View>
  );

  render() {
    const { route } = this.props;
    const { ingredients } = route.params;

    return (
      <View style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 20, marginBottom: 20 }}>Ingredients:</Text>
        <FlatList
          data={ingredients}
          renderItem={this.renderIngredient}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}

export default IngredientScreen;
