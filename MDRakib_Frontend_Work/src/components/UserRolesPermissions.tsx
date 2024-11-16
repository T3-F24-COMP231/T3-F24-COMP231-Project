import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput, Button, Card, Chip } from 'react-native-paper';

const UserRolesPermissions: React.FC = () => {
  const [roleName, setRoleName] = useState<string>(''); // Role name input
  const [permissions, setPermissions] = useState({
    view: false,
    edit: false,
    delete: false,
    admin: false,
  }); // Permissions state

  const handleTogglePermission = (permission: keyof typeof permissions) => {
    setPermissions((prev) => ({
      ...prev,
      [permission]: !prev[permission],
    }));
  };

  const handleSaveRole = () => {
    if (roleName.trim() === '') {
      alert('Role name cannot be empty.');
      return;
    }
    const selectedPermissions = Object.keys(permissions).filter(
      (key) => permissions[key as keyof typeof permissions]
    );
    alert(`Role: ${roleName}\nPermissions: ${selectedPermissions.join(', ')}`);
    // Clear the form
    setRoleName('');
    setPermissions({
      view: false,
      edit: false,
      delete: false,
      admin: false,
    });
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="User Roles and Permissions" />
        <Card.Content>
          {/* Role Name Input */}
          <TextInput
            label="Role Name"
            value={roleName}
            onChangeText={setRoleName}
            mode="outlined"
            style={styles.input}
          />

          {/* Permissions */}
          <Text style={styles.permissionsLabel}>Permissions</Text>
          <View style={styles.permissionsContainer}>
            <Chip
              selected={permissions.view}
              onPress={() => handleTogglePermission('view')}
              mode="flat"
              style={[
                styles.chip,
                permissions.view && styles.selectedChip,
              ]}
            >
              View
            </Chip>
            <Chip
              selected={permissions.edit}
              onPress={() => handleTogglePermission('edit')}
              mode="flat"
              style={[
                styles.chip,
                permissions.edit && styles.selectedChip,
              ]}
            >
              Edit
            </Chip>
            <Chip
              selected={permissions.delete}
              onPress={() => handleTogglePermission('delete')}
              mode="flat"
              style={[
                styles.chip,
                permissions.delete && styles.selectedChip,
              ]}
            >
              Delete
            </Chip>
            <Chip
              selected={permissions.admin}
              onPress={() => handleTogglePermission('admin')}
              mode="flat"
              style={[
                styles.chip,
                permissions.admin && styles.selectedChip,
              ]}
            >
              Admin
            </Chip>
          </View>

          {/* Save Role Button */}
          <Button
            mode="contained"
            onPress={handleSaveRole}
            style={styles.saveButton}
          >
            Save Role
          </Button>
        </Card.Content>
      </Card>
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
  permissionsLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  permissionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#f0f0f0',
  },
  selectedChip: {
    backgroundColor: '#6A1B9A',
    color: '#fff',
  },
  saveButton: {
    borderRadius: 5,
    backgroundColor: '#6A1B9A',
  },
});

export default UserRolesPermissions;
