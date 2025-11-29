import React from 'react';
import {StyleSheet, Text, View, SectionList, StatusBar} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const DATA = [
  {
    title: 'Kelas A',
    data: ['Anastasia', 'Budiman', 'Budi'],
  },
  {
    title: 'Kelas B',
    data: ['Rina', 'Riri', 'Rini', 'Putu'],
  },
  {
    title: 'Asisten',
    data: ['Hayyu', 'Rini', 'Syaiful', 'Vero'],
  },
];

const App = () => (
  <SafeAreaProvider>
    <SafeAreaView style={styles.container} edges={['top']}>
      <SectionList
        sections={DATA}
        keyExtractor={(item, index) => item + index}
        renderItem={({item}) => (
          <View style={styles.item}>
            <Text style={styles.title}>
                <MaterialIcons name="supervised-user-circle" size={16} color="#e15735ff" />
                {' '}
                {item}
            </Text>
          </View>
        )}
        renderSectionHeader={({section: {title}}) => (
          <Text style={styles.header}>{title}</Text>
        )}
      />
    </SafeAreaView>
  </SafeAreaProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    marginHorizontal: 16,
    marginVertical: 10,
  },
  item: {
    backgroundColor: '#d4ffc2ff',
    padding: 10,
    marginVertical: 3,
    borderRadius: 8,
  },
  header: {
    fontSize: 30,
    fontWeight: '600',
    marginBottom: 10,
    paddingLeft: 5,
    marginTop: 10,
    backgroundColor: '#dafce0ff',
  },
  title: {
    fontSize: 15,
  },
});

export default App;