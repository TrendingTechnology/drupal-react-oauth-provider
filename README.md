# react-drupal-Oauth-provider
#
##### React Context provider and hooks for Drupal, with support for Oauth2 authentication. 
##### Simplify headless Drupal REST and authentication.
#
#
- [x] Written in Typescript
- [x] Zero dependencies
- [x] Collaboration, feedback, and feature requests welcome


## Features
 - Context Provider stores Oauth across app
 - Abstract away all token management
 - Hooks such as `useAPI`, `useLazyAPI`, and `useLazyLogin` access REST / JSON:API / Views REST etc. with user credentials in the header
 - GET, POST, PATCH, and DELETE supported
 - `_format=json` added by default. `_format=hal_json` can be added manually

>  Lazy?

Taking inspiration from [Apollo GraphQL's](https://www.apollographql.com/docs/react/data/queries#manual-execution-with-uselazyquery) `useLazyQuery`, the hooks provided can be triggered at any time, instead of when the React component is rendered.

## How does it work?

### Wrap your React app with DrupalProvider.
#
```javascript
import { DrupalProvider } from 'react-drupal-hooks';
const config = {
	url: 'https://d9-testing.niallmurphy.dev/',
};
ReactDOM.render(
	<React.StrictMode>
		<DrupalProvider config={config}>
			<App />
		</DrupalProvider>
	</React.StrictMode>,
	document.getElementById('root')
);
```
### Log users in with `useLazyLogin`
#
```javascript
import { useLazyLogin } from 'react-drupal-hooks';
...
const [login, { loading, error, data }] = useLazyLogin();
...
    onClick={() =>
    	login({
    		username,
    		password,
    		client_id,
    		client_secret,
    		grant_type,
    		scope,
    	})
    }
```
### Check authentication status with `isAuthenticated`
#
```javascript
import { isAuthenticated } from 'react-drupal-hooks';
...
{isAuthenticated() ? 'You are authenticated': 'You are not authenticated'}
```
### Make queries with `useAPI` or `useLazyAPI`
Get, post, patch, or delete any data you need. eg. Views.
```javascript
import { useLazyAPI } from 'react-drupal-hooks';
...
const [lazyAPI, { loading, error, data }] = useLazyAPI();
...
onClick={() =>
	lazyAPI({
		endpoint: 'node/3',
		method: 'PATCH',
		body: {
			nid: [{ value: '3' }],
			type: [{ target_id: 'article' }],
			title: [{ value: 'This is hardcoded to show how body works.' }],
		},
	})
}
```
### Log out with `useLazyLogout`
#
```javascript
import { useLazyLogout } from 'react-drupal-hooks';
...
const [logout] = useLazyLogout();
...
<button onClick={() => logout()}>Logout</button>
```
### ~~Deal with tokens, refreshing them, and storing them~~



##### Tested with [Simple OAuth (OAuth2) & OpenID Connect](https://www.drupal.org/project/simple_oauth/)



License: MIT
