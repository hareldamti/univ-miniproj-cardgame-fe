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
            <Column span={1} key={genIntKey()}> 
                <Frame>
                    <Text style={{...styles.textHeader, margin: 'auto', color: colorByPlayer(player.id)}}>
                        {player.username}: {player.score}
                    </Text>
                </Frame>
            </Column>
        )}
    </>
}