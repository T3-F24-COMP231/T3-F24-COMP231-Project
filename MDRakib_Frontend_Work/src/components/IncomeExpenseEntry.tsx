import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, RadioButton, Card, Menu } from 'react-native-paper';

const IncomeExpenseEntry: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState<string>('');
  const [menuVisible, setMenuVisible] = useState(false);

  const incomeCategories = ['Salary', 'Business', 'Investments', 'Freelancing'];
  const expenseCategories = ['Food', 'Rent', 'Utilities', 'Shopping'];

  const categories = type === 'income' ? incomeCategories : expenseCategories;

  const handleSave = () => {
    if (amount && category) {
      alert(`Entry Saved Successfully!\nType: ${type}\nAmount: ${amount}\nCategory: ${category}`);
    } else {
      alert('Please fill in all fields.');
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Income & Expense Entry" />
        <Card.Content>
          {/* Amount Input */}
          <TextInput
            label="Amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            style={styles.input}
            mode="flat"
          />

          {/* Category Dropdown */}
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setMenuVisible(true)}
                style={styles.dropdownButton}
              >
                {category || 'Select Category'}
              </Button>
            }
          >
            {categories.map((cat) => (
              <Menu.Item
                key={cat}
                onPress={() => {
                  setCategory(cat);
                  setMenuVisible(false);
                }}
                title={cat}
              />
            ))}
          </Menu>

          {/* Type Selection */}
          <View style={styles.radioGroup}>
            <RadioButton.Group
              onValueChange={(value) => {
                setType(value as 'income' | 'expense');
                setCategory(''); // Reset category when type changes
              }}
              value={type}
            >
              <RadioButton.Item label="Income" value="income" />
              <RadioButton.Item label="Expense" value="expense" />
            </RadioButton.Group>
          </View>
        </Card.Content>
      </Card>

      {/* Save Button */}
      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.saveButton}
        contentStyle={styles.buttonContent}
      >
        Save Entry
      </Button>
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
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 16,
  },
  input: {
    marginVertical: 8,
    backgroundColor: '#ebe6f2',
    borderRadius: 5,
  },
  dropdownButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  saveButton: {
    marginTop: 16,
    borderRadius: 20,
    backgroundColor: '#6A1B9A',
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default IncomeExpenseEntry;
