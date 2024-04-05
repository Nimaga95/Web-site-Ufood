import { SECURE_URL } from "./URL_BASE";
import {getToken} from "@/api/session";
import {createError} from "@/api/accessDeniedError";

export const getAllUsersInfo = async () => {
  const response = await fetch(`${SECURE_URL}/users`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization : getToken()
    },
  });

  errorCheck(
    response.status,
    "getAllUsersInfo : Something went wrong.",
  );

  const data = await response.json();
  //console.log(data.items);
  return data.items;
};

export const getUsersFiltered = async(researchQuery) => {
  let url = `${SECURE_URL}/users?q=`;
  researchQuery.forEach((query) => {
    url = url + query + "+";
  });

  url = url.slice(0, -1);
  url = url + "&limit=0"
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization : getToken()
    },
  });

  errorCheck(
    response.status,
    "getUsersFiltered : Something went wrong.",
  );

  const data = await response.json();
  return data.items;
}

export const getUserInfo = async (user) => {
  const response = await fetch(`${SECURE_URL}/users/${user}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization : getToken()
    },
  });

  errorCheck(
    response.status,
    "getUserInfo : Something went wrong.",
  );

  const data = await response.json();
  //console.log(data);
  return data;
};

export const getRestaurantsNameByID = async (restoId) => {
  if (restoId.length !== 24) {
    throw new Error("Invalid restaurant ID length. Must be 6 characters.");
  } else {
    const req = new Request(`${SECURE_URL}/restaurants/${restoId}`, {
      method: "GET",
      headers: {
        Authorization : getToken()
      },
    });
    const response = await fetch(req);

    errorCheck(
      response.status,
      "getRestaurantsNameByID : Something went wrong.",
    );

    const data = await response.json();
    //console.log(data)
    return data.name;
  }
};

function errorCheck(status, message) {
  if (status !== 200) {
    throw createError(status, message);//new Error(message);
  }
}

// export const getRestaurantName = async (restoID) => {
//   try {
//
//     const req = new Request(
//       `${BASE_URL}/users/${userID}/restaurants/visits`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//
//         },
//       }
//     );
//     const response = await fetch(req);
//     const data = await response.json();
//     console.log(data);
//     return data.items;
//   } catch (error) {
//     return [];
//   }
// };

