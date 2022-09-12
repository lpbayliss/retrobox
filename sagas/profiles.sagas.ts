import { SagaIterator } from "@redux-saga/core";
import { takeLatest, put, call } from "@redux-saga/core/effects";

import * as actions from "@actions";
import * as api from "@api";

const profilesSaga = function* (): SagaIterator {
  yield takeLatest(actions.fetchMyProfile, function* (): SagaIterator {
    const [error, data] = yield call(api.fetchProfile, '621c6f5b-5ae2-46e6-ac01-94699d6bd2be');
    if (error) yield put(actions.fetchMyProfileFailed(error));
    else yield put(actions.fetchMyProfileSuccess(data))
  });
};

export default profilesSaga;