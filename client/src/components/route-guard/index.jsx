import { Navigate, useLocation } from "react-router-dom";
import { Fragment } from "react";

function RouteGuard({ authenticated, user, element }) {
  const location = useLocation();
  const isAdmin = user?.role === "admin";
  const isInstructor = user?.role === "instructor";

  console.log(authenticated, user, "useruser");

  if (!authenticated && !location.pathname.includes("/auth")) {
    return <Navigate to="/auth" />;
  }

  if (
    authenticated &&
    !isAdmin &&
    !isInstructor &&
    (location.pathname.includes("instructor") ||
      location.pathname.includes("admin") ||
      location.pathname.includes("/auth"))
  ) {
    return <Navigate to="/home" />;
  }

  if (
    authenticated &&
    isInstructor &&
    !location.pathname.includes("instructor")
  ) {
    return <Navigate to="/instructor" />;
  }

  if (
    authenticated &&
    isAdmin &&
    !location.pathname.includes("admin") &&
    !location.pathname.includes("instructor")
  ) {
    return <Navigate to="/admin" />;
  }

  return <Fragment>{element}</Fragment>;
}

export default RouteGuard;
