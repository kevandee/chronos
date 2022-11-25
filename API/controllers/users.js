var wc = require("which-country");
const fetch = require("node-fetch");
const { GEONAMES_USERNAME, HOLIDAY_API_KEY } = require("../config.json");
const users = new (require("../models/users"))();

module.exports = {
  async setLocation(req, res) {
    try {
      if (!req.body.latitude || !req.body.longitude) {
        return res.sendStatus(400);
      }
      const url = `http://api.geonames.org/countryCodeJSON?lat=${req.body.latitude}&lng=${req.body.longitude}&username=${GEONAMES_USERNAME}`;
      let geoRes = await (await fetch(url)).json();
      await users.save({ id: req.user.id, country: geoRes.countryCode });
      res.sendStatus(200);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  },

  async getHoliday(req, res) {
    try {
      const { country } = await users.find({ id: req.user.id });
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();

      const response = await fetch(
        `https://holidays.abstractapi.com/v1/?api_key=${HOLIDAY_API_KEY}&country=${country}&year=${year}&month=${
          month + 1
        }&day=${day}`
      );
      const data = await response.json();

      if (data && data[0]) {
        res.json(data[0]);
      } else {
        res.json({});
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
