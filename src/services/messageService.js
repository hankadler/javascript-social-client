import { DELETE, GET, PATCH, POST } from "./httpService";

export const postMessage = async (userId, conversationId, message) => {
  const resource = `users/${userId}/conversations/${conversationId}/messages`;
  const { error, responseBody } = await POST(resource, message);
  if (error) throw error;
  return responseBody.message;
};

export const getMessage = async (userId, conversationId, messageId, query = "") => {
  const resource = `users/${userId}/conversations/${conversationId}/messages/${messageId}?${query}`;
  const { error, responseBody } = await GET(resource);
  if (error) throw error;
  return responseBody.message;
};

export const getMessages = async (userId, conversationId, query = "") => {
  const resource = `users/${userId}/conversations/${conversationId}/messages?${query}`;
  const { error, responseBody } = await GET(resource);
  if (error) throw error;
  return responseBody.messages;
};

export const getMessageCount = async (userId, conversationId, query = " ") => {
  const resource = `users/${userId}/conversations/${conversationId}/messages?${query}`;
  const { error, responseBody } = await GET(resource);
  if (error) throw error;
  return responseBody.count;
};

export const patchMessage = async (userId, conversationId, messageId, props) => {
  const resource = `users/${userId}/conversations/${conversationId}/messages/${messageId}`;
  const { error } = await PATCH(resource, props);
  if (error) throw error;
};

export const deleteMessage = async (userId, conversationId, messageId) => {
  const resource = `users/${userId}/conversations/${conversationId}/messages/${messageId}`;
  const { error } = await DELETE(resource);
  if (error) throw error;
};
