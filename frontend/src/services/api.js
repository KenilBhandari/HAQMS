const headers = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

export const get = (baseUrl, path, token) =>
  fetch(`${baseUrl}${path}`, { headers: headers(token) }).then(r => r.json());

export const post = (baseUrl, path, token, body) =>
  fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(body),
  }).then(r => r.json());

export const patch = (baseUrl, path, token, body) =>
  fetch(`${baseUrl}${path}`, {
    method: 'PATCH',
    headers: headers(token),
    body: JSON.stringify(body),
  }).then(r => r.json());

export const del = (baseUrl, path, token) =>
  fetch(`${baseUrl}${path}`, {
    method: 'DELETE',
    headers: headers(token),
  }).then(r => r.json());
