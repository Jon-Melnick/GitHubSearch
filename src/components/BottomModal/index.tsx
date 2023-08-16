import React, {useState, useEffect, ReactNode} from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Button,
} from 'react-native';

type ActionButton = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
};

interface BottomModalProps {
  visible: boolean;
  onClose: () => void;
  actionButtons?: ActionButton[];
  children?: ReactNode;
}

const BottomModal: React.FC<BottomModalProps> = ({
  visible,
  onClose,
  actionButtons,
  children,
}) => {
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const backdropOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={styles.backdrop}
          onPress={onClose}
          activeOpacity={1}>
          <Animated.View
            style={[styles.backdropOverlay, {opacity: backdropOpacity}]}
          />
        </TouchableOpacity>
        <View style={styles.modalContent}>
          {children}
          {actionButtons?.map((actionButtonProps, idx) => (
            <Button key={idx} {...actionButtonProps} />
          ))}
          <Button title="Dismiss" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  backdropOverlay: {
    flex: 1,
    backgroundColor: 'black',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
});

export default BottomModal;
