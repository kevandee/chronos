var wc = require('which-country');
const fetch = require('node-fetch');

module.exports = {
    async setLocation(req, res) {
        console.log(await (await fetch(`http://api.geonames.org/countryCodeJSON?lat=${req.body.latitude}&lng=${req.body.longitude}&username=kevandee`)).json());
    }
}