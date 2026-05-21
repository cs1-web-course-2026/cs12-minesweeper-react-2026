import { useReducer, useCallback } from "react";
import { GAME_STATUS, CELL_STATE } from "../constants.js";
import { generateField, revealCellLogic } from "../logic.js";

const DEFAULT_CONFIG = { rows: 9, cols: 9, minesCount: 10 };

function createInitialState(config = DEFAULT_CONFIG) {
    return {
        field: generateField(config.rows, config.cols, config.minesCount),
        status: GAME_STATUS.IDLE,
        flagsPlaced: 0,
        resetCounter: 0,
        config,
    };
}

function gameReducer(state, action) {
    switch (action.type) {
        case "RESTART":
            return {
                ...createInitialState(state.config),
                resetCounter: state.resetCounter + 1,
            };

        case "REVEAL_CELL": {
            const { row, col } = action.payload;

            if (state.status === GAME_STATUS.WON || state.status === GAME_STATUS.LOST) {
                return state;
            }

            const targetCell = state.field[row][col];
            if (targetCell.state === CELL_STATE.OPENED || targetCell.state === CELL_STATE.FLAGGED) {
                return state;
            }

            let currentStatus = state.status === GAME_STATUS.IDLE ? GAME_STATUS.PLAYING : state.status;

            const { newField, status: newStatusStr } = revealCellLogic(
                state.field,
                row,
                col,
                state.config.rows,
                state.config.cols,
                state.config.minesCount
            );

            let finalStatus = currentStatus;
            let finalFlagsPlaced = state.flagsPlaced;

            if (newStatusStr === GAME_STATUS.LOST) {
                finalStatus = GAME_STATUS.LOST;
            } else if (newStatusStr === GAME_STATUS.WON) {
                finalStatus = GAME_STATUS.WON;
                finalFlagsPlaced = state.config.minesCount;
            }

            return {
                ...state,
                field: newField,
                status: finalStatus,
                flagsPlaced: finalFlagsPlaced,
            };
        }

        case "TOGGLE_FLAG": {
            const { row, col } = action.payload;

            if (state.status === GAME_STATUS.WON || state.status === GAME_STATUS.LOST) {
                return state;
            }

            const targetCell = state.field[row][col];

            if (targetCell.state === CELL_STATE.OPENED) {
                return state;
            }

            let currentStatus = state.status === GAME_STATUS.IDLE ? GAME_STATUS.PLAYING : state.status;

            if (targetCell.state === CELL_STATE.FLAGGED) {
                const newField = state.field.map(boardRow => boardRow.map(boardCell => ({ ...boardCell })));
                newField[row][col].state = CELL_STATE.CLOSED;
                return {
                    ...state,
                    status: currentStatus,
                    field: newField,
                    flagsPlaced: state.flagsPlaced - 1,
                };
            } else {
                if (state.flagsPlaced >= state.config.minesCount) {
                    return state;
                }
                const newField = state.field.map(boardRow => boardRow.map(boardCell => ({ ...boardCell })));
                newField[row][col].state = CELL_STATE.FLAGGED;
                return {
                    ...state,
                    status: currentStatus,
                    field: newField,
                    flagsPlaced: state.flagsPlaced + 1,
                };
            }
        }

        default:
            return state;
    }
}

export function useGameState(config = DEFAULT_CONFIG) {
    const [state, dispatch] = useReducer(gameReducer, config, createInitialState);

    const restart = useCallback(() => dispatch({ type: "RESTART" }), []);
    const revealCell = useCallback((row, col) => dispatch({ type: "REVEAL_CELL", payload: { row, col } }), []);
    const toggleFlag = useCallback((row, col) => dispatch({ type: "TOGGLE_FLAG", payload: { row, col } }), []);

    return { state, restart, revealCell, toggleFlag };
}
