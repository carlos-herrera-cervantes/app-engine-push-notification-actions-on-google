'use strict';

const express = require('express');
const credentials = require('../Config/credentials.json');
const { configClient, configNotification, authorize, sendNotification } = require('../Services/push-notification-service');

const notificationRouter = express.Router();

/**
 * Execute the process to send notification
 * @returns {Boolean} True if request has success otherwise throw an error
 */
const doTask = async (request, response) => {
  try {
    const client = configClient(credentials, [process.env.GOOGLE_API_PUSH_NOTIFICATIONS_URL]);
    const notification = configNotification({ title: '<YOUR TITLE>', userId: '<YOUR USER ID>', intent: '<YOUR INTENT NAME> - <THIS INTENT MUST BE GLOBAL AND MUSTE BE EXISTS>', locale: '<YOUR LOCALE CODE> - <es-MX>' });
    const tokens = await authorize(client);
    await sendNotification(tokens, notification, process.env.GOOGLE_API_SEND_CONVERSATION_URL);
    
    return response.status(200).send({ status: true, message: 'Notification was sended' });
  }
  catch (error) {
    return response.status(error.status).send({ status: false, message: error.message });
  }
}

notificationRouter
  .route('/send-notification')
  .post(async (request, response) => await doTask(request, response));

module.exports = { notificationRouter };