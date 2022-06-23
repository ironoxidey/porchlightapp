const { Client } = require('@googlemaps/google-maps-services-js');
const config = !process.env.NODE_ENV ? require('config') : process.env;

const addressTimezone = async (payload) => {
    console.log('addressTimezone payload', payload);
    const args = {
        params: {
            key: config['GOOGLE_MAPS_API_KEY'],
            location: [payload[1], payload[0]], //the first index[0] is the longitude, sencond[1] is latitude, mongoDB prefers [long, lat] for some reason
            timestamp: new Date(),
        },
    };
    const client = new Client();

    const res = await client.timezone(args).then((tzResponse) => {
        //console.log('tzResponse', tzResponse.data);
        if (tzResponse.data.timeZoneId) {
            console.log('addressTimeZone tzResponse.data', tzResponse.data);
            //rawOffset is the offset from UTC (in seconds) for the given location. dividing rawOffset by 3600 you can get the GMT time of your requested time zone
            return tzResponse.data;
        }
    });
    console.log('res', res);
    return res;
};

module.exports = addressTimezone;
