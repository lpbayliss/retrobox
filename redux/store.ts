import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import { rootInitialState, reducers } from '@reducers/root';
import rootSaga from '@sagas/root';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState: { ...rootInitialState },
});

sagaMiddleware.run(rootSaga);

export default store;
