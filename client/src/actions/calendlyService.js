//import React from 'react';
import { refreshCalendlyAuth } from './calendly';
const axios = require('axios').default;
//const request = require('request');
//const User = require('../calendly/models/userModel');
//const User = require('../../../models/User');
//const config = require('../../../../porchlight-config/default.json'); //require('config');

const CALENDLY_AUTH_BASE_URL = 'https://auth.calendly.com';
const CALENDLY_API_BASE_URL = 'https://api.calendly.com';
const REDIRECT_URI = 'http://localhost:3000';
const CALENDLY_BASE_URL = 'https://calendly.com';

// const {
//     CALENDLY_AUTH_BASE_URL,
//     CALENDLY_API_BASE_URL,
//     CLIENT_SECRET,
//     CLIENT_ID
// } = process.env;

class CalendlyService {
    constructor(accessToken, refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.request = axios.create({
            baseURL: CALENDLY_API_BASE_URL
        });

        this.requestInterceptor = this.request.interceptors.response.use(
            (res) => res,
            this._onCalendlyError
        );
    }

    getRequestConfiguration() {
        return {
            headers: {
                Authorization: `Bearer ${this.accessToken}`
            }
        };
    }

    getUserInfo = async () => {
        const { data } = await this.request.get(
            '/users/me',
            this.getRequestConfiguration()
        );
        console.log('Tried getUserInfo and it came back with: '+data);
        return data;
    };

    getUserEventTypes = async (userUri) => {
        const { data } = await this.request.get(
            `/event_types?user=${userUri}`,
            this.getRequestConfiguration()
        );

        return data;
    };

    getUserScheduledEvents = async (userUri, count, pageToken) => {
        let queryParams = [
            `user=${userUri}`,
            `count=${count || 10}`,
            `sort=start_time:desc`
        ].join('&');

        if (pageToken) queryParams += `&page_token=${pageToken}`;

        const url = `/scheduled_events?${queryParams}`;

        const { data } = await this.request.get(
            url,
            this.getRequestConfiguration()
        );

        return data;
    };

    _onCalendlyError = async (error) => {
        if (error.response.status !== 401) return Promise.reject(error);

        this.request.interceptors.response.eject(this.requestInterceptor);

        try {
            const response = await refreshCalendlyAuth();
            const { access_token, refresh_token } = response.data;

            this.accessToken = access_token;
            this.refreshToken = refresh_token;

            error.response.config.headers.Authorization = `Bearer ${access_token}`;

            // retry original request with new access token
            return this.request(error.response.config);
        } catch (e) {
            return Promise.reject(e);
        }
    };
}

//module.exports = CalendlyService;
export default CalendlyService;