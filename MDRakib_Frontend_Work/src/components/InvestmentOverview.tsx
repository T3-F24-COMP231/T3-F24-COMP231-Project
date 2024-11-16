import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { Button, Card } from 'react-native-paper';

const InvestmentOverview: React.FC = () => {
  // Sample investment data
  const investments = [
    { type: 'Stock', value: '$10,000', profitLoss: '+$2,000' },
    { type: 'Real Estate', value: '$50,000', profitLoss: '+$5,000' },
    { type: 'Bonds', value: '$20,000', profitLoss: '-$1,000' },
  ];

  // State for the selected investment
  const [selectedInvestment, setSelectedInvestment] = useState<{
    type: string;
    value: string;
    profitLoss: string;
  } | null>(null);

  const handleViewDetails = (investment: {
    type: string;
    value: string;
    profitLoss: string;
  }) => {
    setSelectedInvestment(investment);
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Investment Overview" />
        <Card.Content>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Type</Text>
            <Text style={styles.tableHeaderText}>Value</Text>
            <Text style={styles.tableHeaderText}>Profit/Loss</Text>
          </View>

          {/* Table Rows */}
          <ScrollView style={styles.scrollView}>
            {investments.map((investment, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{investment.type}</Text>
                <Text style={styles.tableCell}>{investment.value}</Text>
                <Text
                  style={[
                    styles.tableCell,
                    investment.profitLoss.startsWith('+')
                      ? styles.profitText
                      : styles.lossText,
                  ]}
                >
                  {investment.profitLoss}
                </Text>
                <Button
                  mode="outlined"
                  onPress={() => handleViewDetails(investment)}
                  style={styles.detailsButton}
                >
                  View Details
                </Button>
              </View>
            ))}
          </ScrollView>
        </Card.Content>
      </Card>

      {/* Display Selected Investment Details */}
      {selectedInvestment && (
        <Card style={styles.detailCard}>
          <Card.Title title={`${selectedInvestment.type} Details`} />
          <Card.Content>
            <Text style={styles.detailText}>Value: {selectedInvestment.value}</Text>
            <Text style={styles.detailText}>
              Profit/Loss: {selectedInvestment.profitLoss}
            </Text>
            <Text style={styles.detailText}>
              Description: Detailed information about the {selectedInvestment.type} investment.
            </Text>
          </Card.Content>
          <Button
            mode="contained"
            onPress={() => setSelectedInvestment(null)} // Clear selection
            style={styles.closeDetailsButton}
          >
            Close Details
          </Button>
        </Card>
      )}
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
    maxHeight: 300,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  profitText: {
    color: 'green',
  },
  lossText: {
    color: 'red',
  },
  detailsButton: {
    marginLeft: 8,
    borderRadius: 5,
    borderColor: '#6A1B9A',
  },
  detailCard: {
    borderRadius: 10,
    marginTop: 16,
    padding: 16,
    backgroundColor: '#ebe6f2',
  },
  detailText: {
    fontSize: 16,
    marginVertical: 8,
    color: '#333',
  },
  closeDetailsButton: {
    marginTop: 16,
    borderRadius: 5,
    backgroundColor: '#6A1B9A',
  },
});

export default InvestmentOverview;
