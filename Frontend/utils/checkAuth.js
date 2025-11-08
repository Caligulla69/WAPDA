import API_URL from "./api";

export const checkAuth = async () => {
  const res = await fetch(`${API_URL}/checkAuth`, { credentials: "include",method:"GET" });
  const data = await res.json();
  console.log(data.isLoggedIn);
  
  return data.isLoggedIn
};
