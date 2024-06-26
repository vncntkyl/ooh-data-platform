/* eslint-disable react/prop-types */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { devEndpoints as url } from "./endpoints";
import Cookies from "js-cookie";
import { useLocation, useNavigate } from "react-router-dom";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const domain =
    window.location.hostname == "localhost" ? "localhost" : "scmiph.com";

  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [alert, setAlert] = useState({
    isOn: false,
    type: "info",
    message: "Sample only",
  });

  const signInUser = async (username, password) => {
    try {
      const response = await axios.post(url.login, {
        username: username,
        password: password,
      });

      if (response.status === 200) {
        console.log(response.data);
        if (response.data.id) {
          Cookies.set("token", response.data?.token, {
            domain: domain,
          });
          const { role_id } = response.data;
          const role = await retrieveRole(role_id);

          Cookies.set("role", JSON.stringify(role), {
            domain: "." + domain,
          });
          Cookies.set("user", JSON.stringify(response.data), {
            domain: "." + domain,
          });
          setUser(response.data);
          return { acknowledged: true, role: role };
        }
      }
    } catch (e) {
      return e.response;
    }
  };
  const registerUser = async (user) => {
    try {
      const response = await axios.post(url.register, user, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(response);
    } catch (e) {
      console.log(e);
    }
  };
  const retrieveRole = async (id) => {
    try {
      const response = await axios.get(url.roles, {
        params: {
          id: id,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      return response.data;
    } catch (e) {
      console.log(e);
    }
  };
  const logoutUser = () => {
    Cookies.remove("user", { domain: domain });
    Cookies.remove("role", { domain: domain });
    Cookies.remove("siteCache", { domain: domain });
    setUser(null);
    setRole(null);
    console.log(Cookies.get("user"), Cookies.get("role"));
    navigate("/login");
  };
  const verifyEmail = async (email) => {
    try {
      const response = await axios.post(
        url.email,
        { email_address: email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (e) {
      console.log(e);
      if (e.response.data) {
        return e.response.data;
      }
    }
  };
  const changePassword = async (id, password) => {
    try {
      const response = await axios.patch(
        url.password,
        { id: id, password: password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      return response.data;
    } catch (e) {
      console.log(e);
      if (e.response.data) {
        return e.response.data;
      }
    }
  };
  function CheckPermission({ path, children }) {
    const permissions = role ? role.permissions.client.modules : null;

    return permissions !== null && permissions[path]?.view && <>{children}</>;
  }
  function isViewable(array) {
    const permissions = role ? role.permissions.client.modules : null;

    return (
      permissions !== null &&
      array.some((link) => {
        return permissions[link]?.view;
      })
    );
  }
  const value = {
    user,
    role,
    alert,
    setAlert,
    signInUser,
    registerUser,
    logoutUser,
    verifyEmail,
    changePassword,
    CheckPermission,
    isViewable,
  };

  useEffect(() => {
    // console.log(Cookies.get("user"), Cookies.get("role"));
    if (Cookies.get("user") && Cookies.get("role")) {
      setUser(JSON.parse(Cookies.get("user")));
      setRole(JSON.parse(Cookies.get("role")));
      // const modules = JSON.parse(Cookies.get("role")).permissions.client
      //   .modules;
      // const filteredResults = {};
      // for (const [key, value] of Object.entries(modules)) {
      //   if (value.view) {
      //     filteredResults[key] = value;
      //   }
      // }

      // console.log(Object.keys(filteredResults).length !== 0);
    } else {
      if (
        !["/login", "/register", "/forgot-password", "/password-recovery"].some(
          (path) => location.pathname.startsWith(path)
        )
      ) {
        navigate("/login");
      }
    }
  }, [location.pathname]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
