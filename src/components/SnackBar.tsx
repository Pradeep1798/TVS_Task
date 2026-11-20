import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  message: string | null;
}

const Snackbar = ({ message }: Props) =>
  message ? (
    <View style={styles.container} accessibilityLiveRegion="polite">
      <Text style={styles.text}>{message}</Text>
    </View>
  ) : null;

export default Snackbar;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: '#323232',
    padding: 14,
    borderRadius: 6,
  },
  text: { color: '#fff' },
});