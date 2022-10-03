/* eslint-disable */
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo
} from 'react';
import axios from 'axios';
import { useLocalStoredState } from '../utils/localStoredState';

const AuthContext = createContext();
AuthContext.displayName = 'AuthContext';

/**
 * Get user information given by backend framework
 */
const bootstrapAppData = () => {
  const el = document.getElementById('config');
  try {
    const user = JSON.parse(el.dataset.user);
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const AuthProvider = (props) => {
  const userData = bootstrapAppData();
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(userData));
  const [user, setUser] = useState(userData);
  const [
    hasUserPreviouslyLoggedin,
    setHasUserPreviouslyLoggedin
  ] = useLocalStoredState('hasUserPreviouslyLoggedin');
  const [isOnboardingUser, setIsOnboardingUser] = useState(
    !userData?.onboarding_finished_at
  );

  const setUserData = (data) => {
    const user_data = data.user || data;
    setUser(user_data);
    setIsLoggedIn(true);
    setIsOnboardingUser(!user_data.onboarding_finished_at);
    setHasUserPreviouslyLoggedin('1');
  };

  const login = useCallback(
    async (data) =>
      axios.post('/api/login', data).then(async (response) => {
        setUserData(response.data);
        return response;
      }),
    [setUser]
  );

  const register = useCallback(
    async (data) =>
      axios.post('/api/register', data).then(async (response) => {
        setUserData(response.data);
        return response;
      }),
    [setUser]
  );

  const logout = useCallback(
    async () =>
      axios.post('/api/logout').then(async (response) => {
        setIsLoggedIn(false);
        return response;
      }),
    [setIsLoggedIn]
  );

  const editUser = useCallback(
    async (data) =>
      axios.put('/api/me', data).then(async (response) => {
        setUser(response.data);
        return response;
      }),
    [setUser]
  );

  const finishOnboarding = useCallback(
    async () =>
      axios.post('/api/me/finish-onboarding').then(async (response) => {
        setUser(response.data);
        setIsOnboardingUser(!response.data?.onboarding_finished_at);
        return response;
      }),
    [setUser, setIsOnboardingUser]
  );

  const value = useMemo(
    () => ({
      user,
      login,
      register,
      logout,
      editUser,
      isLoggedIn,
      setIsLoggedIn,
      isOnboardingUser,
      finishOnboarding,
      hasUserPreviouslyLoggedin: Boolean(hasUserPreviouslyLoggedin)
    }),
    [
      login,
      logout,
      register,
      user,
      setUser,
      setIsLoggedIn,
      isLoggedIn,
      isOnboardingUser,
      finishOnboarding,
      hasUserPreviouslyLoggedin
    ]
  );

  return <AuthContext.Provider value={value} {...props} />;
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }

  return context;
};

export { AuthProvider, useAuth };
