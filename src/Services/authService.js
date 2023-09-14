import jwtDecode from "jwt-decode";
export function getToken() {
  return localStorage.getItem("token");
}
export function setToken(token) {
  localStorage.setItem("token", token);
}
export function clearToken() {
  localStorage.removeItem("token");
}
export function getDecodedToken() {
  return jwtDecode(getToken());
}
export const authHeader = {
  headers: { ["x-auth-token"]: getToken() },
};
