'use strict';

const Event = use('Event');
// const Database = use('Database');

Event.on('password:forgot', 'User.sendEmailPasswordForgot');
Event.on('password:updated', 'User.sendEmailPasswordUpdated');

Event.on('db:query', (query) => console.log(query));
