import React from 'react';
import { DrupalContext } from '../context';
import { RequestMethod } from '../enums/RequestMethod';
import { refreshToken } from '../oauth';

// Hide _execute
export interface Params {
	readonly method: string;
	readonly endpoint: string;
	readonly body: object;
	_execute?: boolean;
}

/**
 * Ignore _execute. It is used for lazyAPI.
 * @example
 * const { data, loading, error } = useAPI({ endpoint, method, body });
 */

export const useAPI = ({ body = {}, method = RequestMethod.Get, endpoint = '', _execute = true }: Params) => {
	const {
		getHeaders,
		addHeaders,
		url,
		client_id,
		client_secret,
		token,
		scope,
		handleSetToken,
		isAuthenticated,
		setIsAuthenticated,
	} = React.useContext(DrupalContext);

	const [loading, setLoading] = React.useState<boolean>(false);
	const [error, setError] = React.useState<object | null>(null);
	const [data, setData] = React.useState<object | object[] | null>(null);

	React.useEffect(() => {
		async function loadData() {
			try {
				if (_execute) {
					setLoading(true);

					// Check access token expiry time and renew it before making request.
					if (token !== null && token.expirationDate < Math.floor(Date.now() / 1000)) {
						// Must call this async so that the token is set before making the request.
						await refreshToken({
							url: url,
							client_id,
							client_secret,
							scope,
							token,
							handleSetToken,
							isAuthenticated,
							setIsAuthenticated,
							addHeaders,
						});
					}

					// Deal with jsonAPI / user input / query strings. Ugly but works.
					const query =
						endpoint.startsWith('jsonapi') || endpoint.includes('_format=json')
							? `${url}${endpoint}`
							: endpoint.includes('?')
							? `${url}${endpoint}&_format=json`
							: `${url}${endpoint}?_format=json`;
					// body not allowed on GET requests. #toDo - PATCH and DELETE ?
					const settings = {
						method,
						headers: getHeaders(),
						...(body && RequestMethod.Post === method ? { body: JSON.stringify(body) } : {}),
					};
					const response = await fetch(query, settings);
					const parsedResponse = await response.json();

					setLoading(false);
					// Check for errors from Drupal
					response.ok ? setData(parsedResponse) : setError(parsedResponse);
				}
			} catch (error) {
				setLoading(false);
				setError(error as object);
			}
		}
		loadData();
	}, [_execute, endpoint]);

	return { loading, error, data };
};
