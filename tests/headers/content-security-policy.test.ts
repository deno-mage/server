import { afterAll, beforeAll, describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { contentSecurityPolicy, StatusCode } from "../../mod.ts";
import { MageTestServer } from "../../test-utils/server.ts";

let server: MageTestServer;

beforeAll(() => {
  server = new MageTestServer();

  server.app.get("/", (context) => {
    contentSecurityPolicy(context, {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://example.com"],
      },
    });

    context.text(StatusCode.OK, "Hello, World!");
  });

  server.start();
});

afterAll(async () => {
  await server.stop();
});

describe("headers - content-security-policy", () => {
  it("should set security headers", async () => {
    const response = await fetch(server.url("/"), {
      method: "GET",
    });

    // drain response to ensure no memory leak
    await response.text();

    expect(response.headers.get("Content-Security-Policy")).toEqual(
      "default-src 'self';script-src 'self' https://example.com",
    );
  });
});