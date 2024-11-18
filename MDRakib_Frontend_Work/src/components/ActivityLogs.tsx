import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { Button, Card } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';

const ActivityLogs: React.FC = () => {
  const [userFilter, setUserFilter] = useState<string | null>(null);
  const [actionFilter, setActionFilter] = useState<string | null>(null);

  const [openUserDropdown, setOpenUserDropdown] = useState(false);
  const [openActionDropdown, setOpenActionDropdown] = useState(false);

  const users = [
    { label: 'User1', value: 'User1' },
    { label: 'User2', value: 'User2' },
    { label: 'User3', value: 'User3' },
  ];

  const actions = [
    { label: 'View', value: 'View' },
    { label: 'Edit', value: 'Edit' },
    { label: 'Delete', value: 'Delete' },
    { label: 'Admin', value: 'Admin' },
  ];

  const logs = [
    { date: '2024-11-01', user: 'User1', action: 'View' },
    { date: '2024-11-02', user: 'User2', action: 'Edit' },
    { date: '2024-11-03', user: 'User1', action: 'Delete' },
    { date: '2024-11-04', user: 'User3', action: 'Admin' },
  ];

  // Filter the logs based on user and action
  const filteredLogs = logs.filter((log) => {
    return (
      (userFilter === null || log.user === userFilter) &&
      (actionFilter === null || log.action === actionFilter)
    );
  });

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Activity Logs" />
        <Card.Content>
          {/* Dropdown for Users */}
          <Text style={styles.label}>Filter by User</Text>
          <View style={{ zIndex: 3000 }}>
            <DropDownPicker
              open={openUserDropdown}
              value={userFilter}
              items={users}
              setOpen={setOpenUserDropdown}
              setValue={setUserFilter}
              placeholder="Select a User"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
            />
          </View>

          {/* Dropdown for Actions */}
          <Text style={styles.label}>Filter by Action</Text>
          <View style={{ zIndex: 2000 }}>
            <DropDownPicker
              open={openActionDropdown}
              value={actionFilter}
              items={actions}
              setOpen={setOpenActionDropdown}
              setValue={setActionFilter}
              placeholder="Select an Action"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
            />
          </View>

          <Button
            mode="contained"
            onPress={() => {
              setUserFilter(null);
              setActionFilter(null);
            }}
            style={styles.resetButton}
          >
            Reset Filters
          </Button>
        </Card.Content>
      </Card>

      {/* Display Logs */}
      <ScrollView style={styles.scrollView}>
        {filteredLogs.length > 0 ? (
          filteredLogs.map((log, index) => (
            <Card key={index} style={styles.logCard}>
              <Text>Date: {log.date}</Text>
              <Text>User: {log.user}</Text>
              <Text>Action: {log.action}</Text>
            </Card>
          ))
        ) : (
          <Text style={styles.noLogsText}>No logs found.</Text>
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
    marginBottom: 16,
    borderRadius: 10,
    elevation: 3,
    padding: 10,
  },
  label: {
    marginVertical: 8,
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  dropdown: {
    marginBottom: 16,
    backgroundColor: '#ffffff',
    borderColor: '#ccc',
  },
  dropdownContainer: {
    backgroundColor: '#ffffff',
    borderColor: '#ccc',
  },
  resetButton: {
    marginTop: 12,
    backgroundColor: '#6A1B9A',
  },
  scrollView: {
    marginTop: 24, // Increased spacing between dropdowns and logs
  },
  logCard: {
    marginBottom: 10,
    padding: 12,
    backgroundColor: '#ebe6f2',
    borderRadius: 8,
    elevation: 2,
  },
  noLogsText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
});

export default ActivityLogs;
