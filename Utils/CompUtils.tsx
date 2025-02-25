import { StyleSheet, View, Text, Button, GestureResponderEvent, PressableProps, } from 'react-native';
import { PropsWithChildren } from 'react'
import { HexType } from '../package/Entities/Models';

interface Span {
  span: number,
  backgroundColor?: string
  border?: number
}

let frameKey = 0;
export const genIntKey = () => { frameKey+=1; return frameKey; }

export const Row = (props: PropsWithChildren<Span>): React.JSX.Element => <View style={{...styles.row, flex: props.span, borderWidth: props.border, borderRadius: 10, backgroundColor: props.backgroundColor}} >{props.children}</View>;

export const Column = (props: PropsWithChildren<Span>): React.JSX.Element => <View style={{...styles.col, flex: props.span, borderWidth: props.border, borderRadius: 10, backgroundColor: props.backgroundColor}} >{props.children}</View>;

export const Frame = (props: PropsWithChildren<{style?}>): React.JSX.Element => <View style={{...styles.frame, ...(props.style ?? {})}}>{props.children}</View>;

export interface PressableSvg {
    onPress?: (event: GestureResponderEvent) => void
    x?: number,
    y?: number,
    color?: string,
    theta?: number,
    scale?: number,
    number?: number
}

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: "auto",
      width: '100%',
      height: '100%'
    },
    row: {flexDirection: 'row', alignItems: 'center',
      justifyContent: 'center',width:'100%', display: 'flex', paddingVertical: 1},
    col: {display: 'flex', alignItems: 'center',
      justifyContent: 'center',height:'100%', paddingHorizontal: 1},
    frame: {
      display: 'flex',
      width:'100%',
      height: '100%',
    },
    text: {
      fontSize: 20,
      fontWeight: '600',
    },
    textHeader: {
      fontSize: 20,
      color: 'white',
      fontWeight: '700',
      textAlign: 'center',
      textAlignVertical: 'center'
    },
    textBoldHeader: {
      fontSize: 25,
      color: 'white',
      fontWeight: '800'
    },
    floatingTradeWindow: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      borderColor: 'black',
      borderWidth: 5,
      backgroundColor: '#a3887a',
      zIndex: 1,
      width: '60%',
      height: '80%',
      borderRadius: 40,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: "auto",
    },
    floatingAcceptTradeWindow: {
      position: 'absolute',
      top: '60%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      borderColor: 'black',
      borderWidth: 5,
      backgroundColor: '#a3887a',
      zIndex: 1,
      width: '40%',
      height: '45%',
      borderRadius: 20,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: "auto",
    },
    input: {
      height: 20,
      width: 100,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    }
  });
  
  export const colorByPlayer = (i: number) => {
    switch(i) {
        case 0:
            return "#0048ff";
        case 1:
            return "#00d420";
        case 2:
            return "#c4321b";
        case 3:
            return "#0a0121";
    }
}

export const hexagonalToColor = (h: HexType) => {
  switch (h) {
      case HexType.Desert:
          return "#9c7f19";
      case HexType.Forest:
          return "#11b50e";
      case HexType.Hill:
          return "#a33103";
      case HexType.Mountain:
          return "#95a6c2";
      case HexType.Field:
          return "#fce19a";
      case HexType.Sea:
          return "#36aeff";
      case HexType.Pasture:
          return "#afe687";
  }
};

export const availableStuctureColor = "#999999";

export const currentUserBackgroundColor = "#a499ad";

export const markedHexColor = "#dfb5ff";

export const roomColor = "#4367de";