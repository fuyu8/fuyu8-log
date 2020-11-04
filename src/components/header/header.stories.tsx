import React from "react"
import { Story, Meta } from "@storybook/react/types-6-0"

import Header from "./"

export default {
  title: "Atoms/Header",
  component: Header,
} as Meta

const Template: Story = () => <Header></Header>

export const Default = Template.bind({})
