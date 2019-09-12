import decode from 'jwt-decode';
import { isNullOrUndefined } from './common-service';

const login = async function (email, password) {
    logout();
    const API = 'http://localhost:8000/api/account/token';
    const response = await fetch(API, {
        headers: {
            'content-type': 'application/json'
        },
        method: 'post',
        body: JSON.stringify({ email: email, password: password })
    });
    const data = await response.json();
    if (data.token !== null && data.users.active === true && data.users.roles[0].id !== 2) {
        try {
            localStorage.setItem('id_token', data.token);
        }
        catch (exception) {
            console.log('Something wrong!!! ' + exception);
        }
        return 'true';
    }
    else if (data.token !== null && data.users.active === false && data.users.roles[0].id !== 2) {
        return 'disabled';
    } else {
        return 'false';
    }
};

const getToken = function () {
    return localStorage.getItem('id_token');
};

const logout = function () {
    localStorage.removeItem('id_token');
};

const isLoggedIn = function () {
    const token = getToken();
    return !isNullOrUndefined(token) && !isTokenExpired();
}

const isTokenExpired = function () {
    try {
        const token = getToken();
        const decoded = decode(token);
        if (decoded.exp < Date.now() / 1000) {
            logout();
            return true;
        } else {
            return false;
        }
    } catch (err) {
        return false;
    }
};

const AuthService = {
    login,
    isLoggedIn,
    isTokenExpired,
    logout,
    getToken
};

export default AuthService;