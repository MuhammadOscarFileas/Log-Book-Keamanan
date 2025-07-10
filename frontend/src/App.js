import React from 'react';
import AuthProvider from './auth/AuthProvider';
import AxiosInterceptor from './api/axiosInterceptor';
import Router from './Router';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AxiosInterceptor />
      </Router>
    </AuthProvider>
  );
};

export default App;