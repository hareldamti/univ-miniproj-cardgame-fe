import React, { useMemo, useState } from "react";
import { useGameContext } from "../../State/GameState";
import {
  styles,
  Row,
  Column,
  Frame,
  genIntKey,
  colorByPlayer,
  View,
  Text,
  ActionButton,
  Pressable,
  colorByCard,
} from "../../Utils/CompUtils";
import {
  DevelopmentCard,
  Hexagonal,
  HexType,
  Resources,
  SpecialAction,
} from "../../package/Entities/Models";

import {
  addResources,
  Brick,
  canBuy,
  developmentCardCost,
  Grain,
  Lumber,
  Ore,
  subtractResources,
  Wool,
  zeroCost,
} from "../../package/Logic/GameUtils";
import { useAppContext } from "../../State/AppState";
import { SocketTags } from "../../package/Consts";
import {
  PlayerAction,
  PlayerActionType,
} from "../../package/Entities/PlayerActions";

export const DeveoplmentCard = (props: {
  card: DevelopmentCard;
  onPress: React.MouseEventHandler;
}): React.JSX.Element => (
  <View style={{...styles.card}}>
    <Column>
    <Row span={1}>
      <Text
        style={{
          ...styles.textHeader, ...styles.smallText,
          backgroundColor: colorByCard(props.card.type),
        }}
      >
        {" "}
        {props.card.name}{" "}
      </Text>
    </Row>
    <Row span={5}>
      <Text style={{...styles.text, ...styles.smallText}}>{props.card.description}</Text>
    </Row>
    <Row span={1}>
      <View style={{height:"5"}}>
      <ActionButton
        title={"Use"}
        small
        color={colorByCard(props.card.type)}
        onPress={props.onPress}
      />
      </View>
    </Row>
    </Column>
  </View>
);

export default (props: {
  developmentOpen: boolean;
  setDevelopmentOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const appState = useAppContext();
  const { gameState, dispatch } = useGameContext();
  const canBuyCard = useMemo(
    () => canBuy(gameState, gameState.user.playerId, developmentCardCost),
    [gameState]
  );
  const resourceFromBankActions = useMemo(
    () =>
      gameState.players[gameState.user.playerId]?.ActiveSpecialActions.filter(
        (action) => action == SpecialAction.ResouceFromBank
      ).length,
    [gameState]
  );
  const resourceFromPlayersActions = useMemo(
    () =>
      gameState.players[gameState.user.playerId]?.ActiveSpecialActions.filter(
        (action) => action == SpecialAction.ResourceFromPlayers
      ).length,
    [gameState]
  );
  const buildRoadsActions = useMemo(
    () =>
      gameState.players[gameState.user.playerId]?.ActiveSpecialActions.filter(
        (action) => action == SpecialAction.BuildRoad
      ).length,
    [gameState]
  );

  return (
    <>
      {props.developmentOpen && (
        <View style={styles.floatingTradeWindow}>
          <Row span={1}>
            <Text style={styles.textBoldHeader}>Development Cards</Text>
          </Row>
          <Row span={1}>
            <Text style={styles.textHeader}>My cards:</Text>
          </Row>
          <Row>
            {Object.entries(
              gameState.players[gameState.user.playerId].DevelopmentCards
            ).map((entry) => {
              const [cardIdx, card] = entry;
              return (
                <Column>
                  <DeveoplmentCard
                    card={card}
                    onPress={() =>
                      appState.socketHandler?.socket.emit(SocketTags.ACTION, {
                        type: PlayerActionType.PlayDevelopmentCard,
                        cardIdx,
                      })
                    }
                  />
                </Column>
              );
            })}
          </Row>
          {resourceFromBankActions > 0 ? (
            <>
              <Row span={1}>
                <Text style={styles.textHeader}>
                  Choose{" "}
                  {`${resourceFromBankActions} resource${
                    resourceFromBankActions > 1 ? "s" : ""
                  }`}{" "}
                  to take from the bank
                </Text>
                <Row>
                  <Column>
                    <ActionButton
                      title="Brick"
                      onPress={() =>
                        appState.socketHandler?.socket.emit(SocketTags.ACTION, {
                          type: PlayerActionType.GetResource,
                          resource: HexType.Hill,
                        })
                      }
                    />
                  </Column>
                  <Column>
                    <ActionButton
                      title="Grain"
                      onPress={() =>
                        appState.socketHandler?.socket.emit(SocketTags.ACTION, {
                          type: PlayerActionType.GetResource,
                          resource: HexType.Field,
                        })
                      }
                    />
                  </Column>
                  <Column>
                    <ActionButton
                      title="Lumber"
                      onPress={() =>
                        appState.socketHandler?.socket.emit(SocketTags.ACTION, {
                          type: PlayerActionType.GetResource,
                          resource: HexType.Forest,
                        })
                      }
                    />
                  </Column>
                  <Column>
                    <ActionButton
                      title="Ore"
                      onPress={() =>
                        appState.socketHandler?.socket.emit(SocketTags.ACTION, {
                          type: PlayerActionType.GetResource,
                          resource: HexType.Mountain,
                        })
                      }
                    />
                  </Column>
                  <Column>
                    <ActionButton
                      title="Wool"
                      onPress={() =>
                        appState.socketHandler?.socket.emit(SocketTags.ACTION, {
                          type: PlayerActionType.GetResource,
                          resource: HexType.Pasture,
                        })
                      }
                    />
                  </Column>
                </Row>
              </Row>
            </>
          ) : (
            <></>
          )}

          {resourceFromPlayersActions > 0 ? (
            <>
              <Row span={1}>
                <Text style={styles.textHeader}>
                  Choose{" "}
                  {`${resourceFromPlayersActions} resource type${
                    resourceFromPlayersActions > 1 ? "s" : ""
                  }`}{" "}
                  to steal from all the other players
                </Text>
                <Row>
                  <Column>
                    <ActionButton
                      title="Brick"
                      onPress={() =>
                        appState.socketHandler?.socket.emit(SocketTags.ACTION, {
                          type: PlayerActionType.StealResource,
                          resource: HexType.Hill,
                        })
                      }
                    />
                  </Column>
                  <Column>
                    <ActionButton
                      title="Grain"
                      onPress={() =>
                        appState.socketHandler?.socket.emit(SocketTags.ACTION, {
                          type: PlayerActionType.StealResource,
                          resource: HexType.Field,
                        })
                      }
                    />
                  </Column>
                  <Column>
                    <ActionButton
                      title="Lumber"
                      onPress={() =>
                        appState.socketHandler?.socket.emit(SocketTags.ACTION, {
                          type: PlayerActionType.StealResource,
                          resource: HexType.Forest,
                        })
                      }
                    />
                  </Column>
                  <Column>
                    <ActionButton
                      title="Ore"
                      onPress={() =>
                        appState.socketHandler?.socket.emit(SocketTags.ACTION, {
                          type: PlayerActionType.StealResource,
                          resource: HexType.Mountain,
                        })
                      }
                    />
                  </Column>
                  <Column>
                    <ActionButton
                      title="Wool"
                      onPress={() =>
                        appState.socketHandler?.socket.emit(SocketTags.ACTION, {
                          type: PlayerActionType.StealResource,
                          resource: HexType.Pasture,
                        })
                      }
                    />
                  </Column>
                </Row>
              </Row>
            </>
          ) : (
            <></>
          )}

          {buildRoadsActions > 0 ? (
            <>
              <Row span={1}>
                <Text style={styles.textHeader}>
                  Choose{" "}
                  {`Choose ${buildRoadsActions} more road${
                    buildRoadsActions > 1 ? "s " : " "
                  }`}
                  to build
                </Text>
                </Row>
                </>) : <></>}

          <Row></Row>
          <Row span={2}>
            <Column span={1}>
              <ActionButton
                title={"Buy a card"}
                color={canBuyCard ? "#2ec0e8" : "#999999"}
                onPress={() =>
                  canBuyCard &&
                  appState.socketHandler?.socket.emit(SocketTags.ACTION, {
                    type: PlayerActionType.DrawDevelopmentCard,
                  })
                }
              />
            </Column>
            <Column span={1}>
              <ActionButton
                title="Cancel"
                onPress={() => {
                  props.setDevelopmentOpen(false);
                }}
              />
            </Column>
          </Row>
        </View>
      )}
    </>
  );
};
