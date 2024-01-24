import renderer from "react-test-renderer";
import { expect, it } from "vitest";
import { SectionTitle } from "../src/components/SectionTitle";

it("renders correctly", () => {
  const tree = renderer
    .create(<SectionTitle>Section Title Content</SectionTitle>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
