import { FC, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserDispatchContext } from '../../user';

const Logout: FC = () => {
    const dispatch = useContext(UserDispatchContext)!;
    const navigate = useNavigate();

    useEffect(() => {
        dispatch({
            type: 'LOGOUT'
        });
        navigate('/login');
    }, []);

    return <></>;
};

export default Logout;