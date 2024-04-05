import {SECURE_URL} from "./URL_BASE";
import {getToken} from "@/api/session";
import {AccessDeniedError} from "@/api/accessDeniedError";

export const unfollow = async(id) => {
  const token = getToken();
  if (token !== undefined) {
    const response = await fetch(`${SECURE_URL}/follow/${id}`, {
      method: "DELETE",
      headers: {
        Authorization : token
      }
    });

    if (response.status === 404) {
      throw new Error("unfollow : Unrecognized user.");
    }
    if (response.status === 401) {
      throw new AccessDeniedError("unfollow : Unauthorized.");
    }
    if (response.status !== 200) {
      console.log(response.status)
      throw new Error("unfollow : Something went wrong.");
    }

    return response.json();
  }
}

export const follow = async(id) => {
  const token = getToken();
  if (token !== undefined) {
    const response = await fetch(`${SECURE_URL}/follow`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization : getToken()
      },
      body: JSON.stringify({
        id: id
      })
    });

    if (response.status === 404) {
      throw new Error("follow : Unrecognized user.");
    }
    else if (response.status === 412) {
      throw new Error("follow : Already following.");
    }
    else if (response.status === 401) {
      throw new AccessDeniedError("unfollow : Unauthorized.");
    }
    else if (response.status !== 201) {
      console.log(response.status)
      throw new Error("follow : Something went wrong.");
    }
    return response.json();
  }
}
