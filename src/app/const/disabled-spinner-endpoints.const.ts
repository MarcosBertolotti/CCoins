/**
 * Const with disabled spinner endpoints.
 * Add new endpoints to this array for hide spinner on that endpoint.
 */
export const DISABLED_SPINNER_ENDPOINTS = [
    //new RegExp(/^\/bff-app\/parties\/([^/]+)\/coins\/quantity$/),
    new RegExp(/^\/bff-app\/parties\/coins\/quantity$/),
    new RegExp(/^\/bff-app\/spotify\/actualSongs\/bar$/),
    new RegExp(/^\/bff-app\/spotify\/config$/),
];
