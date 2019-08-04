import fetch from "isomorphic-fetch";

export const fetchUserDetails = function (userName) {
  return fetch(`https://api.github.com/users/${userName}`)
    .then(response => {
      return response.json()
    })
};

export const fetchUserRealHistory = function (userName) {
  return fetch(`https://api.github.com/users/${userName}/events/public`)
    .then(response => {
      return response.json()
    })
};