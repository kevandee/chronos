const config = require('../config.json');
const fetch = require('node-fetch');

const users = new (require("../models/users"))();
const calendars = new (require("../models/calendars"))();
const events = new (require("../models/events"))();
const users_calendars = new (require("../models/users_calendars"))();
const events_calendars = new (require("../models/events_calendars"))();

module.exports = {
    async getCalendarsList(req,res) {
        let calendars = await users.getUsersCalendars({user_id: req.user.id});
        // console.log(calendars);
        res.json({calendars});
    },

    async newCalendar(req,res) {
        const data = req.body;
        if(!data.title || !data.members) {
            res.sendStatus(400);
            return;
        }
        data.author_id = req.user.id;
        data.create_date = new Date();
        const {members, ...newCalendar} = data;
        let savedCalendar = await calendars.save(newCalendar);
        if (!savedCalendar) {
            res.status(500).json(isSuccess);
            return;
        }

        for (const member of members) {
            if (data.members.filter(val => val.id == member.id).length != 1) {
                calendars.delete({id: savedCalendar.id});
                res.sendStatus(400);
                return;
            }
        }
        for (const member of members) {
            await users_calendars.save({user_id: member.id, calendar_id: savedCalendar.id, user_role: member.id == req.user.id ? 'assignee' : 'watcher'});
        }

        res.sendStatus(200);
        return;
    },

    async getCalendar(req,res) {
        const {calendarId} = req.params;
        if (isNaN(parseInt(calendarId))) {
            res.sendStatus(400);
            return;
        }

        const calendar = await calendars.find({id: calendarId});
        if (!calendar) {
            res.sendStatus(404);
            return;
        }

        res.json(calendar);
    },
    
    async updateCalendar(req,res) {
        const {calendarId} = req.params;
        if (isNaN(parseInt(calendarId))) {
            res.sendStatus(400);
            return;
        }

        const user = await users_calendars.find({user_id: req.user.id, calendar_id: calendarId});
        if (user.user_role != "assignee") {
            res.sendStatus(403);
            return;
        }

        const data = req.body;
        data.id = calendarId;

        // updated_at ?????
        //data.create_date = new Date();
        
        let updatedCalendar = await calendars.save(data);
        if (!updatedCalendar) {
            res.status(500).json(updatedCalendar);
            return;
        }

        if (data.members) {
            for (const member of data.members) {
                if (data.members.filter(val => val.id == member.id).length != 1) {
                    res.sendStatus(400);
                    return;
                }
            }
            await users_calendars.delete({calendar_id: calendarId});
            for (const member of data.members) {
                await users_calendars.save({user_id: member.id, calendar_id: calendarId, user_role: member.role});
            }
        }

        res.sendStatus(200);
        return;
    },

    async deleteCalendar(req, res) {
        const {calendarId} = req.params;
        if (isNaN(parseInt(calendarId))) {
            res.sendStatus(400);
            return;
        }
        const members = await users_calendars.find({calendar_id: calendarId});
        const user = members.find(member => member.user_id == req.user.id);
        if (!user || user.user_role != "assignee") {
            res.sendStatus(403);
            return;
        }

        if(members.length == 1) {
            await calendars.delete({id: calendarId});
            res.sendStatus(200);
            return;
        }

        await users_calendars.delete({user_id: req.user.id, calendar_id: calendarId});
        res.sendStatus(200);
    },
    
    async getCalendarMembers(req,res) {
        const {calendarId} = req.params;
        if (isNaN(parseInt(calendarId))) {
            res.sendStatus(400);
            return;
        }

        let members = await calendars.getCalendarMembers(calendarId);
        if (!members.find(member => member.id == req.user.id)) {
            res.sendStatus(403);
            return;
        }

        res.json({members});
    },
    
    async setCalendarMembers(req,res) {
        const {calendarId} = req.params;
        if (isNaN(parseInt(calendarId))) {
            res.sendStatus(400);
            return;
        }

        const user = await users_calendars.find({user_id: req.user.id, calendar_id: calendarId});
        if (user.user_role != "assignee") {
            res.sendStatus(403);
            return;
        }
        const data = req.body;
        if (!data.members) {
            res.sendStatus(400);
            return;
        }

        for (const member of data.members) {
            if (data.members.filter(val => val.id == member.id).length != 1) {
                res.sendStatus(400);
                return;
            }
        }

        await users_calendars.delete({calendar_id: calendarId});
        for (const member of data.members) {
            await users_calendars.save({user_id: member.id, calendar_id: calendarId, user_role: member.role});
        }

        res.sendStatus(200);
    },
    
    async getCalendarEvents(req,res) {
        const {calendarId} = req.params;
        if (isNaN(parseInt(calendarId))) {
            res.sendStatus(400);
            return;
        }

        let members = await calendars.getCalendarMembers(calendarId);
        if (!members.find(member => member.id == req.user.id)) {
            res.sendStatus(403);
            return;
        }

        let events = await calendars.getCalendarEvents(calendarId);
        res.json(events);
    },
    
    async newCalendarEvent(req,res) {
        const {calendarId} = req.params;
        if (isNaN(parseInt(calendarId))) {
            res.sendStatus(400);
            return;
        }

        const data = req.body;
        if (!data.title || !data.description || !data.start_at || !data.end_at || !data.type) {
            res.sendStatus(400);
            return;
        }

        const user = await users_calendars.find({user_id: req.user.id, calendar_id: calendarId});
        // console.log(user)
        if (user.user_role != "assignee") {
            res.sendStatus(403);
            return;
        }

        data.author_id = req.user.id;
        data.create_date = new Date();

        let newEvent = await events.save(data);
        if (!newEvent) {
            res.status(500).json(newEvent);
            return;
        }

        await events_calendars.save({event_id: newEvent.id, calendar_id: calendarId});

        res.json({id: newEvent.id});
    },
    
    async deleteCalendarEvent(req,res) {
        const {calendarId, eventId} = req.params;
        if (isNaN(parseInt(calendarId)) || isNaN(parseInt(eventId))) {
            res.sendStatus(400);
            return;
        }
        const user = await users_calendars.find({user_id: req.user.id, calendar_id: calendarId});
        if (user.user_role != "assignee") {
            res.sendStatus(403);
            return;
        }

        let result = await events_calendars.delete({calendar_id: calendarId, event_id: eventId});
        if(result == 0) {
            res.sendStatus(404);
            return;
        }
        res.sendStatus(200);
    },

    async inviteMembersToCalendar(req, res) {
        const {calendarId, eventId} = req.params;
        if (isNaN(parseInt(calendarId)) || isNaN(parseInt(eventId))) {
            res.sendStatus(400);
            return;
        }
        const members = await users_calendars.find({calendar_id: calendarId});
        const user = members.find(member => member.user_id == req.user.id);
        if (!user || user.user_role != "assignee") {
            res.sendStatus(403);
            return;
        }

        const data = req.body;
        if(!data.members) {
            res.sendStatus(400);
            return;
        }

        for (const member of data.members) {
            if (data.members.filter(val => val.id == member.id).length != 1) {
                res.sendStatus(400);
                return;
            }
        }

        for (const newMember of data.members) {
            let member = members.filter(val => val.user_id == newMember.id)
            if (member && member.user_role != newMember.role) {
                await users_calendars.table.update();
            }

            await users_calendars.save({user_id: newMember.id, calendar_id: calendarId, user_role: newMember.role});
        }

        res.sendStatus(200);
    }
}