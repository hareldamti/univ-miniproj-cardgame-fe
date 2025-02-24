import React from 'react';
import { useGameContext } from '../../State/GameState';
import { styles, Row, Column, Frame, genIntKey } from '../../Utils/CompUtils'
import { Hexagonal, HexType } from '../../package/Entities/Models'
import { StyleSheet, View, Text, Button, } from 'react-native';

export default () => {
    const {gameState, dispatch} = useGameContext();
    return <View style={styles.floatingWindow}>
        hello
    </View>

}