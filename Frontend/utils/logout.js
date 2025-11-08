import API_URL from "./api";

export const logout = async (navigate) => {
  try {
    const res = await fetch(`${API_URL}/logout`, {
      method: "GET",
      credentials: "include",
    });

    if (res.ok) {
      console.log("✅ Logged out successfully");
      const res = await fetch(`${API_URL}/checkAuth`, {
        credentials: "include",
      });
      const data = await res.json();
      console.log(data);
      navigate("/"); // redirect to login
    } else {
      console.error("❌ Logout failed");
    }
  } catch (err) {
    console.error("🚨 Error logging out:", err);
  }
};
