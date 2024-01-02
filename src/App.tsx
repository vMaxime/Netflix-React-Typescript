import { FC, PropsWithChildren, ReactElement, useContext, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './home';
import Login from './login';
import { UserProvider, UserContext } from './user';

const ProtectedRoute: FC<PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate();
  const user = useContext(UserContext);

  useEffect(() => {
    if (user?.token === null) {
      navigate('/login');
    }
  }, []);

  return user?.token != null ? children : <Login />;
}

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" index element={ <ProtectedRoute><Home /></ProtectedRoute> } />
        <Route path="/search" element={ <ProtectedRoute><Home searching={true} /></ProtectedRoute> } />
        <Route path="/login" element={ <Login /> } />
      </Routes>
    </UserProvider>
  );
}

export default App;