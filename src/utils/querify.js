const querify = (query) => Object.entries(query).map(([k, v]) => `${k}=${v}`).join("&");

export default querify;
