const Model = require('./model');
const {users} = require('./initSequalize');

class Users extends Model {
    constructor() {
        super(users);
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

module.exports = Users;