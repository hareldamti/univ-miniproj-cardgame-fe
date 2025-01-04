import { StyleSheet, View, Text, Button, } from 'react-native';
import { PropsWithChildren } from 'react'

interface Span {
  span: number
}

let frameKey = 0;

export const Row = (props: PropsWithChildren<Span>): React.JSX.Element => {frameKey += 1;
    return <View key={frameKey} style={{...styles.row, ...{flex: props.span}}} >{props.children}</View>; }

export const Column = (props: PropsWithChildren<Span>): React.JSX.Element => {frameKey += 1;
return <View key={frameKey} style={{...styles.col, ...{flex: props.span, borderColor: "black", borderWidth: 1}}} >{props.children}</View>; }

export const Frame = (props: PropsWithChildren): React.JSX.Element => {frameKey += 1; return <View key={frameKey} style={styles.frame}>{props.children}</View>; }

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: "auto",
      width: '100%',
      height: '100%'
    },
    row: {flexDirection: 'row', width:'100%', display: 'flex', paddingVertical: 1},
    col: {display: 'flex', height:'100%', paddingHorizontal: 1},
    circle: {
      width: 100,
      height: 100,
      borderRadius: '50%',
      backgroundColor: "red",
    },
    rectangle: {
      width: 100 * 2,
      height: 100,
      backgroundColor: "red",
    },
    frame: {
      display: 'flex',
      borderColor: "black",
      width:'100%',
      height: '100%',
      borderWidth: 1,
    }
  
  });
  
