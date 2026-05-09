import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
	typescript: {
		reactDocgen: 'react-docgen-typescript',
	},
	stories: ['../src/components/storybook-showcase/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
	addons: ['@storybook/addon-onboarding', '@storybook/addon-essentials', '@chromatic-com/storybook', '@storybook/addon-interactions'],
	framework: {
		name: '@storybook/react-vite',
		options: {},
	},
};
export default config;
