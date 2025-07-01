import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class YouTrackApi implements ICredentialType {
	name = 'youTrackApi';
	displayName = 'YouTrack API';
	documentationUrl = 'https://www.jetbrains.com/help/youtrack/devportal/api.html';
	properties: INodeProperties[] = [
		{
			displayName: 'API URL',
			name: 'url',
			type: 'string',
			default: '',
			placeholder: 'https://your.youtrack.cloud',
			required: true
		},
		{
			displayName: 'Token',
			name: 'token',
			type: 'string',
			default: '',
			typeOptions: {
				password: true,
			},
		},
	];

	// This allows the credential to be used by other parts of n8n
	// stating how this credential is injected as part of the request
	// An example is the Http Request node that can make generic calls
	// reusing this credential
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '={{"Bearer " + $credentials.token}}',
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
	};

	// The block below tells how this credential can be tested
	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials?.url}}',
			url: '/',
			method: 'GET',
			headers: {
				Authorization: '={{"Bearer " + $credentials.token}}',
			},
		},
	};
}
