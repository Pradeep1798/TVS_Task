import {
  createSlice,
  Dispatch,
  PayloadAction,
  UnknownAction,
} from '@reduxjs/toolkit';
import { Case, CasesState } from 'modals/case';

interface CasesRootState {
  cases: CasesState;
}

const initialState: CasesState = { items: [] };

const casesSlice = createSlice({
  name: 'cases',
  initialState,
  reducers: {
    caseAdded(state, action: PayloadAction<Case>) {
      if (state.items.some((c) => c.id === action.payload.id)) return; 
      state.items.unshift(action.payload);
    },
  },
});

export const { caseAdded } = casesSlice.actions;

export const selectCases = (state: CasesRootState): Case[] => state.cases.items;

export const receiveCase =
  (newCase: Case) =>
  (dispatch: Dispatch<UnknownAction>, getState: () => CasesRootState): boolean => {
    if (selectCases(getState()).some((c) => c.id === newCase.id)) return false;
    dispatch(caseAdded(newCase));
    return true;
  };

export default casesSlice.reducer;