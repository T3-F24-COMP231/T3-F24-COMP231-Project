import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { TextInput, Button, Card } from 'react-native-paper';

const CustomCategories: React.FC = () => {
  const [categoryName, setCategoryName] = useState<string>(''); // Input for category name
  const [categories, setCategories] = useState<string[]>([]); // List of saved categories

  const handleSaveCategory = () => {
    if (categoryName.trim() === '') {
      alert('Category name cannot be empty.');
      return;
    }
    setCategories((prevCategories) => [...prevCategories, categoryName]);
    setCategoryName(''); // Clear input after saving
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Create Custom Categories" />
        <Card.Content>
          {/* Input Field for Category Name */}
          <TextInput
            label="Category Name"
            value={categoryName}
            onChangeText={setCategoryName}
            mode="outlined"
            style={styles.input}
          />

          {/* Save Button */}
          <Button
            mode="contained"
            onPress={handleSaveCategory}
            style={styles.saveButton}
          >
            Save Category
          </Button>
        </Card.Content>
      </Card>

      {/* Display List of Saved Categories */}
      <ScrollView style={styles.categoriesList}>
        {categories.length > 0 ? (
          categories.map((category, index) => (
            <Card key={index} style={styles.categoryCard}>
              <Text style={styles.categoryText}>{category}</Text>
            </Card>
          ))
        ) : (
          <Text style={styles.noCategoriesText}>
            No categories created yet.
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    borderRadius: 10,
    marginBottom: 16,
    elevation: 2,
  },
  input: {
    marginBottom: 16,
  },
  saveButton: {
    borderRadius: 5,
    backgroundColor: '#6A1B9A',
  },
  categoriesList: {
    marginTop: 16,
  },
  categoryCard: {
    marginBottom: 8,
    padding: 10,
    backgroundColor: '#ebe6f2',
    borderRadius: 5,
  },
  categoryText: {
    fontSize: 16,
    color: '#333',
  },
  noCategoriesText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
});

export default CustomCategories;
