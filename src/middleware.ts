export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/projects/:path*",
    "/customers/:path*",
    "/buildings/:path*",
    "/tasks/:path*",
    "/profile/:path*",
  ],
};
