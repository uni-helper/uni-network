import { describe, it, expect } from "vitest";
import { buildFullPath } from "./buildFullPath";

describe("utils::buildFullPath", () => {
  it("should combine URLs when the requestedURL is relative", () => {
    expect(buildFullPath("https://api.github.com", "/users")).toBe(
      "https://api.github.com/users",
    );
  });

  it("should return the requestedURL when it is absolute", () => {
    expect(
      buildFullPath("https://api.github.com", "https://api.example.com/users"),
    ).toBe("https://api.example.com/users");
  });

  it("should not combine URLs when the baseURL is not configured", () => {
    expect(buildFullPath("", "/users")).toBe("/users");
  });

  it("should combine URLs when the baseURL and requestedURL are relative", () => {
    expect(buildFullPath("/api", "/users")).toBe("/api/users");
  });
});
