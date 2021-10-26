const request = require('request');
//const User = require('../calendly/models/userModel');
const config = require('config');

const CLIENT_ID = config.get('calendlyID');
const CLIENT_SECRET = config.get('calendlySecret'); 
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

    requestNewAccessToken = () => {
        try {
            const options = {
              uri: encodeURI(
                `${CALENDLY_AUTH_BASE_URL}/oauth/token`
              ),
              client_id: CLIENT_ID,
              client_secret: CLIENT_SECRET,
              grant_type: 'refresh_token',
              refresh_token: this.refreshToken,
              method: 'POST',
              headers: { 'user-agent': 'node.js' },
            };
        
            request(options, (error, response, body) => {
              if (error) console.error(error);
        
              if (response.statusCode !== 200) {
                return res.status(404).json({ msg: 'No Calendly host found' });
              }
        
              res.json(JSON.parse(body));
            });
          } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
          }


        // return axios.post(`${CALENDLY_AUTH_BASE_URL}/oauth/token`, {
        //     client_id: CLIENT_ID,
        //     client_secret: CLIENT_SECRET,
        //     grant_type: 'refresh_token',
        //     refresh_token: this.refreshToken
        // });
    };

    _onCalendlyError = async (error) => {
        if (error.response.status !== 401) return Promise.reject(error);

        this.request.interceptors.response.eject(this.requestInterceptor);

        try {
            const response = await this.requestNewAccessToken();
            const { access_token, refresh_token } = response.data;

            const user = await User.findByAccessToken(this.accessToken);

            await User.update(user.id, {
                accessToken: access_token,
                refreshToken: refresh_token
            });

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

module.exports = CalendlyService;