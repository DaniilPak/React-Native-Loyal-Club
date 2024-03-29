import { createContext } from 'react';

export const BadgeContext = createContext({
  badge: null,
  setBadge: (badge: any) => {},
  updateTrigger: false,
  setUpdateTrigger: (trigger: boolean) => {},
});
