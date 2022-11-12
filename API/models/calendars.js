const Model = require('./model');
const {calendars} = require('./initSequalize');

class Calendars extends Model {
    constructor() {
        super(calendars);
    }

    async find(obj) {
        return await super.find(obj);
    }

    async save(obj) {
        return await super.save(obj);
    }

    async delete(obj) {
        return await super.delete(obj);
    }
}

module.exports = Calendars;