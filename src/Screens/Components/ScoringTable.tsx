import React from 'react';
import { useGameContext } from '../../State/GameState';
import { styles, Row, Column, Frame, genIntKey, colorByPlayer, currentUserBackgroundColor, Text } from '../../Utils/CompUtils'
import { Hexagonal, HexType } from '../../package/Entities/Models'

import { getCurrentPlayer } from '../../package/Entities/State';

export default () => {
    const {gameState, dispatch} = useGameContext();
    return <>
        {gameState.players.map(player => 
            <Column span={1} key={genIntKey()}> 
                <Frame style={{backgroundColor: player.id == getCurrentPlayer(gameState) ? currentUserBackgroundColor : 'white'}}>
                    <Text style={{...styles.textHeader, margin: 'auto', color: colorByPlayer(player.id)}}>
                        {player.username}: {player.score}
                    </Text>
                </Frame>
            </Column>
        )}
    </>
}
