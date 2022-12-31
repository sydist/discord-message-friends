#!/usr/bin/env node

import { config } from "dotenv";
config();

const IGNORED_USERS = process.env.IGNORE.split(" ");
const HEADERS = { "authorization": process.env.TOKEN, "content-type": "application/json" };
const FRIENDS = await fetch("https://discord.com/api/v9/users/@me/relationships",
{
    method: "GET",
    headers: HEADERS,
}).then(res => res.json());

let requests = [];
for (const FRIEND of FRIENDS)
{
    if (IGNORED_USERS.includes(FRIEND.id)) 
        continue;

    const request = fetch("https://discord.com/api/v9/users/@me/channels",
    {
        method: "POST",
        headers: HEADERS,
        body: JSON.stringify({ "recipients": [`${FRIEND.id}`] }),  
    }).then(res => res.json());

    requests.push(request);
}

await Promise.all(requests);

let i = 0;
for (const FRIEND of FRIENDS)
{
    if (IGNORED_USERS.includes(FRIEND.id)) 
        continue;

    const MESSAGE = process.argv.slice(2)[0].replaceAll("{name}", FRIEND.user.username);
    const ID = (await requests[i]).id
    fetch(`https://discord.com/api/v9/channels/${ID}/messages`,
    {
        method: "POST",
        headers: HEADERS,
        body: JSON.stringify({ content: MESSAGE }),  
    });

    i++;
}
