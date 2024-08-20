import React from "react";

import { Meta, StoryObj } from "@storybook/react";
import { Separator } from "../components/ui/Separator";

const meta = {
  title: "Components/Separator",
  component: () => (
    <div>
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
        <p className="text-sm text-muted-foreground">
          An open-source UI component library.
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </div>
  ),
  parameters: {
    layout: "centered",
  },
} satisfies Meta<{}>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SeparatorDemo: Story = {
  args: {},
};

export const SeparatorHorizontal: Story = {
  args: {},
  render: () => (
    <div className="flex flex-col gap-2">
      <h1>Bleu Builders UI</h1>
      <Separator orientation="horizontal" />
      <p>Bleu components are built with Radix Primitives, inspired in shadcn</p>
    </div>
  ),
};

export const SeparatorVertical: Story = {
  args: {},
  render: () => (
    <div className="flex gap-2">
      <span>Bleu Builders Builders</span>
      <Separator orientation="vertical" />
      <span>UI</span>
    </div>
  ),
};
