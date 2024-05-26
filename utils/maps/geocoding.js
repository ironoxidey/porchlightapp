const { Client } = require('@googlemaps/google-maps-services-js');
// const config = !process.env.NODE_ENV ? require('config') : process.env;
const config =
    !process.env.HOME !== '/root'
        ? //DEV
          require('config')
        : //PRODUCTION
          require('../../../porchlight-config/default.json'); // if there's no !process.env.HOME !== '/root' then it's 'development', otherwise it will be 'production' and it will need to look outside of the app directory because the Github action runner overwrites it every time we push to main

const addressGeocode = async (payload) => {
    console.log('addressGeocode payload', payload);
    const args = {
        params: {
            key: config['GOOGLE_MAPS_API_KEY'],
            address: payload,
        },
    };
    const client = new Client();

    const res = await client.geocode(args).then((gcResponse) => {
        const str = gcResponse.data.results[0];
        //console.log(`First result is: ${str}`);
        //console.log('str', str);
        if (str.geometry && str.geometry.location) {
            //console.log('str.geometry', str.geometry);
            return [str.geometry.location.lng, str.geometry.location.lat]; //this is for MongoDB, it's backwards for some reason
        }
    });
    console.log('addressGeocode res', res);
    return res;
};

module.exports = addressGeocode;
