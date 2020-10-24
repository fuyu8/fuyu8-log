import React from "react"
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0"

import Bio from "./bio"

export default {
  title: "Example/Bio",
  component: Bio,
  argTypes: {
    backgroundColor: { control: "color" },
  },
} as Meta

const Template: Story = () => <Bio />

export const Primary = Template.bind({})
