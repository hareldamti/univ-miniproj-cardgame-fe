import { useContext, useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';

import { NavigatorParams } from '../Utils/Navigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppContext } from '../State/AppState';
import { styles } from '../Utils/CompUtils';

export const Login = ({ navigation }: NativeStackScreenProps<NavigatorParams, 'Login'>) => {
  const appState = useAppContext();
  const [username, setUsername] = useState<string>("");
  return (
    <View style={{...styles.container, borderRadius: '1rem', borderWidth: 1}}>
      <TextInput
      style={styles.input}
      onChangeText={setUsername}
      value={username}/>
      <Button
        title="Login"
        onPress={ () => { appState.username=username; navigation.navigate('ChooseRoom'); } }
      />
    </View>
  );
}

export default Login;

