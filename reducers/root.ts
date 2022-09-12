import { StateFromReducersMapObject } from 'redux';

import profiles, { initialState as initialProfilesState } from "./profiles";


export const reducers = {
  profiles
};

export type TStoreState = StateFromReducersMapObject<typeof reducers>;

export const rootInitialState: TStoreState = {
  profiles: initialProfilesState
};
