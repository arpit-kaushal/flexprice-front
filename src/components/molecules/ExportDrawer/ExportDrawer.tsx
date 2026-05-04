import { FC, useMemo, useState, useEffect } from 'react';
import { Button, Input, Sheet, Spacer, Select, Textarea, Tooltip } from '@/components/atoms';
import { useMutation } from '@tanstack/react-query';
import { TaskApi } from '@/api';
import { ScheduledTask, SCHEDULED_ENTITY_TYPE, SCHEDULED_TASK_INTERVAL } from '@/models';
import { CreateScheduledTaskPayload } from '@/types/dto';
import toast from 'react-hot-toast';
import { ChevronDown, ChevronRight, Info } from 'lucide-react';
import { getApiErrorMessage } from '@/core/axios/types';

interface ExportDrawerProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	connectionId: string;
	connection?: any; // Connection object to check if Flexprice Managed
	exportTask?: ScheduledTask | null; // for editing
	onSave: (exportTask: any) => void;
}

interface ExportFormData {
	entity_type: SCHEDULED_ENTITY_TYPE;
	interval: SCHEDULED_TASK_INTERVAL;
	enabled: boolean;
	bucket: string;
	region: string;
	key_prefix: string;
	compression: string;
	encryption: string;
	export_metadata_fields_json: string;
	endpoint_url: string;
	use_path_style: boolean;
}

interface ValidationErrors {
	entity_type?: string;
	interval?: string;
	bucket?: string;
	region?: string;
	key_prefix?: string;
	export_metadata_fields_json?: string;
}

const ExportDrawer: FC<ExportDrawerProps> = ({ isOpen, onOpenChange, connectionId, connection, exportTask, onSave }) => {
	// Check if this is a Flexprice-managed connection
	const isFlexpriceManaged = connection?.sync_config?.s3?.is_flexprice_managed || false;

	const [formData, setFormData] = useState<ExportFormData>({
		entity_type: SCHEDULED_ENTITY_TYPE.EVENTS,
		interval: SCHEDULED_TASK_INTERVAL.HOURLY,
		enabled: true,
		bucket: '',
		region: 'us-east-1',
		key_prefix: 'flexprice-exports',
		compression: 'none',
		encryption: 'AES256',
		export_metadata_fields_json: '',
		endpoint_url: '',
		use_path_style: true,
	});

	const [errors, setErrors] = useState<ValidationErrors>({});
	const [isMetadataExpanded, setIsMetadataExpanded] = useState(false);

	// Initialize form data when editing
	useEffect(() => {
		if (exportTask) {
			setFormData({
				entity_type: exportTask.entity_type,
				interval: exportTask.interval,
				enabled: exportTask.enabled,
				bucket: exportTask.job_config.bucket,
				region: exportTask.job_config.region,
				key_prefix: exportTask.job_config.key_prefix,
				compression: exportTask.job_config.compression || 'none',
				encryption: exportTask.job_config.encryption || 'AES256',
				export_metadata_fields_json: exportTask.job_config.export_metadata_fields
					? JSON.stringify(exportTask.job_config.export_metadata_fields, null, 2)
					: '',
				endpoint_url: exportTask.job_config.endpoint_url || '',
				use_path_style: exportTask.job_config.use_path_style ?? true,
			});
		} else {
			setFormData({
				entity_type: SCHEDULED_ENTITY_TYPE.EVENTS,
				interval: SCHEDULED_TASK_INTERVAL.HOURLY,
				enabled: true,
				bucket: '',
				region: 'us-east-1',
				key_prefix: 'flexprice-exports',
				compression: 'none',
				encryption: 'AES256',
				export_metadata_fields_json: '',
				endpoint_url: '',
				use_path_style: true,
			});
		}
		setErrors({});
		setIsMetadataExpanded(false);
	}, [exportTask, isOpen]);

	const handleChange = (field: keyof ExportFormData, value: string | number | boolean) => {
		setFormData((prev) => {
			const updated = { ...prev, [field]: value };

			// Automatically set use_path_style to true when endpoint_url is filled
			if (field === 'endpoint_url' && typeof value === 'string' && value.trim()) {
				updated.use_path_style = true;
			}

			return updated;
		});
		// Clear error when user starts typing
		if (errors[field as keyof ValidationErrors]) {
			setErrors((prev) => ({ ...prev, [field as keyof ValidationErrors]: undefined }));
		}
	};

	const parsedExportMetadataFields = useMemo(() => {
		if (formData.entity_type !== SCHEDULED_ENTITY_TYPE.CREDIT_USAGE) return { ok: true as const, value: undefined as any };
		const raw = formData.export_metadata_fields_json?.trim();
		if (!raw) return { ok: true as const, value: undefined as any };

		try {
			const v = JSON.parse(raw);
			if (!Array.isArray(v)) return { ok: false as const, error: 'Must be a JSON array' };
			return { ok: true as const, value: v };
		} catch {
			return { ok: false as const, error: 'Invalid JSON' };
		}
	}, [formData.entity_type, formData.export_metadata_fields_json]);

	const validateForm = (): boolean => {
		const newErrors: ValidationErrors = {};

		// For Flexprice Managed, we don't need to validate bucket, region, key_prefix
		if (!isFlexpriceManaged) {
			if (!formData.bucket.trim()) {
				newErrors.bucket = 'S3 bucket name is required';
			}

			if (!formData.region.trim()) {
				newErrors.region = 'AWS region is required';
			}

			if (!formData.key_prefix.trim()) {
				newErrors.key_prefix = 'Key prefix is required';
			}
		}

		if (formData.entity_type === SCHEDULED_ENTITY_TYPE.CREDIT_USAGE && !parsedExportMetadataFields.ok) {
			newErrors.export_metadata_fields_json = parsedExportMetadataFields.error;
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const { mutate: createExport, isPending: isCreating } = useMutation({
		mutationFn: async () => {
			const jobConfig: any = {
				compression: formData.compression,
				encryption: formData.encryption,
			};

			if (
				formData.entity_type === SCHEDULED_ENTITY_TYPE.CREDIT_USAGE &&
				parsedExportMetadataFields.ok &&
				parsedExportMetadataFields.value
			) {
				jobConfig.export_metadata_fields = parsedExportMetadataFields.value;
			}

			// Only include bucket/region/key_prefix for customer-owned S3
			if (!isFlexpriceManaged) {
				jobConfig.bucket = formData.bucket;
				jobConfig.region = formData.region;
				jobConfig.key_prefix = formData.key_prefix;

				// Only include endpoint_url and use_path_style if endpoint_url is filled
				if (formData.endpoint_url.trim()) {
					jobConfig.endpoint_url = formData.endpoint_url;
					jobConfig.use_path_style = formData.use_path_style;
				}
			}

			const payload: CreateScheduledTaskPayload = {
				connection_id: connectionId,
				entity_type: formData.entity_type,
				interval: formData.interval,
				enabled: formData.enabled,
				job_config: jobConfig,
			};

			return await TaskApi.createScheduledTask(payload);
		},
		onSuccess: (response) => {
			toast.success('Export task created successfully');
			onSave(response);
			onOpenChange(false);
		},
		onError: (error: any) => {
			const apiMessage = getApiErrorMessage(error?.response?.data ?? error, 'Failed to create export task');
			toast.error(apiMessage);

			const code = error?.response?.data?.code;
			if (code === 'validation_error' && typeof apiMessage === 'string' && apiMessage.toLowerCase().includes('export metadata field')) {
				setErrors((prev) => ({ ...prev, export_metadata_fields_json: apiMessage }));
				setIsMetadataExpanded(true);
			}
		},
	});

	const { mutate: updateExport, isPending: isUpdating } = useMutation({
		mutationFn: async () => {
			const jobConfig: any = {
				compression: formData.compression,
				encryption: formData.encryption,
			};

			if (
				formData.entity_type === SCHEDULED_ENTITY_TYPE.CREDIT_USAGE &&
				parsedExportMetadataFields.ok &&
				parsedExportMetadataFields.value
			) {
				jobConfig.export_metadata_fields = parsedExportMetadataFields.value;
			}

			// Only include bucket/region/key_prefix for customer-owned S3
			if (!isFlexpriceManaged) {
				jobConfig.bucket = formData.bucket;
				jobConfig.region = formData.region;
				jobConfig.key_prefix = formData.key_prefix;

				// Only include endpoint_url and use_path_style if endpoint_url is filled
				if (formData.endpoint_url.trim()) {
					jobConfig.endpoint_url = formData.endpoint_url;
					jobConfig.use_path_style = formData.use_path_style;
				}
			}

			const payload: CreateScheduledTaskPayload = {
				connection_id: connectionId,
				entity_type: formData.entity_type,
				interval: formData.interval,
				enabled: formData.enabled,
				job_config: jobConfig,
			};

			return await TaskApi.updateScheduledTask(exportTask!.id, payload);
		},
		onSuccess: (response) => {
			toast.success('Export task updated successfully');
			onSave(response);
			onOpenChange(false);
		},
		onError: (error: any) => {
			const apiMessage = getApiErrorMessage(error?.response?.data ?? error, 'Failed to update export task');
			toast.error(apiMessage);

			const code = error?.response?.data?.code;
			if (code === 'validation_error' && typeof apiMessage === 'string' && apiMessage.toLowerCase().includes('export metadata field')) {
				setErrors((prev) => ({ ...prev, export_metadata_fields_json: apiMessage }));
				setIsMetadataExpanded(true);
			}
		},
	});

	const handleSave = () => {
		if (validateForm()) {
			if (exportTask) {
				updateExport();
			} else {
				createExport();
			}
		}
	};

	const isPending = isCreating || isUpdating;

	return (
		<Sheet
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			title={exportTask ? 'Edit Export Task' : 'Create Export Task'}
			description="Configure the export settings for your S3 data pipeline. Click save when you're done."
			size='lg'>
			<div className='space-y-4 mt-4'>
				{/* Entity Type */}
				<div>
					<label className='block text-sm font-medium text-gray-700 mb-2'>Entity Type</label>
					<Select
						value={formData.entity_type}
						onChange={(value) => handleChange('entity_type', value as SCHEDULED_ENTITY_TYPE)}
						error={errors.entity_type}
						options={[
							{ value: SCHEDULED_ENTITY_TYPE.EVENTS, label: 'Events' },
							{ value: SCHEDULED_ENTITY_TYPE.INVOICE, label: 'Invoice' },
							{ value: SCHEDULED_ENTITY_TYPE.CREDIT_TOPUPS, label: 'Credit Topups' },
							{ value: SCHEDULED_ENTITY_TYPE.CREDIT_USAGE, label: 'Credit Usage' },
						]}
					/>
					<p className='text-xs text-gray-500 mt-1'>Select the type of data to export</p>
				</div>

				{/* Interval */}
				<div>
					<label className='block text-sm font-medium text-gray-700 mb-2'>Export Interval</label>
					<Select
						value={formData.interval}
						onChange={(value) => handleChange('interval', value as SCHEDULED_TASK_INTERVAL)}
						error={errors.interval}
						options={[
							{ value: SCHEDULED_TASK_INTERVAL.HOURLY, label: 'Hourly' },
							{ value: SCHEDULED_TASK_INTERVAL.DAILY, label: 'Daily' },
						]}
					/>
					<p className='text-xs text-gray-500 mt-1'>How often to run the export</p>
				</div>

				{/* S3 Configuration - Only show for customer-owned S3 */}
				{!isFlexpriceManaged && (
					<>
						{/* S3 Bucket */}
						<Input
							label='S3 Bucket Name'
							placeholder='Enter S3 bucket name'
							value={formData.bucket}
							onChange={(value) => handleChange('bucket', value)}
							error={errors.bucket}
							description='The name of your S3 bucket'
						/>

						{/* AWS Region */}
						<Input
							label='AWS Region'
							placeholder='Enter AWS region'
							value={formData.region}
							onChange={(value) => handleChange('region', value)}
							error={errors.region}
							description='The AWS region where your S3 bucket is located'
						/>

						{/* Key Prefix */}
						<Input
							label='Key Prefix'
							placeholder='Enter key prefix'
							value={formData.key_prefix}
							onChange={(value) => handleChange('key_prefix', value)}
							error={errors.key_prefix}
							description='The prefix for files in your S3 bucket'
						/>
					</>
				)}

				{/* Compression */}
				<div>
					<label className='block text-sm font-medium text-gray-700 mb-2'>Compression</label>
					<Select
						value={formData.compression}
						onChange={(value) => handleChange('compression', value)}
						options={[
							{ value: 'none', label: 'None' },
							{ value: 'gzip', label: 'GZIP' },
						]}
					/>
					<p className='text-xs text-gray-500 mt-1'>Compression format for exported files</p>
				</div>

				{/* Encryption */}
				<div>
					<label className='block text-sm font-medium text-gray-700 mb-2'>Encryption</label>
					<Select
						value={formData.encryption}
						onChange={(value) => handleChange('encryption', value)}
						options={[{ value: 'AES256', label: 'AES256' }]}
					/>
					<p className='text-xs text-gray-500 mt-1'>Encryption method for exported files</p>
				</div>

				{/* Additional Metadata Fields (Credit Usage only) */}
				{formData.entity_type === SCHEDULED_ENTITY_TYPE.CREDIT_USAGE && (
					<div className='rounded-md border border-gray-200 bg-gray-50'>
						<button
							type='button'
							onClick={() => setIsMetadataExpanded((v) => !v)}
							className='w-full flex items-center justify-between px-3 py-2 text-left'>
							<div>
								<div className='text-sm font-medium text-gray-900 inline-flex items-center gap-1.5'>
									Additional metadata fields (Optional)
									<Tooltip
										delayDuration={0}
										side='right'
										content={
											<div className='max-w-[280px] text-sm'>
												If the same metadata key exists for both <span className='font-medium'>customer</span> and{' '}
												<span className='font-medium'>wallet</span>, set <span className='font-medium'>column_name</span> to distinguish the
												CSV headers.
											</div>
										}>
										<span className='inline-flex items-center text-blue-600 hover:text-blue-700'>
											<Info className='h-4 w-4' />
										</span>
									</Tooltip>
								</div>
								<div className='text-xs text-gray-600'>
									JSON array describing which Customer/Wallet metadata keys to export as CSV columns in the exported file.
								</div>
							</div>
							<div className='text-gray-700'>
								{isMetadataExpanded ? <ChevronDown className='h-4 w-4' /> : <ChevronRight className='h-4 w-4' />}
							</div>
						</button>
						{isMetadataExpanded && (
							<div className='px-3 pb-3'>
								<Textarea
									label=''
									placeholder={`[\n  { "entity_type": "customer", "field_key": "account_number__c", "column_name": "Account Number" },\n  { "entity_type": "wallet", "field_key": "tier" }\n]`}
									value={formData.export_metadata_fields_json}
									onChange={(value) => handleChange('export_metadata_fields_json', value)}
									error={errors.export_metadata_fields_json}
									description='Format: [{ "entity_type": "…", "field_key": "…", "column_name"?: "…" }]'
									textAreaClassName='font-mono text-xs'
								/>
							</div>
						)}
					</div>
				)}

				{/* Endpoint URL (Optional) - only for customer-owned S3 */}
				{!isFlexpriceManaged && (
					<Input
						label='Endpoint URL (Optional)'
						placeholder='Enter custom S3 endpoint URL'
						value={formData.endpoint_url}
						onChange={(value) => handleChange('endpoint_url', value)}
						description='Custom endpoint URL for S3-compatible storage (e.g., MinIO, DigitalOcean Spaces)'
					/>
				)}

				{/* Flexprice Managed Info */}
				{isFlexpriceManaged && (
					<div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
						<h4 className='font-medium text-blue-900 mb-2'>Flexprice Managed Storage</h4>
						<p className='text-sm text-blue-800'>
							Your exports will be automatically stored in Flexprice-managed S3 buckets. No additional export configuration required.
							Download the exported files from the respective task runs table.
						</p>
					</div>
				)}

				{/* Enabled */}
				<div className='flex items-center space-x-2'>
					<input
						type='checkbox'
						id='enabled'
						checked={formData.enabled}
						onChange={(e) => handleChange('enabled', e.target.checked)}
						className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
					/>
					<label htmlFor='enabled' className='text-sm font-medium text-gray-700'>
						Enable this export task
					</label>
				</div>

				<Spacer className='!h-4' />
				<div className='flex gap-2'>
					<Button variant='outline' onClick={() => onOpenChange(false)} className='flex-1'>
						Cancel
					</Button>
					<Button onClick={handleSave} className='flex-1' isLoading={isPending}>
						{exportTask ? 'Update' : 'Create'}
					</Button>
				</div>
			</div>
		</Sheet>
	);
};

export default ExportDrawer;
