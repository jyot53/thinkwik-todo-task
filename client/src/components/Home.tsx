import React from 'react'
import { useAuth } from '../context/AuthContext';

export const Home = () => {
  const { user,logout } = useAuth();
  return (
    <div>Home</div>
  )
}
