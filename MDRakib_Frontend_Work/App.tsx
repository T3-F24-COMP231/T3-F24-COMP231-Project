import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import IncomeExpenseEntry from './src/components/IncomeExpenseEntry';
import RepaymentHistory from './src/components/RepaymentHistory';
import ActivityLogs from './src/components/ActivityLogs';
import CustomCategories from './src/components/CustomCategories';
import InvestmentOverview from './src/components/InvestmentOverview';
import UserRolesPermissions from './src/components/UserRolesPermissions';

const Tab = createMaterialTopTabNavigator();

const App: React.FC = () => {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="UserRolesPermissions"
          screenOptions={{
            tabBarLabelStyle: { fontSize: 12 },
            tabBarStyle: { backgroundColor: '#6A1B9A' }, // Customize tab bar color
            tabBarActiveTintColor: '#ffffff', // Active tab label color
            tabBarInactiveTintColor: '#cccccc', // Inactive tab label color
            tabBarIndicatorStyle: { backgroundColor: '#ffffff' }, // Underline color for active tab
          }}
        >
          <Tab.Screen
            name="IncomeExpenseEntry"
            component={IncomeExpenseEntry}
            options={{ title: 'Income & Expense Entry' }}
          />
          <Tab.Screen
            name="RepaymentHistory"
            component={RepaymentHistory}
            options={{ title: 'Repayment History' }}
          />
          <Tab.Screen
            name="ActivityLogs"
            component={ActivityLogs}
            options={{ title: 'Activity Logs' }}
          />
          <Tab.Screen
            name="CustomCategories"
            component={CustomCategories}
            options={{ title: 'Custom Categories' }}
          />
          <Tab.Screen
            name="InvestmentOverview"
            component={InvestmentOverview}
            options={{ title: 'Investment Overview' }}
          />
          <Tab.Screen
            name="UserRolesPermissions"
            component={UserRolesPermissions}
            options={{ title: 'User Roles & Permissions' }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
