import { View, Text, Modal, ActivityIndicator } from 'react-native';
import React from 'react';

const Loading = ({ visible, onRequestClose }) => {
    return (
        <Modal
            transparent={true}
            animationType="fade"
            visible={visible}
            onRequestClose={onRequestClose}
        >
            <View className="flex-1 justify-center items-center bg-opacity-50">
                <View className="w-[4rem] h-[4rem] rounded-lg bg-white items-center justify-center p-4">
                    <ActivityIndicator size="large" color="#ff9001" />
                </View>
            </View>
        </Modal>
    );
};

export default Loading;
