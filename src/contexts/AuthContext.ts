import { createContext } from 'react';

// Authentication test
export const AuthContext = createContext({
  signIn: (apidata: any) => {},
  signOut: () => {},
});
