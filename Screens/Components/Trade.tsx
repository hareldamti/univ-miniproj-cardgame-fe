import React, { useState } from 'react';
import { useGameContext } from '../../State/GameState';
import { styles, Row, Column, Frame, genIntKey, colorByPlayer } from '../../Utils/CompUtils'
import { Hexagonal, HexType, Resources } from '../../package/Entities/Models'
import { StyleSheet, View, Text, Button, TextInput, Pressable, } from 'react-native';
import { subtractResources, zeroCost } from '../../package/Logic/GameUtils';
import { useAppContext } from '../../State/AppState';
import { SocketTags } from '../../package/Consts';
import { PlayerAction, PlayerActionType } from '../../package/Entities/PlayerActions';

export default (props: {tradeOpen: boolean, setTradeOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {
    const appState = useAppContext();
    const {gameState, dispatch} = useGameContext();
    const [offeredUser, setOfferedUser] = useState<number>(-1);
    const [tradeOffer, setTradeOffer] = useState<Resources>(zeroCost);
    return <>
    {props.tradeOpen && <View style={styles.floatingTradeWindow}>
        <Row span={1}><Text style={styles.textBoldHeader}>Send a trade offer</Text></Row>
        <Row span={1}>
            <Text style={styles.textHeader}>Send the offer to:</Text>
        </Row>
        <Row span={2}>
            {gameState.players.filter(player => player.id != gameState.user.playerId).map(player => 
                <Column span={1}>
                    <Pressable style={{justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%'}} onPress={()=>setOfferedUser(player.id)}>
                    <View style={{justifyContent: 'center', width: '90%', height: '90%', backgroundColor: colorByPlayer(player.id), borderWidth: player.id == offeredUser ? 5 : 0}}>
                    <Text style={styles.textHeader}>
                    {player.username}
                </Text></View></Pressable>
                </Column>
            )}
        </Row>
        <Row span={1}>
            <Text style={styles.textHeader}>Request:</Text>
        </Row>
        <Row span={2}>
            <Column span={1}>
                <Row span={1}><Text style={styles.text}>Lumber</Text></Row>
                <Row span={1}><TextInput value={`${tradeOffer.lumber < 0 ? -tradeOffer.lumber : 0}`} style={styles.input} keyboardType="numeric" onChangeText={value => `${parseInt(value)}` === value && setTradeOffer({...tradeOffer, lumber: -parseInt(value)})}/></Row>
            </Column>
            <Column span={1}>
                <Row span={1}><Text style={styles.text}>Brick</Text></Row>
                <Row span={1}><TextInput value={`${tradeOffer.brick < 0 ? -tradeOffer.brick : 0}`} style={styles.input} keyboardType="numeric" onChangeText={value => `${parseInt(value)}` === value && setTradeOffer({...tradeOffer, brick: -parseInt(value)})}/></Row>
            </Column>
            <Column span={1}>
                <Row span={1}><Text style={styles.text}>Ore</Text></Row>
                <Row span={1}><TextInput value={`${tradeOffer.ore < 0 ? -tradeOffer.ore : 0}`} style={styles.input} keyboardType="numeric" onChangeText={value => `${parseInt(value)}` === value && setTradeOffer({...tradeOffer, ore: -parseInt(value)})}/></Row>
            </Column>
            <Column span={1}>
                <Row span={1}><Text style={styles.text}>Grain</Text></Row>
                <Row span={1}><TextInput value={`${tradeOffer.grain < 0 ? -tradeOffer.grain : 0}`} style={styles.input} keyboardType="numeric" onChangeText={value => `${parseInt(value)}` === value && setTradeOffer({...tradeOffer, grain: -parseInt(value)})}/></Row>
            </Column>
            <Column span={1}>
                <Row span={1}><Text style={styles.text}>Wool</Text></Row>
                <Row span={1}><TextInput value={`${tradeOffer.wool < 0 ? -tradeOffer.wool : 0}`} style={styles.input} keyboardType="numeric" onChangeText={value => `${parseInt(value)}` === value && setTradeOffer({...tradeOffer, wool: -parseInt(value)})}/></Row>
            </Column>
        </Row>
        <Row span={1}>
            <Text style={styles.textHeader}>Offer:</Text>
        </Row>
        <Row span={2}>
        <Column span={1}>
                <Row span={1}><Text style={styles.text}>Lumber</Text></Row>
                <Row span={1}><TextInput value={`${tradeOffer.lumber > 0 ? tradeOffer.lumber : 0}`} style={styles.input} keyboardType="numeric" onChangeText={value => `${parseInt(value)}` === value && setTradeOffer({...tradeOffer, lumber: parseInt(value)})}/></Row>
            </Column>
            <Column span={1}>
                <Row span={1}><Text style={styles.text}>Brick</Text></Row>
                <Row span={1}><TextInput value={`${tradeOffer.brick > 0 ? tradeOffer.brick : 0}`} style={styles.input} keyboardType="numeric" onChangeText={value => `${parseInt(value)}` === value && setTradeOffer({...tradeOffer, brick: parseInt(value)})}/></Row>
            </Column>
            <Column span={1}>
                <Row span={1}><Text style={styles.text}>Ore</Text></Row>
                <Row span={1}><TextInput value={`${tradeOffer.ore > 0 ? tradeOffer.ore : 0}`} style={styles.input} keyboardType="numeric" onChangeText={value => `${parseInt(value)}` === value && setTradeOffer({...tradeOffer, ore: parseInt(value)})}/></Row>
            </Column>
            <Column span={1}>
                <Row span={1}><Text style={styles.text}>Grain</Text></Row>
                <Row span={1}><TextInput value={`${tradeOffer.grain > 0 ? tradeOffer.grain : 0}`} style={styles.input} keyboardType="numeric" onChangeText={value => `${parseInt(value)}` === value && setTradeOffer({...tradeOffer, grain: parseInt(value)})}/></Row>
            </Column>
            <Column span={1}>
                <Row span={1}><Text style={styles.text}>Wool</Text></Row>
                <Row span={1}><TextInput value={`${tradeOffer.wool > 0 ? tradeOffer.wool : 0}`} style={styles.input} keyboardType="numeric" onChangeText={value => `${parseInt(value)}` === value && setTradeOffer({...tradeOffer, wool: parseInt(value)})}/></Row>
            </Column>
        </Row>
        <Row span={2}>
            <Column span={1}>
            <Button
                title="Submit request"
                onPress={() => {
                    appState.socketHandler?.socket.emit(SocketTags.ACTION, {type: PlayerActionType.OfferTrade, trade: {offeredById: gameState.user.playerId, offeredToId: offeredUser, tradeDelta: tradeOffer}});
                    setTradeOffer(zeroCost); setOfferedUser(-1); props.setTradeOpen(false);
                }}/>
            </Column>
            <Column span={1}>
            <Button
                title="Cancel"
                onPress={() => {setTradeOffer(zeroCost); setOfferedUser(-1); props.setTradeOpen(false)}}/>
            </Column>
        </Row>
    </View>}
    {gameState.openTrades.filter(trade => trade.offeredById == gameState.user.playerId).map(trade =>
        <View style={styles.floatingAcceptTradeWindow}>
            <Row span={1}><Text style={styles.textBoldHeader}>Waiting for {gameState.players[trade.offeredToId].username} on:</Text></Row>
            <Row span={1}>
            <Text style={styles.textHeader}>You get:</Text>
            </Row>
            <Row span={1}>
            {tradeOffer.lumber < 0 && <Column span={1}>
                <Row span={1}><Text style={styles.text}>Lumber</Text></Row>
                <Row span={1}><Text style={styles.text}>{-trade.tradeDelta.lumber}</Text></Row>
            </Column>}
            {trade.tradeDelta.brick < 0 && <Column span={1}>
                <Row span={1}><Text style={styles.text}>Brick</Text></Row>
                <Row span={1}><Text style={styles.text}>{-trade.tradeDelta.brick}</Text></Row>
            </Column>}
            {trade.tradeDelta.wool < 0 && <Column span={1}>
                <Row span={1}><Text style={styles.text}>Wool</Text></Row>
                <Row span={1}><Text style={styles.text}>{-trade.tradeDelta.wool}</Text></Row>
            </Column>}
            {trade.tradeDelta.ore < 0 && <Column span={1}>
                <Row span={1}><Text style={styles.text}>Ore</Text></Row>
                <Row span={1}><Text style={styles.text}>{-trade.tradeDelta.ore}</Text></Row>
            </Column>}
            {trade.tradeDelta.grain < 0 && <Column span={1}>
                <Row span={1}><Text style={styles.text}>Grain</Text></Row>
                <Row span={1}><Text style={styles.text}>{-trade.tradeDelta.grain}</Text></Row>
            </Column>}
        </Row>
        <Row span={1}>
            <Text style={styles.textHeader}>You give:</Text>
        </Row>
        <Row span={1}>
            {trade.tradeDelta.lumber > 0 && <Column span={1}>
                <Row span={1}><Text style={styles.text}>Lumber</Text></Row>
                <Row span={1}><Text style={styles.text}>{trade.tradeDelta.lumber}</Text></Row>
            </Column>}
            {trade.tradeDelta.brick > 0 && <Column span={1}>
                <Row span={1}><Text style={styles.text}>Brick</Text></Row>
                <Row span={1}><Text style={styles.text}>{trade.tradeDelta.brick}</Text></Row>
            </Column>}
            {trade.tradeDelta.wool > 0 && <Column span={1}>
                <Row span={1}><Text style={styles.text}>Wool</Text></Row>
                <Row span={1}><Text style={styles.text}>{trade.tradeDelta.wool}</Text></Row>
            </Column>}
            {trade.tradeDelta.ore > 0 && <Column span={1}>
                <Row span={1}><Text style={styles.text}>Ore</Text></Row>
                <Row span={1}><Text style={styles.text}>{trade.tradeDelta.ore}</Text></Row>
            </Column>}
            {trade.tradeDelta.grain > 0 && <Column span={1}>
                <Row span={1}><Text style={styles.text}>Grain</Text></Row>
                <Row span={1}><Text style={styles.text}>{trade.tradeDelta.grain}</Text></Row>
            </Column>}
        </Row>
        <Row span={2}>
            <Button
                title="Cancel"
                onPress={() => appState.socketHandler?.socket.emit(SocketTags.ACTION, {type: PlayerActionType.RespondToTrade, accepted: false})}/>
        </Row>
        </View>
    )}
    {gameState.openTrades.filter(trade => trade.offeredToId == gameState.user.playerId).map(trade =>
        <View style={styles.floatingAcceptTradeWindow}>
            <Row span={1}><Text style={styles.textBoldHeader}>{gameState.players[trade.offeredById].username} wants to trade</Text></Row>
            <Row span={1}>
            <Text style={styles.textHeader}>You give:</Text>
            </Row>
            <Row span={1}>
            {tradeOffer.lumber < 0 && <Column span={1}>
                <Row span={1}><Text style={styles.text}>Lumber</Text></Row>
                <Row span={1}><Text style={styles.text}>{-trade.tradeDelta.lumber}</Text></Row>
            </Column>}
            {trade.tradeDelta.brick < 0 && <Column span={1}>
                <Row span={1}><Text style={styles.text}>Brick</Text></Row>
                <Row span={1}><Text style={styles.text}>{-trade.tradeDelta.brick}</Text></Row>
            </Column>}
            {trade.tradeDelta.wool < 0 && <Column span={1}>
                <Row span={1}><Text style={styles.text}>Wool</Text></Row>
                <Row span={1}><Text style={styles.text}>{-trade.tradeDelta.wool}</Text></Row>
            </Column>}
            {trade.tradeDelta.ore < 0 && <Column span={1}>
                <Row span={1}><Text style={styles.text}>Ore</Text></Row>
                <Row span={1}><Text style={styles.text}>{-trade.tradeDelta.ore}</Text></Row>
            </Column>}
            {trade.tradeDelta.grain < 0 && <Column span={1}>
                <Row span={1}><Text style={styles.text}>Grain</Text></Row>
                <Row span={1}><Text style={styles.text}>{-trade.tradeDelta.grain}</Text></Row>
            </Column>}
        </Row>
        <Row span={1}>
            <Text style={styles.textHeader}>You get:</Text>
        </Row>
        <Row span={1}>
            {trade.tradeDelta.lumber > 0 && <Column span={1}>
                <Row span={1}><Text style={styles.text}>Lumber</Text></Row>
                <Row span={1}><Text style={styles.text}>{trade.tradeDelta.lumber}</Text></Row>
            </Column>}
            {trade.tradeDelta.brick > 0 && <Column span={1}>
                <Row span={1}><Text style={styles.text}>Brick</Text></Row>
                <Row span={1}><Text style={styles.text}>{trade.tradeDelta.brick}</Text></Row>
            </Column>}
            {trade.tradeDelta.wool > 0 && <Column span={1}>
                <Row span={1}><Text style={styles.text}>Wool</Text></Row>
                <Row span={1}><Text style={styles.text}>{trade.tradeDelta.wool}</Text></Row>
            </Column>}
            {trade.tradeDelta.ore > 0 && <Column span={1}>
                <Row span={1}><Text style={styles.text}>Ore</Text></Row>
                <Row span={1}><Text style={styles.text}>{trade.tradeDelta.ore}</Text></Row>
            </Column>}
            {trade.tradeDelta.grain > 0 && <Column span={1}>
                <Row span={1}><Text style={styles.text}>Grain</Text></Row>
                <Row span={1}><Text style={styles.text}>{trade.tradeDelta.grain}</Text></Row>
            </Column>}
        </Row>
        <Row span={2}>
            <Column span={1}>
            <Button
                title="Accept"
                onPress={() => appState.socketHandler?.socket.emit(SocketTags.ACTION, {type: PlayerActionType.RespondToTrade, accepted: true})}/>
            </Column>
            <Column span={1}>
            <Button
                title="Decline"
                onPress={() => appState.socketHandler?.socket.emit(SocketTags.ACTION, {type: PlayerActionType.RespondToTrade, accepted: false})}/>
            </Column>
        </Row>
        </View>
    )}
    </>

}