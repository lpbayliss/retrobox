import { createReducer } from "@reduxjs/toolkit";

import * as actions from "@actions";
import { PostgrestError } from "@supabase/supabase-js";

interface IState {
  error: PostgrestError | null;
  fetching: boolean;
  myProfile: { nickname?: string } | null;
}

export const initialState: IState = {
  error: null,
  fetching: false,
  myProfile: null,
};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(actions.fetchMyProfile, (state) => ({
      ...state,
      fetching: true,
    }))
    .addCase(actions.fetchMyProfileSuccess, (state, { payload }) => ({
      ...state,
      fetching: false,
      error: null,
      myProfile: payload,
    }))
    .addCase(actions.fetchMyProfileFailed, (state, { payload }) => ({
      ...state,
      fetching: false,
      error: payload.error,
      myProfile: null,
    }))
);