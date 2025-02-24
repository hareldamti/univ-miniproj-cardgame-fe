import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { styles } from '../Utils/CompUtils';

export default function LeaderBoards() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" hidden/>
      <Text> LeaderBoards </Text>
    </View>
  );
}
