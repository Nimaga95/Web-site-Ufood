import { SECURE_URL } from "./URL_BASE";
import Cookies from "js-cookie";

import {store} from "@/api/store";
import {createError} from "@/api/accessDeniedError";

const TOKEN_COOKIE_NAME = 'UFood-Token';

const getTokenInfoImpl = async (token) => {
  const response = await fetch(`${SECURE_URL}/tokeninfo`, {
    method: 'GET',
    headers: {
      Authorization : token
    }
  });
  if (response.status === 401) {
    return null;
  }
  else if (response.status !== 200) {
    throw createError(response.status, "getTokenInfo : Something went wrong.");
  }
  return await response.json();
};

const postSignup = async (name, email, password) => {
  const response = await fetch(`${SECURE_URL}/signup`, {
    method: 'POST',
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      'name': name,
      'email': email,
      'password': password
    })
  });

  if (response.status !== 200) {
    throw createError(response.status, "Signup : Something went wrong.");
  }
  //const data = await response.json();
  //console.log(data);
};

const postLogin = async (email, password) => {
  const response = await fetch(`${SECURE_URL}/login`, {
    method: 'POST',
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      'email': email,
      'password': password
    })
  });

  if (response.status === 401) {
    throw new Error("Invalid email or password");
  }
  else if (response.status !== 200) {
    throw new Error("An error occurred");
  }
  return await response.json();
};

const postLogout = async (token) => {
  const response = await fetch(`${SECURE_URL}/logout`, {
    method: 'POST',
    headers: {
      Authorization : token
    }
  });
  if (response.status !== 200) {
    throw createError(response.status, "Logout : Invalid email or password");
  }
};

export const getTokenInfo = async () => {
  try {
    const token = Cookies.get(TOKEN_COOKIE_NAME);

    if (token !== undefined) {
      return getTokenInfoImpl(Cookies.get(TOKEN_COOKIE_NAME));
    }
  } catch (error) {
    console.error(error);
  }
};

export const validLogin = async () => {
  try {
    const token = Cookies.get(TOKEN_COOKIE_NAME);

    if (token !== undefined) {
      const info = await getTokenInfoImpl(Cookies.get(TOKEN_COOKIE_NAME));

      if (info !== null) {
        store.userId = info.id;
      }
      else {
        store.userId = null;
      }
      return info !== null;
    }
  } catch (error) {
    console.error(error);
  }
  return false;
};

export const signup = async (name, email, password) => postSignup(name, email, password);

export const login = async(email, password) => {
  const data = await postLogin(email, password);
  Cookies.set(TOKEN_COOKIE_NAME, data.token, { expires: 1 });
  store.userId = data.id;
};

export const logout = async () => {
  const token = Cookies.get(TOKEN_COOKIE_NAME);
  if (token !== undefined) {
    await postLogout(token);
    Cookies.remove(TOKEN_COOKIE_NAME);
    store.userId = null;
  }
};

export const getToken = () => {
  return Cookies.get(TOKEN_COOKIE_NAME);
};

