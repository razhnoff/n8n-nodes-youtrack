import { INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';

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
				name: 'youtrackApi',
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
				noDataExpression: true,
				options: [
					{
						name: 'Rest Api',
						value: 'restApi',
					},
				],
				default: 'restApi',
			},
			{
				displayName: 'Method',
				name: 'method',
				type: 'options',
				options: [
					{
						name: 'DELETE',
						value: 'DELETE',
					},
					{
						name: 'GET',
						value: 'GET',
					},
					{
						name: 'HEAD',
						value: 'HEAD',
					},
					{
						name: 'OPTIONS',
						value: 'OPTIONS',
					},
					{
						name: 'PATCH',
						value: 'PATCH',
					},
					{
						name: 'POST',
						value: 'POST',
					},
					{
						name: 'PUT',
						value: 'PUT',
					},
				],
				default: 'GET',
				description: 'The request method to use',
			},
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				default: '',
				placeholder: 'http://example.youtrack.com/api',
				description: 'The URL to make the request to',
				required: true,
			},
			{
				displayName: 'Send Query Parameters',
				name: 'sendQuery',
				type: 'boolean',
				default: false,
				noDataExpression: true,
				description: 'Whether the request has query params or not',
			},
			{
				displayName: 'Specify Query Parameters',
				name: 'specifyQuery',
				type: 'options',
				displayOptions: {
					show: {
						sendQuery: [true],
					},
				},
				options: [
					{
						name: 'Using Fields Below',
						value: 'keypair',
					},
					{
						name: 'Using JSON',
						value: 'json',
					},
				],
				default: 'keypair',
			},
			{
				displayName: 'Query Parameters',
				name: 'queryParameters',
				type: 'fixedCollection',
				displayOptions: {
					show: {
						sendQuery: [true],
						specifyQuery: ['keypair'],
					},
				},
				typeOptions: {
					multipleValues: true,
				},
				placeholder: 'Add Parameter',
				default: {
					parameters: [
						{
							name: '',
							value: '',
						},
					],
				},
				options: [
					{
						name: 'parameters',
						displayName: 'Parameter',
						values: [
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
							},
						],
					},
				],
			},
			{
				displayName: 'JSON',
				name: 'jsonQuery',
				type: 'json',
				displayOptions: {
					show: {
						sendQuery: [true],
						specifyQuery: ['json'],
					},
				},
				default: '',
			},
			{
				displayName: 'Send Headers',
				name: 'sendHeaders',
				type: 'boolean',
				default: false,
				noDataExpression: true,
				description: 'Whether the request has headers or not',
			},
			{
				displayName: 'Specify Headers',
				name: 'specifyHeaders',
				type: 'options',
				displayOptions: {
					show: {
						sendHeaders: [true],
					},
				},
				options: [
					{
						name: 'Using Fields Below',
						value: 'keypair',
					},
					{
						name: 'Using JSON',
						value: 'json',
					},
				],
				default: 'keypair',
			},
			{
				displayName: 'Header Parameters',
				name: 'headerParameters',
				type: 'fixedCollection',
				displayOptions: {
					show: {
						sendHeaders: [true],
						specifyHeaders: ['keypair'],
					},
				},
				typeOptions: {
					multipleValues: true,
				},
				placeholder: 'Add Parameter',
				default: {
					parameters: [
						{
							name: '',
							value: '',
						},
					],
				},
				options: [
					{
						name: 'parameters',
						displayName: 'Parameter',
						values: [
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
							},
						],
					},
				],
			},
			{
				displayName: 'JSON',
				name: 'jsonHeaders',
				type: 'json',
				displayOptions: {
					show: {
						sendHeaders: [true],
						specifyHeaders: ['json'],
					},
				},
				default: '',
			},
			{
				displayName: 'Send Body',
				name: 'sendBody',
				type: 'boolean',
				default: false,
				noDataExpression: true,
				description: 'Whether the request has a body or not',
			},
			{
				displayName: 'Body Content Type',
				name: 'contentType',
				type: 'options',
				displayOptions: {
					show: {
						sendBody: [true],
					},
				},
				options: [
					{
						name: 'JSON',
						value: 'json',
					},
				],
				default: 'json',
				description: 'Content-Type to use to send body parameters',
			},
			{
				displayName: 'Specify Body',
				name: 'specifyBody',
				type: 'options',
				displayOptions: {
					show: {
						sendBody: [true],
						contentType: ['json'],
					},
				},
				options: [
					{
						name: 'Using Fields Below',
						value: 'keypair',
					},
					{
						name: 'Using JSON',
						value: 'json',
					},
				],
				default: 'keypair',
				// eslint-disable-next-line n8n-nodes-base/node-param-description-miscased-json
				description:
					'The body can be specified using explicit fields (<code>keypair</code>) or using a JavaScript object (<code>json</code>)',
			},
			{
				displayName: 'Body Parameters',
				name: 'bodyParameters',
				type: 'fixedCollection',
				displayOptions: {
					show: {
						sendBody: [true],
						contentType: ['json'],
						specifyBody: ['keypair'],
					},
				},
				typeOptions: {
					multipleValues: true,
				},
				placeholder: 'Add Parameter',
				default: {
					parameters: [
						{
							name: '',
							value: '',
						},
					],
				},
				options: [
					{
						name: 'parameters',
						displayName: 'Parameter',
						values: [
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								default: '',
								description:
									'ID of the field to set. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Value of the field to set',
							},
						],
					},
				],
			},
			{
				displayName: 'JSON',
				name: 'jsonBody',
				type: 'json',
				displayOptions: {
					show: {
						sendBody: [true],
						contentType: ['json'],
						specifyBody: ['json'],
					},
				},
				default: '',
			},
			{
				displayName: 'Body',
				name: 'body',
				type: 'string',
				displayOptions: {
					show: {
						sendBody: [true],
						specifyBody: ['string'],
					},
				},
				default: '',
				placeholder: 'field1=value1&field2=value2',
			},
		],
	};
}
