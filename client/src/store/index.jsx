import React from "react";
import produce from "immer";
import { get } from "lodash";
import { storage } from "../utils";

const initialState = {
  user: storage.get("user") || null,
  auth: storage.get("auth") || null,
  content: storage.get("content") || null,
  isAuthenticated: storage.get("isAuthenticated") || false,
};

const reducer = (state, action) => {
  const handlers = {
    authenticateUser: (state, { auth }) => {
      state.isAuthenticated = true;
      storage.set("isAuthenticated", true);
      state.auth = auth;
      storage.set("auth", auth);
    },

    revokeUser: (state) => {
      state.isAuthenticated = false;
      storage.set("isAuthenticated", false);
      state.content = null;
      storage.set("content", null);
      state.user = null;
      storage.set("user", null);
      state.auth = null;
      storage.set("auth", null);
    },

    setUser: (state, { user }) => {
      storage.set("user", user);
      state.user = user;
    },

    setContent: (state, { content }) => {
      storage.set("content", content);
      state.content = content;
    },
  };

  // do batch updates to store to prevent
  // multiple re-renders during a single action
  // if the action is an array, update all the dispatchs at once
  const actions = Array.isArray(action) ? action : [action];

  actions.forEach((action) => {
    const handler = get(handlers, action.type);

    if (handler) {
      handler(state, action);
    }
  });

  return state;
};

export const StoreContext = React.createContext(null);

export const StoreProvider = (props) => {
  const [state, dispatch] = React.useReducer(produce(reducer), initialState);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {props.children}
    </StoreContext.Provider>
  );
};

export const useStoreContext = () => React.useContext(StoreContext);

export default useStoreContext;
