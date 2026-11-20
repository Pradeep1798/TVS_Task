import React, { useCallback } from 'react';
import { FlatList, ListRenderItem, SafeAreaView, StyleSheet, Text } from 'react-native';
import CaseCard from '../components/CaseCard';
import Snackbar from '../components/SnackBar';
import { useSnackbar } from '../hooks/useSnackbar';
import { useAppSelector } from '../store/hooks';
import { selectCases } from 'store/caseSlice';
import { useCaseNotifications } from 'hooks/useCaseNotifications ';
import { Case } from 'modals/case';

const CasesScreen = () => {
  const cases = useAppSelector(selectCases);
  const { message, show } = useSnackbar();

  const onNewCase = useCallback((c: Case) => show(`New case received: ${c.id}`), [show]);
  useCaseNotifications(onNewCase);

  const renderItem: ListRenderItem<Case> = useCallback(
    ({ item }) => <CaseCard item={item} />,
    [],
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Cases</Text>
      <FlatList
        data={cases}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No cases yet</Text>}
      />
      <Snackbar message={message} />
    </SafeAreaView>
  );
};

export default CasesScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { fontSize: 22, fontWeight: '700', padding: 16 },
  empty: { textAlign: 'center', marginTop: 40, color: '#888' },
});