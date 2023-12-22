import React from 'react';
import './App.css';
import {Routes,Route} from 'react-router-dom';
import { Home } from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Edit from './components/Edit';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
        <Routes>
          {/* public routes */}
          <Route path='/login' element={<Login/>}/>  
          <Route path='/register' element={<Register/>}/>

          {/* protected routes: */}
          <Route path='/' element={<ProtectedRoute component={<Home/>} />} />
          <Route path='/edit/:todoId' element={<ProtectedRoute component={<Edit/>} />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
