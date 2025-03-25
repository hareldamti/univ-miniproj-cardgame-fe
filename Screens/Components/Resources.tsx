import React from 'react';
import { useGameContext } from '../../State/GameState';
import { styles, Row, Column, Frame, genIntKey, colorByPlayer } from '../../Utils/CompUtils'
import { Hexagonal, HexType } from '../../package/Entities/Models'
import { StyleSheet, View, Text, Button, } from 'react-native';

export default () => {
    const {gameState, dispatch} = useGameContext();
    return <>
        {
            Object.entries(gameState.players[gameState.user.playerId]?.Resources ?? {}).map(entry => {
                let [resource, amount] = entry;
                return <Column span={1} key={genIntKey()}>
                    <Text style={{...styles.textHeader, margin: 'auto', color: colorByPlayer(gameState.user.playerId)}}>
                    {resource}: {amount}
                </Text>
                </Column>
            })
        }
    </>
}