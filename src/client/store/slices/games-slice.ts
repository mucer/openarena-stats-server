
import { Reducer } from 'redux';
import { GameDto, Actions, ActionType, assign } from '../../../shared';

export interface State {
    games: { [id: number]: GameDto };
}

const INITIAL_STATE: State = {
    games: {}
};

export const reducer: Reducer = (state: State = INITIAL_STATE, action: Actions): State => {
    switch (action.type) {
        case ActionType.LOAD_GAME:
            return updateGame(state, action.gameId, undefined);
        case ActionType.SET_GAME:
            return updateGame(state, action.game.id, action.game);
        default:
            return state;
    }
};

function updateGame(state: State, gameId: number, game: GameDto | undefined): State {
    if (!game && state.games.hasOwnProperty(gameId)) {
        return state;
    }

    return assign(state, {
        games: assign(state.games, {
            [gameId]: game
        })
    });
}
