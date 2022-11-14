const Model = require('./model');
const {users, calendars, users_calendars} = require('./initSequalize');

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

    async getUsersCalendars(userProps) {
        if (!userProps) {
            return new Error("Criterion object is undefined");
        }
        let list = await calendars.findAll({
            attributes: {exclude: ["author_id"]},
            include: [{
                model: users,
                attributes: ["id", "login", "full_name", "profile_picture"],
                required: true,
                as: "author"
            },
            {
                model: users_calendars,
                where: userProps,
                as: "users_calendars",
                attributes: []
            }]
        });

        list = await Promise.all(list.map(async (calendar) => {
            calendar.dataValues.members = calendars.getCalendarMembers(calendar.id);
            return calendar;
        }))

        return list;
    }
}

module.exports = Users;