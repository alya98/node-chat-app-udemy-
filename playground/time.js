const moment = require('moment');

// const date = moment();

// console.log(date.add('h', 6).format('h:mm a'));
const createdAt = 12234;

const date = moment(createdAt);

console.log(date.format('h:mm a'))