import { Meta, StoryFn } from "@storybook/react";

import * as React from "react";
import { SectionTitle } from "../components/SectionTitle";

export default {
  title: "SectionTitle",
  component: SectionTitle,
  argTypes: {},
} as Meta<typeof SectionTitle>;

const Template: StoryFn<typeof SectionTitle> = (args) => (
  <SectionTitle {...args} />
);

export const Primary = Template.bind({});

Primary.args = {
  text: "Section Title Content",
};
