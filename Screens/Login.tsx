import { useContext } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

import { NavigatorParams } from '../Utils/Navigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppContext } from '../State/AppState';

export const Login = ({ navigation }: NativeStackScreenProps<NavigatorParams, 'Login'>) => {
  const appState = useAppContext();

  return (
    <View style={styles.container}>
      <Text> Login </Text>
      <Button
        title="Login"
        onPress={() => { appState.userId="12"; navigation.navigate('ChooseRoom');}}
      />
    </View>
  );
}

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
