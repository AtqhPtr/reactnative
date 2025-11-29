import React from 'react';
import {StyleSheet, TextInput, Text, Button, View} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import {Stack} from 'expo-router';

const TextInputExample = () => {
  const [text, onChangeText] = React.useState('Useless Text');
  const [number, onChangeNumber] = React.useState('');

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Stack.Screen options={{ title: 'Form Input' }} />
        <text style={styles.label}>Nama</text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          placeholder='Nama'
        />
        <text style={styles.label}>NIM</text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeNumber}
          placeholder="NIM"
        />
        <text style={styles.label}>Kelas</text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeNumber}
          placeholder="Kelas"
        />
         <View style={styles.button}>
          <Button
          title="Save"
        />
         </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderColor: 'white',
    color: 'white',
  },
  inputTitle:{
    marginLeft: 12,
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  label:{
    color: 'white',
    marginLeft: 12,
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    marginTop: 12,
    marginHorizontal: 12,
  }
    
});

export default TextInputExample;