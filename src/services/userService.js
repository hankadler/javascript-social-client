import { GET, PATCH } from "./httpService";

export const getUsers = async (query = "") => {
  const { error, responseBody } = await GET(`users?${query}`);
  if (error) throw error;
  return responseBody.users;
};

export const getUser = async (userId, query = "") => {
  const { error, responseBody } = await GET(`users/${userId}?${query}`);
  if (error) throw error;
  return responseBody.user;
};

export const getOthers = async (selfId, query = "") => {
  if (!selfId) return [];
  const users = await getUsers(query);
  return users.filter(({ _id }) => _id !== selfId);
};

export const getOtherIds = async (selfId) => {
  const others = await getOthers(selfId, "select=_id");
  return others.map(({ _id }) => _id);
};

export const patchUser = async (userId, props) => {
  const { error } = await PATCH(`users/${userId}`, props);
  if (error) throw error;
};

export const addToWatchlist = async (user, otherId) => {
  if (!user.watchlist.includes(otherId)) {
    await user.watchlist.push(otherId);
    await patchUser(user._id, { watchlist: user.watchlist.join(",") });
    // console.log("added", user.watchlist.join(","));
  }
};

export const removeFromWatchlist = async (user, otherId) => {
  if (user.watchlist.includes(otherId)) {
    const _watchlist = user.watchlist.filter((id) => id !== otherId).join(",");
    await patchUser(user._id, { watchlist: _watchlist });
    // console.log("removed", user.watchlist.filter((id) => id !== otherId).join(","));
  }
};
