import axios from "axios";
import qs from "qs";
import process from "../app/config";

const getObject = function (key) {
  var value = sessionStorage.getItem(key);
  return value && JSON.parse(value);
};

const setObject = function (key, value) {
  sessionStorage.setItem(key, JSON.stringify(value));
};

async function init({ dispatch }) {
  initAxios(dispatch);
  setInterceptors();
  return await initAuthentication({ dispatch });
}

function setInterceptors() {
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    async function (error) {
      const originalRequest = error.config;
      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        const newToken = await getToken();
        if (newToken) {
          axios.defaults.headers["authorization"] = newToken.access_token;
          originalRequest.headers["authorization"] = newToken.access_token;
        }
        return axios(originalRequest);
      }
      return Promise.reject(error);
    }
  );
}

/* eslint-disable no-unused-vars */
function initAxios(dispatch) {
  const credentials = getObject("cliddw_credentials");
  if (credentials && credentials.access_token) {
    axios.defaults.headers["authorization"] = credentials.access_token;
  }
  axios.defaults.headers.common["Content-Type"] = "application/json";
  axios.defaults.headers.common["appkey"] = process.env.AXP_API_APP_KEY;
}

async function initAuthentication({ dispatch }) {
  const credentials = getObject("cliddw_credentials");

  if (!credentials || !credentials.access_token) {
    return getToken().then((token) => {
      if (!token) return { logout: true };
      else {
        axios.defaults.headers["authorization"] = token.access_token;
        return { logout: false };
      }
    });
  } else if (
    credentials &&
    credentials.access_token &&
    new Date(credentials.expiry_date) > new Date()
  ) {
    //valid token
    axios.defaults.headers.common["authorization"] = credentials.access_token;
    return { logout: false };
  } else if (
    credentials &&
    credentials.access_token &&
    new Date(credentials.expiry_date) < new Date()
  ) {
    //expired token
    return getToken().then((token) => {
      if (!token) return { logout: true };
      else {
        axios.defaults.headers["authorization"] = token.access_token;
        return { logout: false };
      }
    });
  } else {
    return { logout: true };
  }
}

async function getToken() {
  const data = qs.stringify({
    grant_type: "client_credentials",
    client_id: `${process.env.AXP_CLIENT_ID}`,
  });

  const config = {
    method: "post",
    url: `${process.env.AXP_PROXY_BASE_URL}/api/auth/v1/${process.env.AXP_ACCOUNT_ID}/protocol/openid-connect/token`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data: data,
  };

  return axios(config)
    .then(function (response) {
      const expiry_date = new Date(
        new Date().getTime() + response.data.expires_in * 1000
      );
      const creds = {
        ...response.data,
        access_token: `Bearer ${response.data.access_token}`,
        expiry_date: expiry_date,
      };
      setObject("cliddw_credentials", creds);
      return creds;
    })
    .catch(function (error) {
      return undefined;
    });
}

async function refreshToken(refToken) {
  const data = qs.stringify({
    grant_type: "refresh_token",
    client_id: `${process.env.AXP_CLIENT_ID}`,
    refresh_token: refToken,
  });

  const config = {
    method: "post",
    url: `${process.env.AXP_PROXY_BASE_URL}/api/auth/v1/${process.env.AXP_ACCOUNT_ID}/protocol/openid-connect/token`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  };

  return axios(config)
    .then(function (response) {
      const expiry_date = new Date(
        new Date().getTime() + response.data.expires_in * 1000
      );
      setObject("cliddw_credentials", {
        ...response.data,
        access_token: `Bearer ${response.data.access_token}`,
        expiry_date: expiry_date,
      });
      return response.data;
    })
    .catch(function (error) {
      return undefined;
    });
}
export default init;
