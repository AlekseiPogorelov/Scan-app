import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { getLimitsApi } from '../api/api';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: null,
  limits: null,
  isAuthenticated: false,
  loading: true
};

// Тестовый пользователь
//const initialState = {
//  user: {
//    id: 'test-user-001',
//    name: 'Test User',
//    tariff: 'business',
//  },
//  token: 'test-token',
//  limits: {
//    used: 0,
//    total: 1000
//  },
//  isAuthenticated: true,
//  loading: false
//};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        limits: null,
        isAuthenticated: false,
        loading: false
      };
    case 'LOAD_USER':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false
      };
    case 'SET_LIMITS':
      return { ...state, limits: action.payload };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const user = JSON.parse(localStorage.getItem('user'));
    if (token && user) {
      dispatch({ type: 'LOAD_USER', payload: { user, token } });
    } else {
      dispatch({ type: 'LOGOUT' });
    }
    // тестовый пользователь
//    dispatch({ type: 'LOAD_USER', payload: { user: initialState.user, token: initialState.token } });
  }, []);

  const login = (user, token) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    dispatch({ type: 'LOGIN', payload: { user, token } });
  };

  const logout = () => {
    localStorage.clear();
    dispatch({ type: 'LOGOUT' });
  };


  const fetchLimits = useCallback(async () => {
    if (!state.token) return;
    const limits = await getLimitsApi(state.token);
    // тестовый пользователь
//    const limits = { used: 0, total: 5 };
    dispatch({ type: 'SET_LIMITS', payload: limits });
    return limits;
  }, [state.token]);

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      logout,
      fetchLimits
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
