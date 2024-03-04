/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

// let host = 'localhost'
let host='172.27.21.210'
export const environment = {
  production: true,

  websocket: `http://${host}:8088/nec`,
  baseUrl: `http://${host}:8089`,
  bankUrl: `http://172.27.10.230:8003`,
  reportingUrl: `http://${host}:8087`,
};