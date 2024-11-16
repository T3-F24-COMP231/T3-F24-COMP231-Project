import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { Button, Card } from 'react-native-paper';

const RepaymentHistory: React.FC = () => {
  // Mock repayment data for display purposes
  const repayments = [
    { date: '2024-11-01', payment: '$500', balance: '$2000' },
    { date: '2024-10-01', payment: '$400', balance: '$2500' },
    { date: '2024-09-01', payment: '$450', balance: '$2900' },
    { date: '2024-08-01', payment: '$600', balance: '$3300' },
  ];

  const handleBackPress = () => {
    alert('Back to Debt Details'); // Replace with navigation logic if needed
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Repayment History" />
        <Card.Content>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Date</Text>
            <Text style={styles.tableHeaderText}>Payment</Text>
            <Text style={styles.tableHeaderText}>Balance</Text>
          </View>

          {/* Table Rows */}
          <ScrollView style={styles.scrollView}>
            {repayments.map((repayment, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{repayment.date}</Text>
                <Text style={styles.tableCell}>{repayment.payment}</Text>
                <Text style={styles.tableCell}>{repayment.balance}</Text>
              </View>
            ))}
          </ScrollView>
        </Card.Content>
      </Card>

      {/* Back Button */}
      <Button
        mode="outlined"
        onPress={handleBackPress}
        style={styles.backButton}
      >
        Back to Debt Details
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
    borderRadius: 10,
    marginBottom: 16,
    elevation: 2, // Adds shadow for a card effect
    backgroundColor: '#fff',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#ebe6f2',
    borderRadius: 5,
    marginBottom: 8,
  },
  tableHeaderText: {
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    color: '#333',
  },
  scrollView: {
    maxHeight: 300, // Adjust scrollable area height
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    color: '#333',
  },
  backButton: {
    marginTop: 16,
    borderRadius: 5,
    alignSelf: 'center',
    width: '80%',
    borderColor: '#6A1B9A',
  },
});

export default RepaymentHistory;
