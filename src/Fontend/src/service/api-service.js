import Auth from './auth-service';
import { isNullOrUndefined } from './common-service';

const API = 'http://localhost:8000/api';

const Get = async function (api, query = '') {
  if (isNullOrUndefined(api)) {
    return;
  }
  const token = Auth.getToken();

  const setting = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    method: 'GET',
  }
  const response = await fetch(API + api, setting);
  if (response.status === 204 || response.status === 401 || response.status === 417) {
    return null;
  }
  const data = await response.json();
  return data;
}

const GetWithoutToken = async function (api, query = '') {
  if (isNullOrUndefined(api)) {
    return;
  }

  const setting = {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  }
  const response = await fetch(API + api, setting);
  // if (response.status === 204 || response.status === 401) {
  //   return null;
  // }
  // const data = await response.json();
  // return data;
  return response;
}

const Post = async function (api, query) {
  if (isNullOrUndefined(api)) {
    return;
  }
  const token = Auth.getToken();
  const setting = {
    headers: {
      'content-type': 'application/json',
      'Authorization': token,
    },
    method: 'post',
    body: JSON.stringify(query),
  }
  const response = await fetch(API + api, setting);
  if (response.status === 401 || response.status === 403) {
    return null;
  }
  // const data = await response.json();
  return response;
}

const PostNotifications = async function (api, query) {
  const tokenServer = 'AAAAzX5jJP0:APA91bFkwT2CIBpBoRklfpHhMwFNuZ3whbUDb9s0ya5JSeZOjfpsh3z_Vx2yGhZEd4wtpqxBzau5unUJ7HrbsKEzqcJCrBr164TWCLTT1hIBAjsg56AhUJ4M9ZzxIu6hYWE1wJD-ME00';
  if (isNullOrUndefined(api)) {
    return;
  }

  const setting = {
    headers: {
      'content-type': 'application/json',
      'Authorization': 'key=' + tokenServer,
    },
    method: 'post',
    body: JSON.stringify(query),
  }
  const response = await fetch(api, setting);
  if (response.status === 401 || response.status === 403) {
    return null;
  }
  // const data = await response.json();
  return response;
}

const Put = async function (api, query) {
  if (isNullOrUndefined(api)) {
    return;
  }
  const token = Auth.getToken();
  const setting = {
    headers: {
      'content-type': 'application/json',
      'Authorization': token,
    },
    method: 'put',
    body: JSON.stringify(query),
  }
  const response = await fetch(API + api, setting);
  //const data = await response.json();
  if (response.status === 401 || response.status === 403) {
    return null;
  }
  return response;
}

const PutWithoutToken = async function (api, query) {
  if (isNullOrUndefined(api)) {
    return;
  }

  const setting = {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'put',
    body: JSON.stringify(query),
  }
  const response = await fetch(API + api, setting);
  if (response.status === 401 || response.status === 403) {
    return null;
  }
  return response;
}

const Delete = async function (api, query) {
  if (isNullOrUndefined(api)) {
    return;
  }
  const token = Auth.getToken();
  const setting = {
    headers: {
      'Authorization': token,
    },
    method: 'delete',
  }
  const response = await fetch(API + api, setting);
  if (response.status === 401 || response.status === 403) {
    return null;
  }
  return response;
}
const ApiServices = {
  Get,
  Post,
  PostNotifications,
  Put,
  Delete,
  API, 
  GetWithoutToken,
  PutWithoutToken,
}

export default ApiServices;