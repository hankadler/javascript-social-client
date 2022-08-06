import { DELETE, GET, PATCH, POST } from "./httpService";

export const postFile = async (userId, file) => {
  const { error, responseBody } = await POST(`users/${userId}/media`, file);
  if (error) throw error;
  return responseBody.file;
};

export const getFile = async (userId, fileId, query = "") => {
  const { error, responseBody } = await GET(`users/${userId}/media/${fileId}?${query}`);
  if (error) throw error;
  return responseBody.file;
};

export const getMedia = async (userId) => {
  const { error, responseBody } = await GET(`users/${userId}`);
  if (error) throw error;
  return responseBody.user.media;
};

export const patchFile = async (userId, fileId, props) => {
  const { error } = await PATCH(`users/${userId}/media/${fileId}`, props);
  if (error) throw error;
};

export const patchMedia = async (userId, fileIds, props) => {
  await Promise.all(fileIds.map((fileId) => patchFile(userId, fileId, props)));
};

export const deleteFile = async (userId, fileId) => {
  const { error } = await DELETE(`users/${userId}/media/${fileId}`);
  if (error) throw error;
};

export const deleteMedia = async (userId, fileIds = []) => {
  if (fileIds.length) {
    await Promise.all(fileIds.map((fileId) => patchFile(userId, fileId, { tag: "Delete" })));
    await DELETE(`users/${userId}/media?tag=Delete`);
  } else {
    await DELETE(`users/${userId}/media`);
  }
};
