import { useContext, useState } from 'react';
import { useAppContext } from '../State/AppState';
import { ActionButton, Row, styles, View, Text, TextInput } from '../Utils/CompUtils';
import { Link } from 'react-router-dom';

export const Login = () => {
  const appState = useAppContext();
  const [username, setUsername] = useState<string>("");
  return (
    <View style={{...styles.container, borderRadius: '1rem', borderWidth: 1}}>
      <Row span={1}></Row>
      <Row span={2}><Text style={{...styles.textBoldHeader, color: 'black'}}>Online CATAN</Text></Row>
      <Row span={1}>
        <Text style={styles.text}>Enter player name:</Text>
        <TextInput
        style={styles.input}
        onChangeText={setUsername}
        value={username}/>
        </Row>
        <Row span={1}>
        <Link to="/lobby">
          <ActionButton
            title="Login"
            onPress={ () => { appState.username=username; } }
          />
        </Link>
      </Row>
      <Row span={1}></Row>
    </View>
  );
}

export default Login;

