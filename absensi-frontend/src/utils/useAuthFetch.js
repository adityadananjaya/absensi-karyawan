import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const useAuthFetch = () => {
    const {logout } = useContext(UserContext);
    const navigate = useNavigate();

    return async (url, options = {}) => {
        const token = localStorage.getItem('login_token');
        const headers = { ...options.headers, 'Authorization': `Bearer ${token}` };
        const response = await fetch(url, { ...options, headers });
        if (response.status === 401 || response.status === 403) {
            logout();
            navigate("/");
            return null
        }
        return response;
    };
};

export default useAuthFetch;