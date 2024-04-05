import { SECURE_URL } from "./URL_BASE";
import {getToken} from "@/api/session";
import {createError} from "@/api/accessDeniedError";

export const getFilteredRestaurant = async (query) => {
  const response = await fetch(`${SECURE_URL}/restaurants?limit=5` + query, {
    method: 'GET',
    headers: {
      Authorization : getToken()
    }
  });

  if (response.status !== 200) {
    throw createError(response.status, "getFilteredRestaurant : Something went wrong.");
  }

  return await response.json();
};

export const getAllRestaurants = async () => {
  const response = await fetch(`${SECURE_URL}/restaurants`, {
    method: 'GET',
    headers: {
      Authorization : getToken()
    }
  });

  if (response.status !== 200) {
    throw createError(response.status, "getAllRestaurants : Something went wrong.");
  }

  const results = await response.json();
  return results.items;
};

export const getRestaurantById = async (id) => {
  const response = await fetch(`${SECURE_URL}/restaurants/` + id, {
    method: 'GET',
    headers: {
      Authorization : getToken()
    }
  });

  if (response.status !== 200) {
    throw createError(response.status, "getRestaurantById : Something went wrong.");
  }

  return await response.json();
};
