import type { MageMiddleware } from "./router.ts";

/**
 * Options for the useMethodNotAllowed middleware.
 */
interface UseMethodNotAllowedOptions {
  /**
   * Function to return methods that are allowed for the requested
   * pathname.
   */
  getAllowedMethods: () => string[];
}

/**
 * Responds with a 405 Method Not Allowed status code. This middleware
 * will ignore OPTIONS requests.
 *
 * @returns MageMiddleware
 */
export const useMethodNotAllowed = (
  options: UseMethodNotAllowedOptions,
): MageMiddleware => {
  return async (c, next) => {
    if (c.req.method === "OPTIONS") {
      // If the request is an OPTIONS request then don't respond with a 405
      await next();
      return;
    }

    c.text("Method Not Allowed", 405);

    c.res.headers.set(
      "Allow",
      options.getAllowedMethods().join(", "),
    );
  };
};
