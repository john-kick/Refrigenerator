import * as util from 'minecraft-server-util';

export async function isActive() {
    try {
        return await util.status('localhost');
    } catch (err) {
        return false;
    }
}

export async function getWhich() {
    const status = await util.status('localhost');
    return `${status.motd.clean} (${status.version.name})`;
}

export async function playerCount() {
    const status = await util.status('localhost');
    return status.players.online;
}

export async function getStatus() {
    return await util.status('localhost');
}