const env = "dev";
const api = "/social/api/v1";
const showHttpLog = false;
const charLimit = {
  about: 300,
  caption: 300,
  comment: 600,
  post: 1200,
  message: 1200
};
const fileTypes = ["JPG", "PNG", "GIF"];
const peoplePerPage = 5; // todo: change to 20

export default { env, api, showHttpLog, charLimit, fileTypes, peoplePerPage };
