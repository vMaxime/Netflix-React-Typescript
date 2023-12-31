import { FC, PropsWithChildren, useContext, useEffect } from 'react';
import { Routes, Route, useNavigate, LoaderFunction } from 'react-router-dom';
import Home from './home';
import Login from './login';
import { UserProvider, UserContext, findProfile } from './user';
import ByType from './home/ByType';
import { fetchSections } from './fakeApi';

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

interface RedirectProps {
  to: string
}

const Redirect: FC<RedirectProps> = ({ to }) => {
  const navigate = useNavigate();
  useEffect(() => navigate(to), []);

  return <></>;
} 

function App() {

  return (
    <UserProvider>
      <Routes>
        <Route path="/" index element={ <Redirect to="/browse" /> } />
        
        <Route path="/browse" element={ <ProtectedRoute><Home /></ProtectedRoute> }>
          <Route index element={ <ByType key="all" type={null} /> } />
          <Route path="films" element={ <ByType key="film" type="film" /> } />
          <Route path="series" element={ <ByType key="serie" type="serie" /> } />
        </Route>

        <Route path="/search" element={ <ProtectedRoute><Home searching={true} /></ProtectedRoute> } />
        <Route path="/login" element={ <Login /> } />
      </Routes>
    </UserProvider>
  );
}

export default App;