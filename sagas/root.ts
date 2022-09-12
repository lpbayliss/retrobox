import { all, call, spawn } from "@redux-saga/core/effects";
import profilesSaga from "./profiles.sagas";

export default function* rootSaga() {
  const sagas = [profilesSaga];

  yield all(
    sagas.map((saga) =>
      spawn(function* () {
        while (true) {
          try {
            yield call(saga);
            break;
          } catch (e) {
            console.log(e);
          }
        }
      })
    )
  );
}