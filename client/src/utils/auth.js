export const getRoleRedirect = (role) => {
  if (role === "tenant") return "/properties";
  return "/dashboard";
};
