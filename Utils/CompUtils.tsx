import { StyleSheet, View, Text, Button, GestureResponderEvent, PressableProps, } from 'react-native';
import { PropsWithChildren } from 'react'
import { HexType } from '../package/Entities/Models';

interface Span {
  span: number,
}

let frameKey = 0;
export const genIntKey = () => { frameKey+=1; return frameKey; }

export const Row = (props: PropsWithChildren<Span>): React.JSX.Element => <View style={{...styles.row, ...{flex: props.span}}} >{props.children}</View>;

export const Column = (props: PropsWithChildren<Span>): React.JSX.Element => <View style={{...styles.col, ...{flex: props.span, borderColor: "black", borderWidth: 1}}} >{props.children}</View>;

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
    },
    textHeader: {

    },
    floatingWindow: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      borderColor: 'red',
      borderWidth: 5,
      zIndex: 1,
      width: '80%',
      height: '80%',
      borderRadius: '5%'
    },
    input: {
      height: 40,
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

export const markedHexColor = "#dfb5ff"