import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useAppContext } from '../State/AppState';

export default function ChooseRoom() {
  const appState = useAppContext();
  return (
    <View style={styles.container}>
      <StatusBar style="auto" hidden/>
      <Text> ChooseRooms {appState.userId}</Text>
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
