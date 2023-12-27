import { ReactElement, useContext } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './home';
import Login from './login';
import { UserProvider, UserContext } from './user';

interface ProtectedRouteProps {
  element: ReactElement
}

function ProtectedRoute({ element }: ProtectedRouteProps): ReactElement {
  const navigate = useNavigate();
  const user = useContext(UserContext);
  if (user?.token === null) {
    navigate('/login');
  }
  return user?.token != null ? element : <Login />;
}

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" index element={ <ProtectedRoute element={ <Home /> } /> } />
        <Route path="/login" element={ <Login /> } />
      </Routes>
    </UserProvider>
  );
}

export default App;