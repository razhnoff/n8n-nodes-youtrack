import {
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	IExecuteFunctions,
	IRequestOptions,
	INodeExecutionData,
} from 'n8n-workflow';

export class YouTrack implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'YouTrack',
		name: 'youTrack',
		icon: { light: 'file:youtrack.svg', dark: 'file:youtrack.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with YouTrack API',
		defaults: {
			name: 'YouTrack',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'youTrackApi',
				required: true,
			},
		],
		/**
		 * In the properties array we have two mandatory options objects required
		 *
		 * [Resource & Operation]
		 *
		 * https://docs.n8n.io/integrations/creating-nodes/code/create-first-node/#resources-and-operations
		 *
		 * In our example, the operations are separated into their own file (HTTPVerbDescription.ts)
		 * to keep this class easy to read.
		 *
		 */
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{ name: 'Agile', value: 'agile' },
					{ name: 'Sprint', value: 'sprint' },
					{ name: 'Issue', value: 'issue' },
					{ name: 'Logged Time', value: 'timeTracking' },
				],
				default: 'agile',
				required: true,
				noDataExpression: true,
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['agile', 'sprint', 'issue', 'timeTracking'],
					},
				},
				options: [
					{
						name: 'Get Many',
						value: 'getAll',
						action: 'Get many',
					},
					{
						name: 'Get by ID',
						value: 'getById',
						action: 'Get by id',
					},
				],
				noDataExpression: true,
				default: 'getAll',
			},
			{
				displayName: 'Agile ID',
				name: 'agileId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['sprint'],
					},
				},
				default: '',
				required: true,
			},
			{
				displayName: 'Agile ID',
				name: 'agileIdForIssues',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['issue'],
						operation: ['getAll'],
					},
				},
				default: '',
				required: true,
			},
			{
				displayName: 'Sprint ID',
				name: 'sprintId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['issue'],
						operation: ['getAll'],
					},
				},
				default: '',
				required: true,
			},
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['agile'],
						operation: ['getById'],
					},
				},
			},
			{
				displayName: 'Sprint ID',
				name: 'sprintId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['sprint'],
						operation: ['getById'],
					},
				},
			},
			{
				displayName: 'Issue ID',
				name: 'issueId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['issue', 'timeTracking'],
						operation: ['getById'],
					},
				},
				default: '',
			},
		],
	};

	async execute(this: IExecuteFunctions) {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('youTrackApi');
		const baseUrl = (credentials.url as string).replace(/\/$/, '');
		const token = credentials.token;

		for (let i = 0; i < items.length; i++) {
			const resource = this.getNodeParameter('resource', i);
			const operation = this.getNodeParameter('operation', i);

			let endpoint = '';
			const options: IRequestOptions = {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
				},
				uri: '',
				json: true,
			};

			if (resource === 'agile' && operation === 'getAll') {
				endpoint = '/api/agiles?fields=id,name,summary,projects(id,name)';
			} else if (resource === 'agile' && operation === 'getById') {
				const projectId = this.getNodeParameter('projectId', i);
				endpoint = `/api/agiles?fields=id,name,summary,project(${projectId})`;
			} else if (resource === 'sprint' && operation === 'getAll') {
				const agileId = this.getNodeParameter('agileId', i);
				endpoint = `/api/agiles/${agileId}/sprints?fields=id,name,goal,start,finish`;
			} else if (resource === 'sprint' && operation === 'getById') {
				const agileId = this.getNodeParameter('agileId', i);
				const sprintId = this.getNodeParameter('sprintId', i);
				endpoint = `/api/agiles/${agileId}/sprints/${sprintId}?fields=id,name,goal,start,finish`;
			} else if (resource === 'issue' && operation === 'getAll') {
				const agileId = this.getNodeParameter('agileIdForIssues', i);
				const sprintId = this.getNodeParameter('sprintId', i);
				endpoint = `/api/agiles/${agileId}/sprints/${sprintId}/issues?fields=idReadable,summary,customFields(name,value(name))`;
			} else if (resource === 'issue' && operation === 'getById') {
				const issueId = this.getNodeParameter('issueId', i);
				endpoint = `/api/issues/${issueId}?fields=idReadable,summary,customFields(name,value(name))`;
			} else if (resource === 'timeTracking') {
				const issueId = this.getNodeParameter('issueId', i);
				endpoint = `/api/issues/${issueId}/timeTracking/workItems?fields=duration(minutes),author(name),text,issue(idReadable)`;
			} else {
				// eslint-disable-next-line n8n-nodes-base/node-execute-block-wrong-error-thrown
				throw new Error(`Unsupported combination: ${resource} / ${operation}`);
			}

			options.uri = `${baseUrl}${endpoint}`;
			const responseData = await this.helpers.request(options);
			if (!Array.isArray(responseData)) {
				returnData.push({ json: responseData });
			} else {
				returnData.push(...responseData.map((item: any) => ({ json: item })));
			}
		}

		return this.prepareOutputData(returnData);
	}
}
