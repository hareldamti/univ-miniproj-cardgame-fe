import { AppContext } from './State/AppState';
import Navigator from './Utils/Navigator';
import { StyleSheet, Text, View, Button } from 'react-native';


export default function App() {
  return (
    <AppContext.Provider value={{userId: null, roomId: null}}>
      <Navigator/>
    </AppContext.Provider>
  );
}