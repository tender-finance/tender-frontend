const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
  stories: [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  staticDirs: ["../public"],
  framework: "@storybook/react",
  webpackFinal: async (config) => {
    config.resolve.plugins = [
      ...(config.resolve.plugins || []),
      new TsconfigPathsPlugin(),
    ];

    return config;
  },
};
