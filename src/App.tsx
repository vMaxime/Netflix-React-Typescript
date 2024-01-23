import { FC, ReactNode, useContext, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './home';
import Login from './login';
import { UserProvider, UserContext } from './user';
import ByType from './home/ByType';
import MyList from './home/MyList';
import News from './home/News';
import Profile from './profile';
import Logout from './routes/logout';

interface ProtectedRouteProps {
  children?: ReactNode,
  checkProfile?: boolean
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children, checkProfile }) => {
  const navigate = useNavigate();
  const user = useContext(UserContext);
  const shouldSelectProfile = user != null && user.selectedProfile === null && checkProfile === true;

  useEffect(() => {
    if (user?.token === null) {
      navigate('/login');
    } else if (user != null && user.selectedProfile === null && checkProfile === true) {
      navigate('/profiles');
    }
  }, []);

  return user?.token != null && !shouldSelectProfile ? children : null;
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
        <Route path="/profiles" element={ <ProtectedRoute><Profile /></ProtectedRoute> } />
        
        <Route path="/browse" element={ <ProtectedRoute checkProfile={true}><Home /></ProtectedRoute> }>
          <Route index element={ <ByType key="all" type={null} /> } />
          <Route path="films" element={ <ByType key="film" type="film" /> } />
          <Route path="series" element={ <ByType key="serie" type="serie" /> } />
          <Route path="my-list" element={ <MyList /> } />
          <Route path="news" element={ <News /> } />
        </Route>

        <Route path="/search" element={ <ProtectedRoute><Home searching={true} /></ProtectedRoute> } />
        <Route path="/login" element={ <Login /> } />
        <Route path="/logout" element={ <ProtectedRoute><Logout /></ProtectedRoute> } />
      </Routes>
    </UserProvider>
  );
}

export default App;