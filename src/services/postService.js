import { DELETE, GET, PATCH, POST } from "./httpService";

export const postPost = async (userId, post) => {
  const { error, responseBody } = await POST(`users/${userId}/posts`, post);
  if (error) throw error;
  return responseBody.post;
};

export const getPost = async (userId, postId, query = "") => {
  const { error, responseBody } = await GET(`users/${userId}/posts/${postId}?${query}`);
  if (error) throw error;
  return responseBody.post;
};

export const getPosts = async (userId, query = "") => {
  const { error, responseBody } = await GET(`users/${userId}/posts?${query}`);
  if (error) throw error;
  return responseBody.posts;
};

export const getPostCount = async (userId, query = " ") => {
  const { error, responseBody } = await GET(`users/${userId}/posts?${query}`);
  if (error) throw error;
  return responseBody.count;
};

export const patchPost = async (userId, postId, props) => {
  const { error } = await PATCH(`users/${userId}/posts/${postId}`, props);
  if (error) throw error;
};

export const deletePost = async (userId, postId) => {
  const { error } = await DELETE(`users/${userId}/posts/${postId}`);
  if (error) throw error;
};
