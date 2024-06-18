import { describe, expect, it } from "vitest";
import { serializeQuery, deserializeQuery } from "../../src/lib/serializeQuery";

describe("Query Serialization and Deserialization", () => {
  it("handles round-trip serialization and deserialization of nested objects", () => {
    const originalParams = {
      user: {
        name: "Alice",
        age: 28,
        hobbies: ["coding", "hiking"],
      },
    };
    const queryString = serializeQuery(originalParams);
    const deserializedParams = deserializeQuery(queryString);
    expect(deserializedParams).toEqual({
      user: { name: "Alice", age: "28", hobbies: ["coding", "hiking"] },
    });
  });

  describe("Serialization", () => {
    // Basic Serialization Tests
    it("serializes basic flat objects", () => {
      const params = { name: "John", age: 30 };
      expect(serializeQuery(params)).toBe("name=John&age=30");
    });

    // Nested Serialization Tests
    it("serializes nested objects", () => {
      const nestedParams = { user: { name: "John", age: 30 } };
      expect(serializeQuery(nestedParams)).toBe("user[name]=John&user[age]=30");
    });

    it("serializes arrays in nested objects", () => {
      const params = {
        user: {
          hobbies: ["reading", "swimming"],
        },
      };
      expect(serializeQuery(params)).toBe(
        "user[hobbies][]=reading&user[hobbies][]=swimming"
      );
    });

    it("serializes deeply nested objects", () => {
      const params = {
        user: {
          details: {
            name: "John",
            age: 30,
            address: { city: "New York", zip: 10001 },
          },
        },
      };
      expect(serializeQuery(params)).toBe(
        "user[details][name]=John&user[details][age]=30&user[details][address][city]=New%20York&user[details][address][zip]=10001"
      );
    });

    it("handles special characters in keys and values", () => {
      const params = { "na/me": "John Doe", age: "30&31" };
      expect(serializeQuery(params)).toBe("na%2Fme=John%20Doe&age=30%2631");
    });

    // Edge Case Serialization Tests
    it("handles empty objects", () => {
      expect(serializeQuery({})).toBe("");
    });

    it("throws error for non-object inputs in serializeQuery", () => {
      expect(() => serializeQuery(null)).toThrow();
    });
  });

  describe("Deserialization", () => {
    // Basic Deserialization Tests
    it("deserializes basic query strings", () => {
      const queryString = "name=John&age=30";
      expect(deserializeQuery(queryString)).toEqual({
        name: "John",
        age: "30",
      });
    });

    // Nested Deserialization Tests
    it("deserializes nested query strings", () => {
      const queryString = "user[name]=John&user[age]=30";
      expect(deserializeQuery(queryString)).toEqual({
        user: { name: "John", age: "30" },
      });
    });

    it("deserializes arrays in query strings", () => {
      const queryString = "user[hobbies][]=reading&user[hobbies][]=swimming";
      expect(deserializeQuery(queryString)).toEqual({
        user: { hobbies: ["reading", "swimming"] },
      });
    });

    // Edge Case Deserialization Tests
    it("handles empty query strings", () => {
      expect(deserializeQuery("")).toEqual({});
    });

    it("handles query strings with only a key", () => {
      expect(deserializeQuery("key")).toEqual({ key: "" });
    });

    // TODO
    // it("handles malformed query strings", () => {
    //   const queryString = "user[name=John&user[age]=30";
    //   expect(() => deserializeQuery(queryString)).toThrow();
    // });

    it("throws error for invalid input types in deserializeQuery", () => {
      // @ts-ignore-next-line
      expect(() => deserializeQuery(null)).toThrow();
    });
  });
});
