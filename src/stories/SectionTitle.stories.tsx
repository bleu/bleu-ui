import { StoryFn } from "@storybook/react";

import * as React from "react";
import { SectionTitle } from "../components/SectionTitle";

export default {
  title: "SectionTitle",
  component: SectionTitle,
  argTypes: {
    text: { control: "text" },
  },
};

const Template: StoryFn<typeof SectionTitle> = (args) => (
  <SectionTitle {...args} />
);

export const Primary: StoryFn<typeof SectionTitle> = Template.bind({
  text: "Section Title Content",
});

Primary.args = {
  // @ts-ignore
  text: "Section Title Content",
};
