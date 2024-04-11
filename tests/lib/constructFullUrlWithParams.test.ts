import { beforeAll, describe, expect, it, vi } from "vitest";
import { constructFullUrlWithParams } from "../../src/lib/constructFullUrlWithParams";

describe("constructFullUrlWithParams", () => {
  beforeAll(() => {
    vi.stubGlobal("location", { origin: "http://localhost" });
  });

  it("should throw an error if the base URL is not a string", () => {
    // @ts-expect-error
    expect(() => constructFullUrlWithParams(null, {})).toThrow(
      "Base URL must be a string."
    );
  });

  it("should correctly handle full URLs", () => {
    const fullUrl = "http://example.com";
    const queryParams = { section: "blog", article: 123 };
    const result = constructFullUrlWithParams(fullUrl, queryParams);
    expect(result).toBe("http://example.com/?section=blog&article=123");
  });

  it("should correctly handle relative paths", () => {
    const relativePath = "/path/to/resource";
    const queryParams = { section: "blog", article: 123 };
    const result = constructFullUrlWithParams(relativePath, queryParams);
    expect(result).toBe(
      "http://localhost/path/to/resource?section=blog&article=123"
    );
  });

  it("should correctly add simple query parameters to a base URL", () => {
    const baseUrl = "http://example.com";
    const queryParams = { name: "John", age: 30 };
    const result = constructFullUrlWithParams(baseUrl, queryParams);
    expect(result).toBe("http://example.com/?name=John&age=30");
  });

  it("should handle nested objects and arrays in query parameters", () => {
    const baseUrl = "http://example.com";
    const queryParams = {
      user: { name: "John", roles: ["admin", "user"] },
      active: true,
    };
    const result = constructFullUrlWithParams(baseUrl, queryParams);
    expect(result).toBe(
      "http://example.com/?user[name]=John&user[roles][]=admin&user[roles][]=user&active=true"
    );
  });

  it("should handle special characters in query parameters", () => {
    const baseUrl = "http://example.com";
    const queryParams = { greeting: "hello world", symbols: "!@#$%^&*" };
    const result = constructFullUrlWithParams(baseUrl, queryParams);
    expect(result).toBe(
      "http://example.com/?greeting=hello%20world&symbols=!%40%23%24%25%5E%26*"
    );
  });

  it("should merge and serialize existing query parameters with new ones", () => {
    const baseUrl = "http://example.com?name=Jane&active=true";
    const queryParams = { age: 30, active: false };
    const result = constructFullUrlWithParams(baseUrl, queryParams);
    expect(result).toBe("http://example.com/?name=Jane&active=false&age=30");
  });

  it("should override existing parameters with new ones", () => {
    const baseUrl = "http://example.com?name=Jane";
    const queryParams = { name: "John", age: 30 };
    const result = constructFullUrlWithParams(baseUrl, queryParams);
    expect(result).toBe("http://example.com/?name=John&age=30");
  });
});
