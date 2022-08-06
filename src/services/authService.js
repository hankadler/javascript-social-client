import { DELETE, GET, POST } from "./httpService";
import ServerError from "../errors/ServerError";

export const signUp = async (name, email, password, passwordAgain) => {
  const { error, responseBody } = (
    await POST("auth/sign-up", { name, email, password, passwordAgain })
  );
  if (error) throw error;

  const { rejected, response } = responseBody.info;
  if (rejected === undefined || rejected.length) {
    throw new ServerError(response || "Something went wrong while sending activation email!");
  }
};

export const signIn = async (email, password) => {
  const { error, responseBody } = await POST("auth/sign-in", { email, password });
  if (error) throw error;
  return responseBody.userId;
};

export const isAuth = (userId) => {
  if (!userId) return false;
  return GET(`users/${userId}?select=_id`)
    .then(({ error }) => !error)
    .catch((error) => !error);
};

export const signOut = async () => {
  const { error } = await DELETE("auth/sign-out");
  if (error) throw error;
};
