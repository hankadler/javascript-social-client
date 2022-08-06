import { DELETE, GET, PATCH, POST } from "./httpService";

export const postConversation = async (userId, props) => {
  const resource = `users/${userId}/conversations`;
  const { error, responseBody } = await POST(resource, props);
  if (error) throw error;
  return responseBody.conversation;
};

export const getConversation = async (userId, conversationId, query = "") => {
  const resource = `users/${userId}/conversations/${conversationId}?${query}`;
  const { error, responseBody } = await GET(resource);
  if (error) throw error;
  return responseBody.conversation;
};

export const getConversations = async (userId, query = "") => {
  const resource = `users/${userId}/conversations?${query}`;
  const { error, responseBody } = await GET(resource);
  if (error) throw error;
  return responseBody.conversations;
};

export const getConversationCount = async (userId, query = " ") => {
  const resource = `users/${userId}/conversations?${query}`;
  const { error, responseBody } = await GET(resource);
  if (error) throw error;
  return responseBody.count;
};

export const patchConversation = async (userId, conversationId, props) => {
  const resource = `users/${userId}/conversations/${conversationId}`;
  const { error } = await PATCH(resource, props);
  if (error) throw error;
};

export const deleteConversation = async (userId, conversationId) => {
  const resource = `users/${userId}/conversations/${conversationId}`;
  const { error } = await DELETE(resource);
  if (error) throw error;
};

export const deleteConversations = async (userId, conversationIds) => {
  const resource = `users/${userId}/conversations?id=${conversationIds.join(",")}`;
  const { error } = await DELETE(resource);
  if (error) throw error;
};
