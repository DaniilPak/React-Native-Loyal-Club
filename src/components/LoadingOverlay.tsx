import React from 'react';
import { View, ActivityIndicator, StyleSheet, Modal } from 'react-native';

interface LoadingOverlayProps {
    loading: boolean;
}

const LoadingOverlay = ({ loading }: LoadingOverlayProps) => {
    return (
        <Modal visible={loading} transparent={true} animationType="fade">
            <View style={styles.overlay}>
                <ActivityIndicator size="large" color="#FFFFFF" />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
});

export default LoadingOverlay;
