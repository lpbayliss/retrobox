import { TStoreState } from "@reducers/root";

export const myProfile = (state: TStoreState) => state.profiles.myProfile;
export const isFetchingProfile = (state: TStoreState) => state.profiles.fetching;