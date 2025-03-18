import { describe, expect, it } from "vitest";
import { buildFullPath } from "./buildFullPath";

describe("utils::buildFullPath", () => {
  it("should combine URLs when the requestedURL is relative", () => {
    expect(buildFullPath("https://api.github.com", "/users", true)).toBe(
      "https://api.github.com/users",
    );
  });

  it("should not combine the URLs when the requestedURL is absolute", () => {
    expect(
      buildFullPath(
        "https://api.github.com",
        "https://api.example.com/users",
        true,
      ),
    ).toBe("https://api.example.com/users");
  });

  it("should combine the URLs when the requestedURL is absolute and allowAbsoluteUrls is false", () => {
    expect(
      buildFullPath(
        "https://api.github.com",
        "https://api.example.com/users",
        false,
      ),
    ).toBe("https://api.github.com/https://api.example.com/users");
  });

  it("should not combine URLs when the baseURL is not configured", () => {
    expect(buildFullPath("", "/users", true)).toBe("/users");
  });

  it("should combine URLs when the baseURL and requestedURL are relative", () => {
    expect(buildFullPath("/api", "/users", true)).toBe("/api/users");
  });
});
