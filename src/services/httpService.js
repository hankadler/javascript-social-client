import config from "../config";
import ServerError from "../errors/ServerError";
import ClientError from "../errors/ClientError";

const getResponseBody = async (response) => {
  let error;
  let responseBody;

  if (response.status >= 500) {
    error = new ServerError(response.statusText, response.status);
  } else if (response.status >= 400) {
    error = new ClientError(response.statusText, response.status);
  } else {
    responseBody = await response.json();
  }

  if (config.showHttpLog && responseBody) console.log(responseBody);

  if (error) {
    if (responseBody) {
      const message = responseBody.error.message || responseBody.message;
      error = new ClientError(message, error.code);
    }
  }

  return { error, responseBody };
};

export const POST = async (resource, requestBody) => {
  if (config.showHttpLog) console.log(`--- POST ${resource} ---`);

  const path = `${config.api}/${resource}`;
  const response = await fetch(path, {
    method: "POST",
    body: JSON.stringify(requestBody),
    headers: { "Content-Type": "application/json" }
  });

  return getResponseBody(response);
};

export const GET = async (resource) => {
  if (config.showHttpLog) console.log(`--- GET ${resource} ---`);

  const path = `${config.api}/${resource}`;
  const response = await fetch(path);

  return getResponseBody(response);
};

export const PATCH = async (resource, requestBody) => {
  if (config.showHttpLog) console.log(`--- PATCH ${resource} ---`);

  const path = `${config.api}/${resource}`;
  const response = await fetch(path, {
    method: "PATCH",
    body: JSON.stringify(requestBody),
    headers: { "Content-Type": "application/json" }
  });

  return getResponseBody(response);
};

export const DELETE = async (resource) => {
  if (config.showHttpLog) console.log(`--- DELETE ${resource} ---`);

  const path = `${config.api}/${resource}`;
  const response = await fetch(path, { method: "DELETE" });

  return getResponseBody(response);
};
