import { SECURE_URL } from "./URL_BASE";
import {getToken} from "@/api/session";
import {createError} from "@/api/accessDeniedError";

export const getAllFavorites = async () => {
  const response = await fetch(`${SECURE_URL}/favorites`, {
    method: 'GET',
    headers: {
      Authorization : getToken()
    }
  });
  errorCheck(response.status, "getAllFavorites : Something went wrong.");
  const results = await response.json();

  return results.items;
};

export const getRestaurantsFromFavorite = async ({ idList }) => {
  const response = await fetch(`${SECURE_URL}/favorites/${idList}`, {
    method: 'GET',
    headers: {
      Authorization : getToken()
    }
  });
  errorCheck(
    response.status,
    "getRestaurantsFromFavorite : Something went wrong.",
  );
  const result = await response.json();

  return result.restaurants;
};

// La fonction retourne l'id de la liste de favori nouvellement créé
export const createNewFavoritesList = async ({ name, owner }) => {
  const response = await fetch(`${SECURE_URL}/favorites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization : getToken()
    },
    body: JSON.stringify({
      name: name,
      owner: owner,
    }),
  });

  if (response.status !== 201) {
    throw createError(response.status, "createNewFavoritesList : Something went wrong.");
  }

  const results = response.json();

  return results.id;
};

export const renameFavoritesList = async ({ id, name, owner }) => {
  const response = await fetch(`${SECURE_URL}/favorites/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization : getToken()
    },
    body: JSON.stringify({
      name: name,
      owner: owner,
    }),
  });
  errorCheck(response.status, "renameFavoritesList : Something went wrong.");
  return response.json();
};

export const deleteFavorites = async ({ id }) => {
  const response = await fetch(`${SECURE_URL}/favorites/${id}`, {
    method: "DELETE",
    headers: {
      Authorization : getToken()
    }
  });
  errorCheck(response.status, "deleteFavorites : Something went wrong.");

  return response.json();
};

export const addRestaurantInFavorites = async ({
  idFavorites,
  idRestaurant,
}) => {
  const response = await fetch(
    `${SECURE_URL}/favorites/${idFavorites}/restaurants`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization : getToken()
      },
      body: JSON.stringify({
        id: idRestaurant,
      }),
    },
  );
  errorCheck(
    response.status,
    "addRestaurantInFavorites : Something went wrong.",
  );
  const results = response.json();

  return results.id;
};

export const deleteRestaurantFromFavorites = async ({
  idFavorites,
  idRestaurant,
}) => {
  const response = await fetch(
    `${SECURE_URL}/favorites/${idFavorites}/restaurants/${idRestaurant}`,
    {
      method: "DELETE",
      headers: {
        Authorization : getToken()
      },
    },
  );
  errorCheck(response.status, "deleteFavorites : Something went wrong.");

  return response.json();
};

export const getAllFavoritesFromUser = async ({ userId }) => {
  const response = await fetch(`${SECURE_URL}/users/${userId}/favorites`, {
    method: "GET",
    headers: {
      Authorization : getToken()
    }
  });
  errorCheck(
    response.status,
    "getAllFavoritesFromUser : Something went wrong.",
  );

  const result = await response.json();

  return result.items;
};

function errorCheck(status, message) {
  if (status !== 200) {
    throw createError(status, message);//new Error(message);
  }
}
