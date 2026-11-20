import { Case } from 'modals/case';
import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { formatReceivedTime } from 'utils/utils';

interface Props {
  item: Case;
}

const CaseCard = ({ item }: Props) => (
  <View style={styles.card}>
    <View style={styles.row}>
      <Text style={styles.id}>{item.id}</Text>
      <Text style={styles.time}>{formatReceivedTime(item.receivedAt)}</Text>
    </View>
    <Text style={styles.title}>{item.title}</Text>
    <Text>{item.body}</Text>
  </View>
);

export default memo(CaseCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 14,
    borderRadius: 8,
    elevation: 2,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  id: { fontWeight: '700', color: '#1a73e8' },
  time: { color: '#888', fontSize: 12 },
  title: { fontSize: 16, marginVertical: 2 },
});