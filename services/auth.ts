import { User } from '../types';

// Mock user database
const MOCK_USERS: User[] = [
  {
    id: 'u_1',
    name: 'Demo Reseller',
    email: 'reseller@accountbot.shop',
    role: 'reseller',
  },
  {
    id: 'u_2',
    name: 'Admin User',
    email: 'admin@accountbot.shop',
    role: 'admin',
  }
];

export const loginUser = async (email: string, password: string): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  if (password === 'password') {
    const user = MOCK_USERS.find(u => u.email === email);
    if (user) return user;
  }
  
  throw new Error('Invalid credentials');
};
