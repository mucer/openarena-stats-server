import { Actions, KillStatsDto, ActionType, assign, GamePersonStatsDto } from '../../../shared';
import { Reducer } from 'redux';

export interface State {
  kill: { [id: string]: KillStatsDto[] };
  gamePerson: { [id: string]: GamePersonStatsDto[] };
}

const INITIAL_STATE: State = {
  kill: {},
  gamePerson: {}
};

export const reducer: Reducer = (state: State = INITIAL_STATE, action: Actions): State => {
  switch (action.type) {
    case ActionType.SET_KILL_STATS:
      return assign(state, {
        kill: assign(state.kill, { [action.id]: action.stats })
      });
    case ActionType.SET_GAME_PERSON_STATS:
      return assign(state, {
        gamePerson: assign(state.gamePerson, { [action.id]: action.stats })
      });
    case ActionType.REFRESH_MATERIALIZED_VIEWS:
      return INITIAL_STATE;
    default:
      return state;
  }
};
