require('dotenv-defaults').config();
const axios = require('axios');

const instance = axios.create({
    baseURL: 'https://api.clickup.com/api/v2/',
    timeout: 10000,
    headers: {
             'Authorization': process.env.CLICKUP_API_TOKEN,
             'Content-Type': 'application/json'
            }
});


exports.addTask = async (data) => {
    return instance.post(`list/${process.env.LIST_ID}/task/`, {
        "name": data.title,
        "description": data.description,
        "assignees": [],
        "tags": process.env.TAGS.split(','),
        "status": process.env.STATUS,
        "priority": 3,
        "due_date_time": false,
        "start_date_time": false,
        "notify_all": true,
        "parent": data.father,
        "custom_fields": []
    })
}