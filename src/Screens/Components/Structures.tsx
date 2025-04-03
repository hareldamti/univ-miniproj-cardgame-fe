import React from 'react';
import { useGameContext } from '../../State/GameState';

import { styles, Row, Column, Frame, genIntKey, PressableSvg } from '../../Utils/CompUtils'
import { Hexagonal, HexType } from '../../package/Entities/Models'

import { GameActionTypes } from '../../package/Entities/GameActions';

export default (props: {setAvailableVisible: React.Dispatch<React.SetStateAction<Structure | null>>}) => {
    const {gameState, dispatch} = useGameContext();
    return <>
    <Column span={1}>
        <svg
            style={styles.svg}
            viewBox="-50 -50 100 100"
            onClick={ () => props.setAvailableVisible(curr => curr == Structure.Settlement ? null : Structure.Settlement) }>
            <Settlement/>
        </svg>
    </Column>
    <Column span={1}>
        <svg
            style={styles.svg}
            viewBox="-50 -50 100 100"
            onClick={ () => props.setAvailableVisible(curr => curr == Structure.City ? null : Structure.City) }>
            <City/>
        </svg>
    </Column>
    <Column span={1}>
        <svg
            style={styles.svg}
            viewBox="-50 -50 100 100"
            onClick={ () => props.setAvailableVisible(curr => curr == Structure.Road ? null : Structure.Road) }> <Road/>
        </svg>
    </Column>

    </>
}

export enum Structure {
    Settlement,
    City,
    Road
}

export const Settlement = (props: PressableSvg) => 
    <path onClick={props.onPress}
        d="M-7.4 35.0665v-22.2H7.4v22.2H27.1335V5.466H37L0-29.0675-37.0005 5.467h9.867v29.6Z"
        fill={props.color}
        strokeWidth={5}
        stroke={"black"}
        transform={`translate(${props.x ?? 0} ${props.y ?? 0}) rotate(${props.theta ?? 0}) scale(${(props.scale ?? 1 / 2)})`}
    />

export const City = (props: PressableSvg) => 
    <path onClick={props.onPress}
        d="M-6 22v4.0313h4V22H-6Zm8.0781-.0156v4.0312H6V21.9844H2.0781ZM34 21.9688V26h4V21.9688H34Zm-8.0781 0V26H30V21.9688H25.9219ZM-30 17.9844v4.0312h4V17.9844h-4Zm-8 0v4.0312h4.0781V17.9844H-38ZM2.0781 14.0156V18.043H6V14.0156H2.0781ZM-6 14v4.0313h4V14H-6Zm40-.0313V18h4V13.9688H34Zm-8 0V18h4.0781V13.9688H26ZM-30 9.9531v4.0313h4V9.9531h-4Zm-8 0v4.0313h4.0781V9.9531H-38ZM-14 8H14V42H2V33.9844H-1.9219L-2 42H-14V8ZM34 5.9531V9.9844h4V5.9531H34Zm-8.0781 0V9.9844H30V5.9531H25.9219ZM-30 1.9844V6.0156h4V1.9844h-4Zm-8 0V6.0156h4.0781V1.9844H-38Zm72-4V2.0156h4V-2.0156H34Zm-8.0781 0V2.0156H30V-2.0156H25.9219ZM-46-4.0156h28V42H-30V34l-4-.0156V42H-46V-4.0156Zm80-6.0156V-6h4v-4.0313H34Zm-8.0781 0V-6H30v-4.0313H25.9219ZM34-18v4.0313h4V-18H34Zm-8.0781 0v4.0313H30V-18H25.9219ZM26-25.9844v4.0273h4v-4.0273H26Zm8-.0312v4.0312h4v-4.0312H34Zm-50.1992-.0156V-22h3.918v-4.0313h-3.918Zm-8.082 0V-22h4.082v-4.0313h-4.082ZM18-34H46V42H34V33.9844H30.0781V42H18V-34Zm-34.1992 0v4.0313h3.918V-34h-3.918Zm-8.082 0v4.0313h4.082V-34h-4.082ZM-32-42H-4V4H-14V-8H-32V-42Z"
        fill={props.color}
        strokeWidth={2}
        stroke={"black"}
        transform={`translate(${props.x ?? 0} ${props.y ?? 0}) rotate(${props.theta ?? 0}) scale(${(props.scale ?? 1 / 2) })`}
    />

export const Road = (props: PressableSvg) => 
    <path onClick={props.onPress}
        d="M14 39.7v-80H3.5v20h-7v-20H-14v80H-3.5v-20h7v20H14Zm7-90v100H16.8595 14-14-16.8595-21v-100h4.1405H-14 14h2.8595H21ZM-3.5 9.7h7v-20h-7v20Z"
        fill={props.color}
        strokeWidth={5}
        stroke={"black"}
        transform={`translate(${props.x ?? 0} ${props.y ?? 0}) rotate(${props.theta ?? 0}) scale(${(props.scale ?? 1) / 2})`}
    />

export const Dice = (props: PressableSvg) =>
{
    if (!props.number) return <></>
    let rows = Math.floor(props.number / 2);
    return <g transform={`translate(${props.x ?? 0} ${props.y ?? 0}) rotate(${props.theta ?? 0}) scale(${(props.scale ?? 1)})`}>
        <path
            d="M13-10 13 10Q13 13 10 13L-10 13Q-13 13-13 10L-13-10Q-13-13-10-13L10-13Q13-13 13-10"
            fill={'white'}
            stroke="black"
            strokeWidth="2"
            transform={"scale(2)"}
        />
        { 
            props.number % 2 == 1 && 
            <circle cx={0}
                    cy={0}
                    r={5} strokeWidth={2}/>
        }
        {    [...Array(rows).keys()].map(n =>
                <>
                    <circle cx={11}
                        cy={rows == 1 ? 0 : (n / (rows - 1) - 0.5) * 22}
                        r={5} strokeWidth={2}/>
                    <circle cx={-11}
                        cy={rows == 1 ? 0 : (n / (rows - 1) - 0.5) * 22}
                        r={5} strokeWidth={2}/>
                </>
            )
        }
    </g>
}