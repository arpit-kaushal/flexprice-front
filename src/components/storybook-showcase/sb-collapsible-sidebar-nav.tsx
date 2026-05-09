import * as Collapsible from '@radix-ui/react-collapsible';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router';
import { cn } from './lib/cn';
import { SbIconChevronRight, SbIconSidebarHide, SbIconSidebarReveal } from './sb-icons';

export type SbNavItem = {
	title: string;
	path: string;
	icon?: ReactNode;
	children?: { title: string; path: string }[];
};

function sectionShouldOpen(item: SbNavItem, pathname: string): boolean {
	if (!item.children?.length) return false;
	return item.children.some((c) => pathname.startsWith(c.path)) || pathname.startsWith(item.path);
}

export function SbCollapsibleSidebarNav({ items, className }: { items: SbNavItem[]; className?: string }) {
	const { pathname } = useLocation();
	const [collapsed, setCollapsed] = useState(false);
	const [openSection, setOpenSection] = useState<string | null>(null);

	const syncOpen = useCallback(() => {
		const next = items.find((item) => sectionShouldOpen(item, pathname));
		setOpenSection(next?.title ?? null);
	}, [items, pathname]);

	useEffect(() => {
		syncOpen();
	}, [syncOpen]);

	return (
		<aside
			className={cn(
				'flex h-full min-h-0 shrink-0 flex-col overflow-hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-sm transition-[width] duration-200 ease-out',
				collapsed ? 'w-[4.5rem]' : 'w-56',
				className,
			)}>
			<div className='flex items-center justify-end px-2 pt-2'>
				<button
					type='button'
					className='inline-flex size-8 shrink-0 items-center justify-center rounded-md text-sidebar-foreground hover:bg-sidebar-accent/60'
					aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
					onClick={() => setCollapsed((c) => !c)}>
					{collapsed ? <SbIconSidebarReveal className='size-4' /> : <SbIconSidebarHide className='size-4' />}
				</button>
			</div>
			<nav className='flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto px-2 pb-3' aria-label='Primary'>
				{items.map((item) => {
					const leaf = !item.children?.length;

					if (leaf) {
						return (
							<NavLink
								key={item.path}
								to={item.path}
								end
								title={collapsed ? item.title : undefined}
								className={({ isActive }) =>
									cn(
										'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition-colors',
										collapsed && 'justify-center px-0',
										isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent/60',
									)
								}>
								{item.icon ? (
									<span className='inline-flex size-4 shrink-0 items-center justify-center opacity-80 [&>svg]:size-4'>{item.icon}</span>
								) : null}
								{!collapsed ? <span className='truncate'>{item.title}</span> : null}
							</NavLink>
						);
					}

					const open = openSection === item.title;

					return (
						<Collapsible.Root
							key={item.title}
							open={collapsed ? false : open}
							onOpenChange={(next) => {
								if (collapsed) return;
								setOpenSection(next ? item.title : null);
							}}>
							<div className='flex flex-col'>
								<Collapsible.Trigger asChild>
									<button
										type='button'
										title={collapsed ? item.title : undefined}
										className={cn(
											'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent/60',
											collapsed && 'justify-center px-0',
											(sectionShouldOpen(item, pathname) || open) && 'bg-sidebar-accent/40',
										)}>
										{item.icon ? (
											<span className='inline-flex size-4 shrink-0 items-center justify-center opacity-80 [&>svg]:size-4'>{item.icon}</span>
										) : null}
										{!collapsed ? (
											<>
												<span className='min-w-0 flex-1 truncate'>{item.title}</span>
												<SbIconChevronRight className={cn('size-4 shrink-0 transition-transform', open && 'rotate-90')} />
											</>
										) : null}
									</button>
								</Collapsible.Trigger>
								{!collapsed && (
									<Collapsible.Content>
										<ul className='ml-2 mt-0.5 flex flex-col gap-0.5 border-l border-sidebar-border pl-2'>
											{item.children!.map((child) => (
												<li key={child.path}>
													<NavLink
														to={child.path}
														className={({ isActive }) =>
															cn(
																'block rounded-md px-2 py-1 text-sm transition-colors',
																isActive
																	? 'bg-sidebar-primary font-medium text-sidebar-primary-foreground'
																	: 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
															)
														}>
														{child.title}
													</NavLink>
												</li>
											))}
										</ul>
									</Collapsible.Content>
								)}
							</div>
						</Collapsible.Root>
					);
				})}
			</nav>
		</aside>
	);
}
