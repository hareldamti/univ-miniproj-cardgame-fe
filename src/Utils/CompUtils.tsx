import { PropsWithChildren } from "react";
import { HexType } from "../package/Entities/Models";

interface Span {
  span?: number;
  backgroundColor?: string;
  border?: number;
}

let frameKey = 0;
export const genIntKey = () => {
  frameKey += 1;
  return frameKey;
};

export const View = (
  props: PropsWithChildren<{ style?: React.CSSProperties }>
): React.JSX.Element => <div style={props.style}>{props.children}</div>;

export const Pressable = (
  props: PropsWithChildren<{ style?: React.CSSProperties, onPress: React.MouseEventHandler }>
): React.JSX.Element => <div style={props.style} onClick={props.onPress}>{props.children}</div>;

export const Text = (
  props: PropsWithChildren<{ style?: React.CSSProperties }>
): React.JSX.Element => <div style={props.style}>{props.children}</div>;

export const TextInput = (
  props: PropsWithChildren<{ style?: React.CSSProperties, onChangeText: (newText: string) => void, value: string }>
): React.JSX.Element => <input type="text" style={props.style} value={props.value} onChange={e => props.onChangeText(e.target.value)}></input>;

export const Row = (props: PropsWithChildren<Span>): React.JSX.Element => (
  <View
    style={{
      ...styles.row,
      flexWrap: "wrap",
      flex: props.span ?? 1,
      borderWidth: props.border,
      borderRadius: 10,
      backgroundColor: props.backgroundColor,
    }}
  >
    {props.children}
  </View>
);

export const Column = (props: PropsWithChildren<Span>): React.JSX.Element => (
  <View
    style={{
      ...styles.col,
      flex: props.span ?? 1,
      borderWidth: props.border,
      borderRadius: 10,
      backgroundColor: props.backgroundColor,
    }}
  >
    {props.children}
  </View>
);

export const Frame = (
  props: PropsWithChildren<{ style?: React.CSSProperties }>
): React.JSX.Element => (
  <View style={{ ...styles.frame, ...(props.style ?? {}) }}>
    {props.children}
  </View>
);

export const ActionButton = (props: { color?: string, title: string, onPress: React.MouseEventHandler } ) => {
  return <button style={{...styles.button, backgroundColor: props.color ?? "#2ec0e8"}} onClick={props.onPress} >{props.title}</button>;
};

export interface PressableSvg {
  onPress?: React.MouseEventHandler;
  x?: number;
  y?: number;
  color?: string;
  theta?: number;
  scale?: number;
  number?: number;
}

export interface PageProps {
  setPage: React.Dispatch<React.SetStateAction<string>>
}

export const styles: Record<string, React.CSSProperties> = {
  container: {
    height:"100%",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
  },
  button: {
    color: "white",
    border: 0,
    padding: "7px 15px 7px 15px"
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
    width: "100%",
    display: "flex",
    paddingTop: 1, //
    paddingBottom: 1, //
  },
  col: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
    paddingLeft: 1, //
    paddingRight: 1, //
  },
  frame: {
    display: "block",
    width: "100%",
    height: "100%",
  },
  text: {
    fontSize: 20,
    fontWeight: "600",
  },
  textHeader: {
    fontSize: 20,
    color: "white",
    fontWeight: "700",
    textAlign: "center",
    alignContent: "center", //
  },
  textBoldHeader: {
    fontSize: 25,
    color: "white",
    fontWeight: "800",
  },
  floatingTradeWindow: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    borderColor: "black",
    borderWidth: 5,
    backgroundColor: "#a3887a",
    zIndex: 1,
    width: "90%",
    height: "70%",
    borderRadius: 40,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "auto", //
    marginRight: "auto", //
  },
  floatingAcceptTradeWindow: {
    position: "absolute",
    top: "60%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    borderColor: "black",
    borderWidth: 5,
    backgroundColor: "#a3887a",
    zIndex: 1,
    width: "40%",
    height: "45%",
    borderRadius: 20,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "auto", //
    marginRight: "auto", //
  },
  input: {
    height: 20,
    width: 100,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  svg: {
    width: "100%",
    height: "100%",
    maxWidth: "100%",
    maxHeight: "100%"
  }
};

export const colorByPlayer = (i?: number) => {
  switch (i) {
    case 0:
      return "#0048ff";
    case 1:
      return "#00d420";
    case 2:
      return "#c4321b";
    case 3:
      return "#0a0121";
    default:
      return "";
  }
};

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
