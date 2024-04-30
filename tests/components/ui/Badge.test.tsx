import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import React from "react";
import { Badge } from "#/components";

describe("Badge component", () => {
  it("renders with primary style", () => {
    const { container } = render(<Badge color="primary" />);
    expect(container.firstChild).toHaveClass(
      "bg-primary text-primary-foreground hover:bg-primary/80"
    );
  });

  it("renders with secondary outline style", () => {
    const { container } = render(<Badge color="secondary" outline="outline" />);
    expect(container.firstChild).toHaveClass(
      "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-secondary border-2 hover:border-current/80"
    );
  });

  it("renders with size variants", () => {
    const { container: small } = render(<Badge size="sm" />);
    const { container: large } = render(<Badge size="lg" />);
    expect(small.firstChild).toHaveClass("text-sm");
    expect(large.firstChild).toHaveClass("text-lg");
  });

  it("renders custom className", () => {
    const { container } = render(<Badge className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("renders the correct class with compound variants", () => {
    const { container } = render(
      <Badge color="destructive" outline="outline" />
    );
    expect(container.firstChild).toHaveClass("border-destructive");
  });
});
