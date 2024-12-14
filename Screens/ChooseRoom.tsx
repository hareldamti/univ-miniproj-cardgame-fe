import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { useAppContext } from '../State/AppState';

import { NavigatorParams } from '../Utils/Navigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export default function ChooseRoom({ navigation }: NativeStackScreenProps<NavigatorParams, 'ChooseRoom'>) {
  const appState = useAppContext();
  return (
    <View style={styles.container}>
      <StatusBar style="auto" hidden/>
      <Text> ChooseRooms {appState.userId}</Text>
      <Button
              title="Login"
              onPress={() => { appState.userId="12"; navigation.navigate('Match');}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
