import { configureStore, createSlice } from "@reduxjs/toolkit";

const loadState = () => {
  try {
    const serializedState = localStorage.getItem("state");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("state", serializedState);
  } catch (err) {
    console.error(err);
  }
};

const initialState = {
  accessToken: null,
  userData: {},
  userFavSubs: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setUserFavSubs: (state, action) => {
      state.userFavSubs = action.payload;
    },
    logout: (state) => {
      state.accessToken = null;
      state.userData = {};
      state.userFavSubs = [];
    },
  },
});

export const { setAccessToken, setUserData, setUserFavSubs, logout } =
  authSlice.actions;

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
  preloadedState: loadState(),
});

store.subscribe(() => {
  saveState(store.getState());
});

export default store;
