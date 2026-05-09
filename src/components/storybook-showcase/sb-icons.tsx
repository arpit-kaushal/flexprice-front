import * as React from 'react';
import { cn } from './lib/cn';

type SvgProps = React.SVGProps<SVGSVGElement>;

function strokeIcon(children: React.ReactNode, { className, ...props }: SvgProps) {
	return (
		<svg
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth={2}
			strokeLinecap='round'
			strokeLinejoin='round'
			aria-hidden
			className={cn('shrink-0', className)}
			{...props}>
			{children}
		</svg>
	);
}

export function SbIconSearch(props: SvgProps) {
	return strokeIcon(
		<>
			<circle cx='11' cy='11' r='8' />
			<path d='m21 21-4.3-4.3' />
		</>,
		props,
	);
}

export function SbIconChevronRight(props: SvgProps) {
	return strokeIcon(<path d='m9 18 6-6-6-6' />, props);
}

/** Narrow rail + panel — “show sidebar” affordance */
export function SbIconSidebarReveal(props: SvgProps) {
	return strokeIcon(
		<>
			<rect x='3' y='4' width='4' height='16' rx='1' />
			<rect x='9' y='4' width='12' height='16' rx='1' />
		</>,
		props,
	);
}

/** Panel with rail on the right — “hide sidebar” affordance */
export function SbIconSidebarHide(props: SvgProps) {
	return strokeIcon(
		<>
			<rect x='3' y='4' width='12' height='16' rx='1' />
			<rect x='17' y='4' width='4' height='16' rx='1' />
		</>,
		props,
	);
}

export function SbIconTrendingUp(props: SvgProps) {
	return strokeIcon(
		<>
			<polyline points='22 7 13.5 15.5 8.5 10.5 2 17' />
			<polyline points='16 7 22 7 22 13' />
		</>,
		props,
	);
}

export function SbIconTrendingDown(props: SvgProps) {
	return strokeIcon(
		<>
			<polyline points='22 17 13.5 8.5 8.5 13.5 2 7' />
			<polyline points='16 17 22 17 22 11' />
		</>,
		props,
	);
}

export function SbIconBan(props: SvgProps) {
	return strokeIcon(
		<>
			<circle cx='12' cy='12' r='10' />
			<path d='m4.9 4.9 14.2 14.2' />
		</>,
		props,
	);
}

export function SbIconCheckCircle(props: SvgProps) {
	return strokeIcon(
		<>
			<circle cx='12' cy='12' r='10' />
			<path d='m9 12 2 2 4-4' />
		</>,
		props,
	);
}

export function SbIconFileEdit(props: SvgProps) {
	return strokeIcon(
		<>
			<path d='M12.5 22H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h1.5' />
			<path d='M14 2v4a2 2 0 0 0 2 2h4' />
			<path d='M2.5 18.5 8 13l3 3L15.5 8' />
		</>,
		props,
	);
}

export function SbIconSkipForward(props: SvgProps) {
	return strokeIcon(
		<>
			<polygon points='5 4 15 12 5 20 5 4' />
			<line x1='19' x2='19' y1='5' y2='19' />
		</>,
		props,
	);
}

export function SbIconInbox(props: SvgProps) {
	return strokeIcon(
		<>
			<polyline points='22 12 16 12 14 15 10 15 8 12 2 12' />
			<path d='M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z' />
		</>,
		props,
	);
}

export function SbIconHome(props: SvgProps) {
	return strokeIcon(
		<>
			<path d='m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' />
			<polyline points='9 22 9 12 15 12 15 22' />
		</>,
		props,
	);
}

export function SbIconLayers(props: SvgProps) {
	return strokeIcon(
		<>
			<polygon points='12 2 2 7 12 12 22 7 12 2' />
			<polyline points='2 17 12 22 22 17' />
			<polyline points='2 12 12 17 22 12' />
		</>,
		props,
	);
}

export function SbIconLandmark(props: SvgProps) {
	return strokeIcon(
		<>
			<line x1='3' x2='21' y1='22' y2='22' />
			<line x1='6' x2='6' y1='18' y2='11' />
			<line x1='10' x2='10' y1='18' y2='11' />
			<line x1='14' x2='14' y1='18' y2='11' />
			<line x1='18' x2='18' y1='18' y2='11' />
			<polygon points='12 2 20 7 4 7' />
		</>,
		props,
	);
}

export function SbIconArchive(props: SvgProps) {
	return strokeIcon(
		<>
			<rect width='20' height='5' x='2' y='3' rx='1' />
			<path d='M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8' />
			<path d='M10 12h4' />
		</>,
		props,
	);
}

export function SbIconPauseCircle(props: SvgProps) {
	return strokeIcon(
		<>
			<circle cx='12' cy='12' r='10' />
			<line x1='10' x2='10' y1='15' y2='9' />
			<line x1='14' x2='14' y1='15' y2='9' />
		</>,
		props,
	);
}
