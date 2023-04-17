import * as util from 'minecraft-server-util';

const HOST = 'localhost';
const PORT = 25564;

export async function isActive() {
    try {
        return await util.status(HOST, PORT);
    } catch (err) {
        return false;
    }
}

export async function getWhich() {
    const status = await util.status(HOST, PORT);
    return `${status.motd.clean} (${status.version.name})`;
}

export async function playerCount() {
    const status = await util.status(HOST, PORT);
    return status.players.online;
}

export async function getStatus() {
    return await util.status(HOST, PORT);
}