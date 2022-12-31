#!/usr/bin/env node

// Loads .env file contents into process.env.
import { config } from "dotenv";
config();

const HEADERS = { "authorization": process.env.TOKEN, "content-type": "application/json" };
const FRIENDS = await fetch("https://discord.com/api/v9/users/@me/relationships",
{
    method: "GET",
    headers: HEADERS,
}).then(res => res.json());

for (const FRIEND of FRIENDS)
{

    const MESSAGE = process.argv.slice(2)[0].replaceAll("{name}", FRIEND.user.username);
    fetch(`https://discord.com/api/v9/channels/${FRIEND.id}/messages`,
    {
        method: "POST",
        headers: HEADERS,
        body: JSON.stringify({ content: MESSAGE }),  
    });
}
