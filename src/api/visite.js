import { SECURE_URL } from "./URL_BASE";
import {getToken} from "@/api/session";
import {createError} from "@/api/accessDeniedError";

export const postVisit = async ({
  idUser,
  idRestaurant,
  visitComment,
  visitRating,
  visitDate,
}) => {
  const request = new Request(
    `${SECURE_URL}/users/${idUser}/restaurants/visits`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization : getToken()
      },
      body: JSON.stringify({
        restaurant_id: idRestaurant,
        comment: visitComment,
        rating: parseFloat(visitRating),
        date: visitDate,
      }),
    },
  );
  const response = await fetch(request);



  if (response.status !== 201) {
    throw createError(response.status, "post Visit  : An error occurred when creating visit");
  }
  //console.log(response);
};

export const getVisitedRestaurant = async (userID) => {
  const response = await fetch(
    `${SECURE_URL}/users/${userID}/restaurants/visits?limit=0`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization : getToken()
      },
    },
  );

  if (response.status !== 200) {
    throw createError(response.status, "getVisitedRestaurant : Something went wrong.");
  }

  const data = await response.json();
  //console.log(data);
  return data.items;
};
