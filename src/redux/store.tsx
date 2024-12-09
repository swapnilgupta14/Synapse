import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import authReducer from './reducers/authSlice';
import taskReducer from './reducers/taskSlice.tsx';
import orgReducer from "./reducers/orgSlice.tsx";
import { projectsReducer } from './reducers/projectsSlice.tsx';
import { teamsReducer } from './reducers/teamsSlice.tsx';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
    teams: teamsReducer,
    projects: projectsReducer,
    organisation: orgReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
