import { DELETE, GET, PATCH, POST } from "./httpService";
import { getMedia } from "./mediaService";
import { getPosts } from "./postService";

const getResource = async (userId, fileId, postId, commentId = "") => {
  let resource;

  if (fileId) {
    resource = `users/${userId}/media/${fileId}/comments/${commentId}`;
  } else if (postId) {
    resource = `users/${userId}/posts/${postId}/comments/${commentId}`;
  } else {
    // find fileId with commentId
    let media = await getMedia(userId, "select=_id,comments");
    media = media.map(({ _id, comments }) => {
      const comment = comments.filter((_comment) => _comment._id === commentId)[0];
      return comment ? ({ _id, comment }) : null;
    }).filter((file) => file);
    const _fileId = media[0] ? media[0]._id : "";

    // find postId with commentId
    let posts = await getPosts(userId, "select=_id,comments");
    posts = posts.map(({ _id, comments }) => {
      const comment = comments.filter((_comment) => _comment._id === commentId)[0];
      return comment ? ({ _id, comment }) : null;
    }).filter((post) => post);
    const _postId = posts[0] ? posts[0]._id : "";

    resource = (
      _fileId
        ? `users/${userId}/media/${_fileId}/comments/${commentId}`
        : `users/${userId}/posts/${_postId}/comments/${commentId}`
    );
  }

  return resource;
};

export const postComment = async (userId, idByKey, comment) => {
  const { fileId, postId, commentId } = idByKey;
  const resource = await getResource(userId, fileId, postId, commentId);
  const { error, responseBody } = await POST(resource, comment);
  if (error) throw error;
  return responseBody.comment;
};

export const getComment = async (userId, idByKey, query = "") => {
  const { fileId, postId, commentId } = idByKey;
  const resource = await getResource(userId, fileId, postId, commentId);
  const { error, responseBody } = await GET(`${resource}?${query}`);
  if (error) throw error;
  return responseBody.comment;
};

export const getComments = async (userId, idByKey, query = "") => {
  const { fileId, postId, commentId } = idByKey;
  const resource = await getResource(userId, fileId, postId, commentId);
  const { error, responseBody } = await GET(`${resource}?${query}`);
  if (error) throw error;
  return responseBody.comments;
};

export const getCommentCount = async (userId, idByKey, query = " ") => {
  const { fileId, postId, commentId } = idByKey;
  const resource = await getResource(userId, fileId, postId, commentId);
  const { error, responseBody } = await GET(`${resource}?${query}`);
  if (error) throw error;
  return responseBody.count;
};

export const patchComment = async (userId, idByKey, props) => {
  const { fileId, postId, commentId } = idByKey;
  const resource = await getResource(userId, fileId, postId, commentId);
  const { error } = await PATCH(resource, props);
  if (error) throw error;
};

export const deleteComment = async (userId, idByKey) => {
  const { fileId, postId, commentId } = idByKey;
  const resource = await getResource(userId, fileId, postId, commentId);
  const { error } = await DELETE(resource);
  if (error) throw error;
};
