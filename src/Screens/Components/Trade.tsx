import React, { useState } from 'react';
import { useGameContext } from '../../State/GameState';
import { styles, Row, Column, Frame, genIntKey, colorByPlayer, View, Text, ActionButton } from '../../Utils/CompUtils'
import { Hexagonal, HexType, Resources } from '../../package/Entities/Models'

import { addResources, Brick, canBuy, Grain, Lumber, multiplyResources, negateResources, Ore, subtractResources, Wool, zeroCost } from '../../package/Logic/GameUtils';
import { useAppContext } from '../../State/AppState';
import { BankTradePlayerId, SocketTags } from '../../package/Consts';
import { PlayerAction, PlayerActionType } from '../../package/Entities/PlayerActions';

export default (props: {tradeOpen: boolean, setTradeOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {
    const appState = useAppContext();
    const {gameState, dispatch} = useGameContext();
    const [offeredUser, setOfferedUser] = useState<number>(-1);
    const [tradeOffer, setTradeOffer] = useState<Resources>(zeroCost);
    const [bankGive, setBankGive] = useState<Resources>(zeroCost);
    const [bankGet, setBankGet] = useState<Resources>(zeroCost);
    return <>
    {props.tradeOpen && <View style={styles.floatingTradeWindow}>
        <Row span={1}><Text style={styles.textBoldHeader}>Send a trade offer</Text></Row>
        <Row span={1}>
            <Text style={styles.textHeader}>Send the offer to:</Text>
        </Row>
        <Row span={2}>
            <Column>
                <ActionButton full title={`Bank`} color={ BankTradePlayerId == offeredUser ? 'black' : colorByPlayer(BankTradePlayerId)} onPress={()=>setOfferedUser(BankTradePlayerId)}/>
            </Column>
            {gameState.players.filter(player => player.id != gameState.user.playerId).map(player => 
                <Column>
                    <ActionButton full title={`${player.username}`} color={ player.id == offeredUser ? 'black' : colorByPlayer(player.id)} onPress={()=>setOfferedUser(player.id)}/>
                </Column>
            )}
        </Row>
        
        { (offeredUser != BankTradePlayerId) && <>
        <Row span={1}>
            <Text style={styles.textHeader}>Request:</Text>
        </Row>
        <Row span={2}>
        {[
                {resource: Lumber, label: "lumber"},
                {resource: Brick, label: "brick"},
                {resource: Wool, label: "wool"},
                {resource: Ore, label: "ore"},
                {resource: Grain, label: "grain"},
              ].map(
                r => <Column span={1}>
                <Row>
                    <Text style={styles.text}>{r.label}</Text>
                </Row>
                <Row>
                    <ActionButton
                        color="green"
                        title="↑"
                        onPress={()=>setTradeOffer(tradeOffer => subtractResources(tradeOffer, r.resource))}
                    />
                </Row>
                <Row>
                    <ActionButton
                        color="red"
                        title="↓"
                        onPress={()=>setTradeOffer(tradeOffer => addResources(tradeOffer, r.resource))}
                    />
                </Row>
            </Column>
              )}
        </Row>
        <Row span={1}>
            <Text style={styles.textHeader}>You give:</Text>
        </Row>
        <Row span={1}>
            {tradeOffer.lumber > 0 && <Column span={1}>
                <Row span={1}><Text style={styles.text}>Lumber</Text></Row>
                <Row span={1}><Text style={styles.text}>{tradeOffer.lumber}</Text></Row>
            </Column>}
            {tradeOffer.brick > 0 && <Column span={1}>
                <Row span={1}><Text style={styles.text}>Brick</Text></Row>
                <Row span={1}><Text style={styles.text}>{tradeOffer.brick}</Text></Row>
            </Column>}
            {tradeOffer.wool > 0 && <Column span={1}>
                <Row span={1}><Text style={styles.text}>Wool</Text></Row>
                <Row span={1}><Text style={styles.text}>{tradeOffer.wool}</Text></Row>
            </Column>}
            {tradeOffer.ore > 0 && <Column span={1}>
                <Row span={1}><Text style={styles.text}>Ore</Text></Row>
                <Row span={1}><Text style={styles.text}>{tradeOffer.ore}</Text></Row>
            </Column>}
            {tradeOffer.grain > 0 && <Column span={1}>
                <Row span={1}><Text style={styles.text}>Grain</Text></Row>
                <Row span={1}><Text style={styles.text}>{tradeOffer.grain}</Text></Row>
            </Column>}
        </Row>
        <Row span={1}>
            <Text style={styles.textHeader}>You get:</Text>
        </Row>
        <Row span={1}>
            {tradeOffer.lumber < 0 && <Column span={1}>
                <Row span={1}><Text style={styles.text}>Lumber</Text></Row>
                <Row span={1}><Text style={styles.text}>{-tradeOffer.lumber}</Text></Row>
            </Column>}
            {tradeOffer.brick < 0 && <Column span={1}>
                <Row span={1}><Text style={styles.text}>Brick</Text></Row>
                <Row span={1}><Text style={styles.text}>{-tradeOffer.brick}</Text></Row>
            </Column>}
            {tradeOffer.wool < 0 && <Column span={1}>
                <Row span={1}><Text style={styles.text}>Wool</Text></Row>
                <Row span={1}><Text style={styles.text}>{-tradeOffer.wool}</Text></Row>
            </Column>}
            {tradeOffer.ore < 0 && <Column span={1}>
                <Row span={1}><Text style={styles.text}>Ore</Text></Row>
                <Row span={1}><Text style={styles.text}>{-tradeOffer.ore}</Text></Row>
            </Column>}
            {tradeOffer.grain < 0 && <Column span={1}>
                <Row span={1}><Text style={styles.text}>Grain</Text></Row>
                <Row span={1}><Text style={styles.text}>{-tradeOffer.grain}</Text></Row>
            </Column>}
        </Row>
        <Row span={2}>
        <Column span={1}>
        <ActionButton
            title="Submit request"
            disabled={!canBuy(gameState, gameState.user.playerId, tradeOffer) && (offeredUser != -1)}
            onPress={() => {
                if (offeredUser == -1) return;
                appState.socketHandler?.socket.emit(SocketTags.ACTION, {type: PlayerActionType.OfferTrade, trade: {offeredById: gameState.user.playerId, offeredToId: offeredUser, tradeDelta: tradeOffer}});
                setTradeOffer(zeroCost); setOfferedUser(-1); props.setTradeOpen(false);
            }}/>
        </Column>
        <Column span={1}>
        <ActionButton
            title="Cancel"
            onPress={() => {setTradeOffer(zeroCost); setOfferedUser(-1); props.setTradeOpen(false)}}/>
        </Column>
        </Row>
        </>}

        { (offeredUser == BankTradePlayerId) && <>
            <Row span={1}>
                <Text style={styles.textHeader}>Give to the bank:</Text>
            </Row>
            <Row span={2}>
            {[
                    {resource: Lumber, label: "lumber", ratio: 4},
                    {resource: Brick, label: "brick", ratio: 4},
                    {resource: Wool, label: "wool", ratio: 4},
                    {resource: Ore, label: "ore", ratio: 4},
                    {resource: Grain, label: "grain", ratio: 4},
                ].map(
                    r => <Column span={1}>
                        <ActionButton
                            title={`${r.ratio} ${r.label}`}
                            onPress={()=>setBankGive(multiplyResources(r.resource, r.ratio))}
                        />
                </Column>
                )}
            </Row>
            <Row span={1}>
                <Text style={styles.textHeader}>Take from the bank:</Text>
            </Row>
            <Row span={2}>
            {[
                    {resource: Lumber, label: "lumber"},
                    {resource: Brick, label: "brick"},
                    {resource: Wool, label: "wool"},
                    {resource: Ore, label: "ore"},
                    {resource: Grain, label: "grain"},
                ].map(
                    r => <Column span={1}>
                        <ActionButton
                            title={`${r.label}`}
                            onPress={()=>setBankGet(r.resource)}
                        />
                </Column>
                )}
            </Row>
            <Row span={1}>
            <Text style={styles.textHeader}>You give:</Text>
        </Row>
        <Row span={1}>
            {bankGive.lumber > 0 && <Column span={1}>
                <Row span={1}><Text style={styles.text}>Lumber</Text></Row>
                <Row span={1}><Text style={styles.text}>{bankGive.lumber}</Text></Row>
            </Column>}
            {bankGive.brick > 0 && <Column span={1}>
                <Row span={1}><Text style={styles.text}>Brick</Text></Row>
                <Row span={1}><Text style={styles.text}>{bankGive.brick}</Text></Row>
            </Column>}
            {bankGive.wool > 0 && <Column span={1}>
                <Row span={1}><Text style={styles.text}>Wool</Text></Row>
                <Row span={1}><Text style={styles.text}>{bankGive.wool}</Text></Row>
            </Column>}
            {bankGive.ore > 0 && <Column span={1}>
                <Row span={1}><Text style={styles.text}>Ore</Text></Row>
                <Row span={1}><Text style={styles.text}>{bankGive.ore}</Text></Row>
            </Column>}
            {bankGive.grain > 0 && <Column span={1}>
                <Row span={1}><Text style={styles.text}>Grain</Text></Row>
                <Row span={1}><Text style={styles.text}>{bankGive.grain}</Text></Row>
            </Column>}
        </Row>
        <Row span={1}>
            <Text style={styles.textHeader}>You get:</Text>
        </Row>
        <Row span={1}>
            {bankGet.lumber > 0 && <Column span={1}>
                <Row span={1}><Text style={styles.text}>Lumber</Text></Row>
                <Row span={1}><Text style={styles.text}>{bankGet.lumber}</Text></Row>
            </Column>}
            {bankGet.brick > 0 && <Column span={1}>
                <Row span={1}><Text style={styles.text}>Brick</Text></Row>
                <Row span={1}><Text style={styles.text}>{bankGet.brick}</Text></Row>
            </Column>}
            {bankGet.wool > 0 && <Column span={1}>
                <Row span={1}><Text style={styles.text}>Wool</Text></Row>
                <Row span={1}><Text style={styles.text}>{bankGet.wool}</Text></Row>
            </Column>}
            {bankGet.ore > 0 && <Column span={1}>
                <Row span={1}><Text style={styles.text}>Ore</Text></Row>
                <Row span={1}><Text style={styles.text}>{bankGet.ore}</Text></Row>
            </Column>}
            {bankGet.grain > 0 && <Column span={1}>
                <Row span={1}><Text style={styles.text}>Grain</Text></Row>
                <Row span={1}><Text style={styles.text}>{bankGet.grain}</Text></Row>
            </Column>}
        </Row>
        <Row span={2}>
        <Column span={1}>
        <ActionButton
            title="Submit request"
            disabled={!canBuy(gameState, gameState.user.playerId, tradeOffer)}
            onPress={() => {
                appState.socketHandler?.socket.emit(SocketTags.ACTION, {type: PlayerActionType.OfferTrade, trade: {offeredById: gameState.user.playerId, offeredToId: offeredUser, tradeDelta: subtractResources(bankGive, bankGet)}});
                setTradeOffer(zeroCost); setOfferedUser(-1); props.setTradeOpen(false);
            }}/>
        </Column>
        <Column span={1}>
        <ActionButton
            title="Cancel"
            onPress={() => {setTradeOffer(zeroCost); setOfferedUser(-1); props.setTradeOpen(false)}}/>
        </Column>
        </Row>
        </>
        }

        
    </View>}
    {gameState.openTrades.filter(trade => trade.offeredById == gameState.user.playerId).map(trade =>
        <View style={styles.floatingAcceptTradeWindow}>
            <Row span={1}><Text style={styles.textBoldHeader}>Waiting for {gameState.players[trade.offeredToId].username} on:</Text></Row>
            <Row span={1}>
            <Text style={styles.textHeader}>You get:</Text>
            </Row>
            <Row span={1}>
            {trade.tradeDelta.lumber < 0 && <Column span={1}>
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
            <ActionButton
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
            {trade.tradeDelta.lumber < 0 && <Column span={1}>
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
            <ActionButton
                title="Accept"
                disabled={!canBuy(gameState, gameState.user.playerId, negateResources(trade.tradeDelta))}
                onPress={() => appState.socketHandler?.socket.emit(SocketTags.ACTION, {type: PlayerActionType.RespondToTrade, accepted: true})}/>
            </Column>
            <Column span={1}>
            <ActionButton
                title="Decline"
                onPress={() => appState.socketHandler?.socket.emit(SocketTags.ACTION, {type: PlayerActionType.RespondToTrade, accepted: false})}/>
            </Column>
        </Row>
        </View>
    )}
    </>

}