import { UserSubscription, GrantType } from "../types";
import { MOCK_DB_KEY } from "../constants";

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const saveUser = async (name: string, phone: string, grantType: GrantType): Promise<UserSubscription> => {
  await delay(1200); // Simulate API latency

  const newUser: UserSubscription = {
    id: Math.random().toString(36).substr(2, 9),
    name,
    phone,
    grantType,
    subscribedAt: new Date().toISOString(),
  };

  const existingData = localStorage.getItem(MOCK_DB_KEY);
  const users: UserSubscription[] = existingData ? JSON.parse(existingData) : [];
  
  users.push(newUser);
  localStorage.setItem(MOCK_DB_KEY, JSON.stringify(users));
  
  return newUser;
};

export const getUserCount = (): number => {
  const existingData = localStorage.getItem(MOCK_DB_KEY);
  const users: UserSubscription[] = existingData ? JSON.parse(existingData) : [];
  // Fake a higher number for social proof if empty
  return users.length > 0 ? users.length + 15420 : 15420;
};