import { useEffect, useReducer } from 'react';

import { DEFAULT_CONFIG, GAME_STATUS } from '../constants.js';
import { createInitialState, gameReducer } from '../logic.js';

export default function useGameState(initialConfig = DEFAULT_CONFIG) {
    const [state, dispatch] = useReducer(gameReducer, initialConfig, createInitialState);

    useEffect(() => {
        if (state.status !== GAME_STATUS.PLAYING || !state.hasInteracted) {
            return undefined;
        }

        const intervalId = window.setInterval(() => {
            dispatch({ type: 'TICK' });
        }, 1000);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [state.status, state.hasInteracted]);

    function openCell(row, col) {
        dispatch({
            type: 'OPEN_CELL',
            payload: { row, col },
        });
    }

    function toggleFlag(row, col) {
        dispatch({
            type: 'TOGGLE_FLAG',
            payload: { row, col },
        });
    }

    function restart(nextConfig) {
        const isConfigObject =
            nextConfig &&
            typeof nextConfig === 'object' &&
            !Object.prototype.hasOwnProperty.call(nextConfig, 'preventDefault');

        dispatch({
            type: 'RESTART',
            payload: isConfigObject ? nextConfig : undefined,
        });
    }

    return {
        state,
        flagsLeft: state.minesCount - state.flagsPlaced,
        openCell,
        toggleFlag,
        restart,
    };
}
