import React from 'react';
import { useGameContext } from '../../State/GameState';
import { styles, Row, Column, Frame, genIntKey } from '../../Utils/CompUtils'
import { Hexagonal, HexType } from '../../package/Entities/Models'
import { StyleSheet, View, Text, Button, } from 'react-native';
import { colorByPlayer } from '../../Utils/DesignUtils';

export default () => {
    const {gameState, dispatch} = useGameContext();
    return <>
        {gameState.players.map(player => 
            <Row span={1} key={genIntKey()}>
                {Object.entries(gameState.players[gameState.user.playerIdx].Resources).map(entry => {
                    let [resource, amount] = entry;
                    return <Column span={1} key={genIntKey()}>
                        <Text style={{...styles.textHeader, margin: 'auto', color: colorByPlayer(player.id)}}>
                        {resource}: {amount}
                    </Text>
                    </Column>
                })}
            </Row>
        )}
    </>
}