import { createAction } from "@reduxjs/toolkit";
import { PostgrestError } from "@supabase/supabase-js";

const PREFIX = "PROFILES";

export const fetchMyProfile = createAction(
  `${PREFIX}/FETCH_MY_PROFILE`
);

export const fetchMyProfileSuccess = createAction<{ nickname?: string }>(
  `${PREFIX}/FETCH_MY_PROFILE/SUCCESS`
);

export const fetchMyProfileFailed = createAction<{ error: PostgrestError }>(
  `${PREFIX}/FETCH_MY_PROFILE/FAILED`
);