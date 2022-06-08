import type { ComponentStory, ComponentMeta } from "@storybook/react";

import Ring from "../../../../app/components/account-summary/ring";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Tender/AccountSummary/Ring",
  component: Ring,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: "color" },
  },
} as ComponentMeta<typeof Ring>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Ring> = (args) => <Ring {...args} />;

export const Primary = Template.bind({});
export const Empty = Template.bind({});
export const Full = Template.bind({});
export const Negative = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  percent: 50,
};

Empty.args = {
  percent: 0,
};

Full.args = {
  percent: 100,
};

Negative.args = {
  percent: -25,
};
