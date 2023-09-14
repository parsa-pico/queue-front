import { clearToken } from "../Services/authService.js";
export function getBackUrl() {
  const url = process.env.REACT_APP_API_URL;
  console.log(url);
  if (!url) throw new Error("back end url not defined");
  else return url;
}
export function handleLogout() {
  clearToken();
  window.location = `/`;
}
export async function tryHTTP(func) {
  try {
    await func();
  } catch (e) {
    if (e && e.response) {
      const expectedError =
        e.response && e.response.status >= 400 && e.response.status < 500;
      if (expectedError) alert(e.response.data);
    } else alert(e.message);
  }
}
export function areDatesOnSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}
