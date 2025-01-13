import React from 'react';
import { useGameContext } from '../../State/GameState';
import { styles, Row, Column, Frame, genIntKey } from '../../Utils/CompUtils'
import { Hexagonal, HexType } from '../../package/entities/Models'
import { StyleSheet, View, Text, Button, } from 'react-native';

export default () => {
    const {state, dispatch} = useGameContext();
    console.log("scoring",state.scoringTable);
    return <>
        {Object.entries(state.scoringTable).map(([username, score]) => 
            <Column span={1}>
                <Frame>
                    <Text style={{...styles.textHeader, margin: 'auto'}}>
                        {username}: {score}
                    </Text>
                </Frame>
            </Column>
        )}
    </>
}