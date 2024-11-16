import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { Button, Card, TextInput } from 'react-native-paper';

const ActivityLogs: React.FC = () => {
  // Mock activity log data
  const [logs, setLogs] = useState([
    { date: '2024-11-16', user: 'Admin', action: 'Login' },
    { date: '2024-11-15', user: 'User1', action: 'Edited Profile' },
    { date: '2024-11-15', user: 'User2', action: 'Deleted Record' },
    { date: '2024-11-14', user: 'Admin', action: 'Added User' },
  ]);

  const [filterDate, setFilterDate] = useState('');

  const handleFilter = () => {
    if (filterDate) {
      const filteredLogs = logs.filter(log => log.date === filterDate);
      setLogs(filteredLogs);
    } else {
      alert('Please enter a date to filter.');
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="System Activity Logs" />
        <Card.Content>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Date</Text>
            <Text style={styles.tableHeaderText}>User</Text>
            <Text style={styles.tableHeaderText}>Action</Text>
          </View>

          {/* Table Rows */}
          <ScrollView style={styles.scrollView}>
            {logs.map((log, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{log.date}</Text>
                <Text style={styles.tableCell}>{log.user}</Text>
                <Text style={styles.tableCell}>{log.action}</Text>
              </View>
            ))}
          </ScrollView>
        </Card.Content>
      </Card>

      {/* Filter by Date */}
      <TextInput
        label="Filter by Date (YYYY-MM-DD)"
        value={filterDate}
        onChangeText={setFilterDate}
        mode="outlined"
        style={styles.input}
      />
      <Button mode="contained" onPress={handleFilter} style={styles.filterButton}>
        Filter by Date
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
    elevation: 2, // Adds shadow for card effect
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
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  filterButton: {
    borderRadius: 5,
    alignSelf: 'center',
    width: '80%',
    backgroundColor: '#6A1B9A',
  },
});

export default ActivityLogs;
