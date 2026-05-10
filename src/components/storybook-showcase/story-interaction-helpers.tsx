import * as React from 'react';

export function StoryFeedbackSlot({
	trigger,
	hintText = 'Interact to see confirmation below.',
	confirmPrefix = 'Action confirmed',
}: {
	trigger: React.ReactElement<{ onClick?: React.MouseEventHandler }>;
	hintText?: string;
	confirmPrefix?: string;
}) {
	const [message, setMessage] = React.useState<string | null>(null);

	return (
		<div className='max-w-md space-y-3'>
			{React.cloneElement(trigger, {
				onClick: (e: React.MouseEvent<Element>) => {
					trigger.props.onClick?.(e);
					setMessage(
						`${confirmPrefix} at ${new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}.`,
					);
				},
			})}
			{message ? (
				<p
					className='rounded-md border border-border bg-muted px-3 py-2 text-sm text-foreground shadow-sm'
					role='status'
					aria-live='polite'>
					{message}
				</p>
			) : (
				<p className='text-sm text-muted-foreground'>{hintText}</p>
			)}
		</div>
	);
}
