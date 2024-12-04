import React from "react";
import { Modal, View, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { CustomText } from "../common";
import useTheme from "../../hooks/useThemeColor";
import KeyboardAvoidingViewLayout from "../layouts/KeyboardAvoidingViewLayout";

interface IModal {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const CustomModal = ({ isVisible, onClose, children, title }: IModal) => {
  const { theme } = useTheme();
  return (
    <SafeAreaView style={{flex: 1}}>
      <Modal
        visible={isVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContainer,
              {
                backgroundColor: theme.background,
                borderColor: theme.border,
                borderWidth: 0.5,
              },
            ]}
          >
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <CustomText style={styles.modalTitle}>{title}</CustomText>
              <TouchableOpacity onPress={onClose}>
                <CustomText style={styles.closeButtonText}>X</CustomText>
              </TouchableOpacity>
            </View>

            {/* Modal Content */}
            <View style={styles.modalContentContainer}>{children}</View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "100%",
    height: "80%",
    maxHeight: "90%",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButtonText: {
    fontSize: 18,
    color: "red",
  },
  modalContentContainer: {
    flex: 1,
    height: "auto",
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CustomModal;
