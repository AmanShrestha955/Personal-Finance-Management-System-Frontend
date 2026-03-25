// import { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";

// const PUBLIC_ROUTES = ["/", "/sign-in", "/sign-up"];

// const isTokenExpired = (token: string): boolean => {
//   try {
//     const payload = JSON.parse(atob(token.split(".")[1]));
//     return payload.exp * 1000 < Date.now();
//   } catch {
//     return true;
//   }
// };

// const useProtectRoute = () => {
//   const navigate = useNavigate();
//   const { pathname } = useLocation();
//   const [isAuthorized, setIsAuthorized] = useState(false);

//   useEffect(() => {
//     if (PUBLIC_ROUTES.includes(pathname)) {
//       setIsAuthorized(true);
//       return;
//     }

//     const token = localStorage.getItem("token");

//     if (!token || isTokenExpired(token)) {
//       localStorage.removeItem("token");
//       navigate("/sign-in", { replace: true });
//       return;
//     }

//     setIsAuthorized(true);
//   }, [pathname, navigate]);

//   return { isAuthorized };
// };

// export default useProtectRoute;
