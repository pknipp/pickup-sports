import Cookies from "js-cookie";

const SET_USER = "volleyball/authentication/SET_USER";
const SET_MESSAGE="volleyball/authentication/SET_MESSAGE";
const REMOVE_USER = "volleyball/authentication/REMOVE_USER";
const NEW_USER = "volleyball/authentication/NEW_USER";

export const setUser    = user   => ({ type: SET_USER, user });
export const setMessage = message=> ({type: SET_MESSAGE, message});
export const removeUser = _      => ({ type: REMOVE_USER    });
export const newUser    = user   => ({ type: NEW_USER, user });

export const login = (email, password) => {
  return async dispatch => {
    const response = await fetch(`/api/session`, { method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    let data = await response.json();
    if (response.ok) dispatch(setUser(data.user))
    if (!response.ok)dispatch(setMessage(data.error.errors[0].msg || data.message))
  };
};

export const signup = (email, password) => {
  return async dispatch => {
    const res = await fetch(`/api/users`, { method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    let user = (await res.json()).user;
    // dispatch(res.ok ? setUser(data.user) : setMessage(data.error.errors[0].msg));
    dispatch(setUser(user));
  };
};

export const editUser = (email, password, id) => {
  return async dispatch => {
    const res = await fetch(`/api/users`, { method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, id })
    });
    let user = (await res.json()).user;
    // dispatch(res.ok ? setUser(data.user) : setMessage(data.error.errors[0].msg));
    dispatch(setUser(user));
  };
};

export const deleteUser = id => {
  return async dispatch => {
    const res = await fetch(`/api/users/${id}`, { method: 'DELETE'});
    // if (res.ok) dispatch(removeUser());
    let data = await res.json();
    dispatch(!data.message ? removeUser() : setMessage(data.message));
  }
}

export const logout = _ => async dispatch => {
  const res = await fetch('/api/session', { method: "delete" });
  if (res.ok) dispatch(removeUser());
}

export const resetMessage = _ => dispatch => dispatch(setMessage(""));

const loadUser = () => {
  const authToken = Cookies.get("token");
  if (authToken) {
    try {
      const payloadObj = JSON.parse(atob(authToken.split(".")[1]))
      return payloadObj.data;
    } catch (e) {
      Cookies.remove("token");
    }
  }
  return {};
}

export default function reducer(state=loadUser(), action) {
  let newState = {...state}
  switch (action.type) {
    case SET_USER:
      return action.user;
    case SET_MESSAGE:
      newState.message = action.message;
      return newState;
    case REMOVE_USER:
      return {};
    default:
      return state;
  }
}
