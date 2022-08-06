import { DELETE, GET, PATCH, POST } from "./httpService";

const getResource = async (userId, fileId, postId, commentId, voteId = "") => {
  let resource;

  if (fileId && !commentId) {
    resource = `users/${userId}/media/${fileId}/votes/${voteId}`;
  } else if (fileId && commentId) {
    resource = `users/${userId}/media/${fileId}/comments/${commentId}/votes/${voteId}`;
  } else if (postId && !commentId) {
    resource = `users/${userId}/posts/${postId}/votes/${voteId}`;
  } else if (postId && commentId) {
    resource = `users/${userId}/posts/${postId}/comments/${commentId}/votes/${voteId}`;
  }

  return resource;
};

export const postVote = async (userId, idByKey, vote) => {
  const { fileId, postId, commentId, voteId } = idByKey;
  const resource = await getResource(userId, fileId, postId, commentId, voteId);
  const { error, responseBody } = await POST(resource, vote);
  if (error) throw error;
  return responseBody.vote;
};

export const getVote = async (userId, idByKey, query = "") => {
  const { fileId, postId, commentId, voteId } = idByKey;
  const resource = await getResource(userId, fileId, postId, commentId, voteId);
  const { error, responseBody } = await GET(`${resource}?${query}`);
  if (error) throw error;
  return responseBody.vote;
};

export const getVotes = async (userId, idByKey, query = "") => {
  const { fileId, postId, commentId, voteId } = idByKey;
  const resource = await getResource(userId, fileId, postId, commentId, voteId);
  const { error, responseBody } = await GET(`${resource}?${query}`);
  if (error) throw error;
  return responseBody.votes;
};

export const getVoteCount = async (userId, idByKey, query = " ") => {
  const { fileId, postId, commentId, voteId } = idByKey;
  const resource = await getResource(userId, fileId, postId, commentId, voteId);
  const { error, responseBody } = await GET(`${resource}?${query}`);
  if (error) throw error;
  return responseBody.count;
};

export const patchVote = async (userId, idByKey, props) => {
  const { fileId, postId, commentId, voteId } = idByKey;
  const resource = await getResource(userId, fileId, postId, commentId, voteId);
  const { error } = await PATCH(resource, props);
  if (error) throw error;
};

export const deleteVote = async (userId, idByKey) => {
  const { fileId, postId, commentId, voteId } = idByKey;
  const resource = await getResource(userId, fileId, postId, commentId, voteId);
  const { error } = await DELETE(resource);
  if (error) throw error;
};
