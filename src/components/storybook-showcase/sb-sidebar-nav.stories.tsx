import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import type { ReactNode } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { storyChromeDecorators } from './preview-decorator';
import { SbCollapsibleSidebarNav, type SbNavItem } from './sb-collapsible-sidebar-nav';
import { SbIconHome, SbIconLandmark, SbIconLayers } from './sb-icons';

const items: SbNavItem[] = [
	{ title: 'Home', path: '/home', icon: <SbIconHome className='size-4' /> },
	{
		title: 'Product Catalog',
		path: '/product-catalog/features',
		icon: <SbIconLayers className='size-4' />,
		children: [
			{ title: 'Features', path: '/product-catalog/features' },
			{ title: 'Plans', path: '/product-catalog/plans' },
		],
	},
	{
		title: 'Billing',
		path: '/billing/customers',
		icon: <SbIconLandmark className='size-4' />,
		children: [
			{ title: 'Customers', path: '/billing/customers' },
			{ title: 'Invoices', path: '/billing/invoices' },
		],
	},
];

function shell(initialPath: string, children: ReactNode) {
	return (
		<MemoryRouter initialEntries={[initialPath]}>
			<Routes>
				<Route
					path='*'
					element={
						<div className='flex min-h-[420px] w-full justify-start gap-0 bg-muted/40 p-6'>
							{children}
							<main className='flex flex-1 items-start rounded-lg border border-dashed border-muted-foreground/25 bg-background/80 p-4 text-sm text-muted-foreground'>
								Showcase-only sidebar (not production SidebarMenu).
							</main>
						</div>
					}
				/>
			</Routes>
		</MemoryRouter>
	);
}

const meta: Meta<typeof SbCollapsibleSidebarNav> = {
	title: 'Showcase/Organisms/SidebarNav',
	component: SbCollapsibleSidebarNav,
	tags: ['autodocs'],
	decorators: storyChromeDecorators,
	args: { items },
	parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	decorators: storyChromeDecorators,
	render: () => shell('/product-catalog/plans', <SbCollapsibleSidebarNav items={items} />),
};

export const Variants: Story = {
	decorators: storyChromeDecorators,
	render: () => (
		<div className='grid w-full grid-cols-1 gap-8 lg:grid-cols-2'>
			<div>
				<p className='mb-2 text-xs font-medium uppercase text-muted-foreground'>Product catalog active</p>
				{shell('/product-catalog/plans', <SbCollapsibleSidebarNav items={items} />)}
			</div>
			<div>
				<p className='mb-2 text-xs font-medium uppercase text-muted-foreground'>Billing active</p>
				{shell('/billing/invoices', <SbCollapsibleSidebarNav items={items} />)}
			</div>
		</div>
	),
};

export const NavigateToPlans: Story = {
	decorators: storyChromeDecorators,
	render: () => shell('/product-catalog/features', <SbCollapsibleSidebarNav items={items} />),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const plans = canvas.getByRole('link', { name: /^Plans$/i });
		await userEvent.click(plans);
		await expect(plans).toBeVisible();
	},
};
