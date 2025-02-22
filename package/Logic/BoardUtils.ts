import { Coords, DevelopmentCard, Hexagonal, HexType, EdgeLocation, Robber, NodeLocation, Table } from "../entities/Models";
import { GameState, PlayerState } from "../entities/State";

export const isEdgeLegal = (edge: EdgeLocation): boolean => {
    if (edge.adjHex[0].row == edge.adjHex[1].row && (edge.adjHex[1].row == 0 || edge.adjHex[1].row == 6)) return false;
    if (edge.adjHex[0].col == edge.adjHex[1].col && edge.adjHex[1].col == 0) return false;
    if (edge.adjHex[0].col == 6 - Math.abs(edge.adjHex[0].row - 3) && edge.adjHex[1].col == 6 - Math.abs(edge.adjHex[1].row - 3)) return false;

    return ((edge.adjHex[0].row == edge.adjHex[1].row) && (edge.adjHex[0].col - edge.adjHex[1].col) * (edge.adjHex[0].col - edge.adjHex[1].col) == 1) ||
        ((edge.adjHex[1].row - edge.adjHex[0].row == 1) && ((edge.adjHex[0].col == edge.adjHex[1].col) || (edge.adjHex[0].row >= 3 && (edge.adjHex[0].col - edge.adjHex[1].col == 1)) || ((edge.adjHex[0].col - edge.adjHex[1].col == -1))));
}

export const getRoadNodes = (edge: EdgeLocation): NodeLocation[] => {
    if (edge.adjHex[1].row == edge.adjHex[0].row) {
        let s1 = (edge.adjHex[0].row < 3) ? 1: 0, s2 = (edge.adjHex[0].row > 3) ? 1: 0;
        if (edge.adjHex[0].col > edge.adjHex[1].col) edge.adjHex = [edge.adjHex[1], edge.adjHex[0]];
        let otherCoords = [{row: edge.adjHex[0].row + 1, col: edge.adjHex[0].col + s1}, {row: edge.adjHex[0].row - 1, col: edge.adjHex[0].col + s2}];
        return otherCoords.map(coord => createNode([...edge.adjHex, coord]));
    }
    if (edge.adjHex[1].col == edge.adjHex[0].col) {
        let s = (edge.adjHex[0].row < 3) ? 1 : -1
        let otherCoords = [{row: edge.adjHex[0].row, col: edge.adjHex[0].col - s}, {row: edge.adjHex[1].row, col: edge.adjHex[1].col + s}];
        return otherCoords.map(coord => createNode([...edge.adjHex, coord]));
    }   
    let otherCoords = [{row: edge.adjHex[0].row, col: edge.adjHex[1].col}, {row: edge.adjHex[1].row, col: edge.adjHex[0].col}];
    return otherCoords.map(coord => createNode([...edge.adjHex, coord]));
}

export const getNodeRoads = (node: NodeLocation): EdgeLocation[] => {
    return [[0, 1], [0, 2], [1, 2]].map(subset => createEdge(subset.map(i => node.adjHex[i]) as [Coords, Coords])).filter(isEdgeLegal);
}

export const getConnectedRoads = (edge: EdgeLocation): EdgeLocation[] => { return [...new Set(getRoadNodes(edge).flatMap(getNodeRoads))]; }

export const createNode = (adjHex: [Coords, Coords, Coords], owner?: number): NodeLocation => ({
    id: adjHex.sort((c1, c2) => (c1.row - c2.row) * 7 + c1.col - c2.col).map(coords => `${coords.row},${coords.col}`).join(","),
    adjHex,
    owner
})

export const createEdge = (adjHex: [Coords, Coords], owner?: number): EdgeLocation => ({
    id: adjHex.sort((c1, c2) => (c1.row - c2.row) * 7 + c1.col - c2.col).map(coords => `${coords.row},${coords.col}`).join(","),
    adjHex,
    owner
})

export const uniqueEdges = (edges: EdgeLocation[]): EdgeLocation[] => [...new Map(edges.map(edge => [edge.id, edge])).values()]

export const uniqueNodes = (nodes: NodeLocation[]): NodeLocation[] => [...new Map(nodes.map(node => [node.id, node])).values()]

export const diffEdges = (A: EdgeLocation[], B: EdgeLocation[]) => {
    const mapB = new Set(B.map(edge => edge.id));
    return uniqueEdges(A.filter(edge => !mapB.has(edge.id)));
}

export const diffNodes = (A: NodeLocation[], B: NodeLocation[]) => {
    const mapB = new Set(B.map(node => node.id));
    return uniqueNodes(A.filter(node => !mapB.has(node.id)));
}