import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn utility", () => {
  it("joins classes", () => {
    expect(cn("a", false && "b", "c")).toBe("a c");
  });
});
