'use strict';

const { google } = require('googleapis');
const request = require('request');

/**
 * Creates a new client to authenticate with Google APIS
 * @param {Object} credentials Credentials generated in the Google Cloud Platform
 * @param {Array} scopes Array with URLS of scope
 * @returns {Object} Object to authenticate with Google APIS
 */
const configClient = (credentials, scopes) => new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  scopes,
  null,
  null
);

/**
 * Creates a new object of notification
 * @param {Object} notification title, userId, intent and locale
 * @returns {Object} Object with structure of notification 
 */
const configNotification = ({ title, userId, intent, locale }) => (
  {
    userNotification: {
      title
    },
    target: {
      userId,
      intent,
      locale
    }
  });

/**
 * Returns the tokens to authenticate with Google APIS
 * @param {Object} client To authorize requests
 * @returns {Object} With tokens to authenticate
 */
const authorize = async client => await client.authorize();

/**
 * Send notification to user
 * @param {Object} tokens With tokens to authenticate
 * @param {Object} notification With structure to send
 * @param {Object} url Used to send the notification
 * @returns {Boolean} True if request has success otherwise throw an error
 */
const sendNotification = (tokens, notification, url) => new Promise((resolve, reject) => {
  request.post(url,
    {
      'auth': {
        'bearer': tokens.access_token
      },
      'json': true,
      'body': {
        'customPushMessage': notification,
        'isInSandbox': true
      }
    }, (error, response, body) => response.statusCode === 200 ? resolve('OK') : reject({ status: response.statusCode, message: response.statusMessage }));
});

module.exports = { configClient, configNotification, authorize, sendNotification };