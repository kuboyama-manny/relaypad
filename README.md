# RelayPad Web Client
The RelayPad Web Client is a [Single Page Application](https://en.wikipedia.org/wiki/Single-page_application) built using [React](https://facebook.github.io/react/) and [Redux](http://redux.js.org/).

| Contents |
|:---------|
| [Quick Start](#quick-start) |
| [Overview](#overview) |
| [Authentication](#authentication) |
| [Environment Variables](#environment-variables) |
| [Interacting With API](#interactive-with-api) |
| [Testing](#testing) |
| [Deployment](#deployment) |
| [Recommended Reading](#recommended-reading) |

## Quick Start
 - Clone this repository
 - Run `script/setup`
   - Installs necessary libraries, via `npm`, and should be run if missing library errors are every encountered.
 - Copy contents of `env_file_template` to `.env` and insert necessary key values
   - The values in template file can be used as a reference for the services that need to be configured, e.g. [Cloudinary](http://cloudinary.com/).
 - Run `script/server`
   - Your browser will open at `http://localhost:3000`
   - Depends on RelayPad API being available at `http://localhost:8000`

:information_source: The idea behind `script/setup` and `script/server` come from GitHub's [scripts to rule them all](https://github.com/github/scripts-to-rule-them-all).

## Overview
Effectively working in this repository will require an understanding of how React and Redux work together. A simplified description of the two would be, React is responsible for the presentation of information and Redux is responsible for state management. There is nothing super special about how RelayPad is configured from a react and redux perspective. Key points to keep in mind:

 - [`react-router`](https://github.com/ReactTraining/react-router) is used for request routing and [`routes.js`](/src/routes.js) will serve as a good starting point for ramp up.
 - We've opted to create a `container` component for every route, and these containers serve as the starting point for any page request. For example, viewing `/drafts` will be handled by [`drafts_container.js`](/src/containers/drafts_container.js).
 - To make state management more efficient we make use of [`normalizr`](https://github.com/paularmstrong/normalizr) to [normalize state shape](http://redux.js.org/docs/recipes/reducers/NormalizingStateShape.html) after API results come back. It's worth examining this logic in `middleware.js`.
 - We use `connect()` function of `react-redux` library to facilitate linking of react views to state managed by redux. Almost every container makes use of `connect()`.

## Environment Variables
RelayPad web client depends on a number of variables that vary across environments. We set these values in our Heroku staging and production using [Heroku Config Vars](https://devcenter.heroku.com/articles/config-vars) and in development we make use of a locally stored (not in version control for security) `.env` file. A template for this file can be found in [`env_file_template`](/env_file_template).

## Authentication
We use [Slack OAuth](https://api.slack.com/docs/sign-in-with-slack) for authentication and make use of [Auth0](http://auth0.com/) to generate a [JWT (JSON Web Token)](https://jwt.io/) that can be passed to API to prove user is authenticated. The flow works as follows:

![auth-flow](https://user-images.githubusercontent.com/311182/26999421-d96f6bb8-4d4d-11e7-98b7-a9979576bc70.png)

## Interacting with API
:information_source: This section won't make a ton of sense if you haven't read up on Redux yet, see [recommended reading](#recommended-reading).

We make use of [Redux Middleware](http://redux.js.org/docs/advanced/Middleware.html) to make our asynchronous API calls. If the `payload` of a Redux `action` is a [JavaScript `promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) the Redux middleware will handle API call and subsequent sharing of response data. [`api_agent.js`](/src/api_agent.js) is the file responsible for generating promises that result in API calls.

The flow of an API call is as follows:
 - An `ASYNC_START` action will be dispatched
   - Can be used by Redux `reducers` to update loading status since we realize we're waiting on API data.
 - Action payload will be called and when it returns an `ASYNC_END` action will be dispatched
   - Allows Redux `reducers` to reset loading status values.
 - Original action will be dispatched but `payload` will be updated to include API response data.

:lock: All API requests will need pass a valid JWT to API server. See [`api_agent`](/src/api_agent.js) for logic.

## Testing
:construction: Front-end tests are still being developed but the necessary testing libraries are in place. `script/test` can be run to kickoff test process.

## Deployment
We're using [Heroku Pipelines](https://devcenter.heroku.com/articles/pipelines) to deploy the RelayPad web client. The bulk of the deployment work is automatically handled by a [buildpack](https://github.com/mars/create-react-app-buildpack) designed to support react applications created using [`create-react-app`](https://github.com/facebookincubator/create-react-app) (e.g. runs `npm run build`, building the app for production to the `build` directory). Overview of environments:

| Environment | URL | Heroku App |
|:------------|:----|:-----------|
| Staging | [staging.relaypad.com](http://staging.relaypad.com) | [relaypad-staging-web](https://dashboard.heroku.com/apps/relaypad-staging-web) |
| Production | [beta.relaypad.com](http://beta.relaypad.com) | [relaypad-web](https://dashboard.heroku.com/apps/relaypad-web) |

### Flow
 - Create a PR
 - *Optionally* choose to go to Heroku pipeline dashboard and create a [review app](https://devcenter.heroku.com/articles/github-integration-review-apps)
   - :information_source: Web client review apps hit the staging API.
 - Merge code into `master`
 - Heroku will automatically deploy to `relaypad-staging-web` application
   - Alternatively you can deploy by git pushing, e.g. `git push staging master`
 - Go to Heroku pipeline dashboard and opt to `Promote to production...`

## Recommended Reading

  - [Create React App User Guide](https://github.com/facebookincubator/create-react-app#user-guide)
    - This repository was bootstrapped using the `Create React App` tool, which was created by Facebook to simplify React project creation. It brings consistency to the folder structure and simplifies development environment configuration. Reading the user guide will be helpful if problems are encountered.
  - [Thinking in React](https://facebook.github.io/react/docs/thinking-in-react.html)
    - This is a great read for React novices since it clarifies what's different about React and how to think about React components.
  - [Redux Documentation](http://redux.js.org/)
    - Some great getting started content.
