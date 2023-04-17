import { Command } from "./Command";
import { User } from "./commands/user";
import { IP } from "./commands/ip";
import { Ping } from "./commands/ping";
import { RandomUser } from "./commands/randomuser";

export const Commands: Command[] = [
    User,
    IP,
    Ping,
    RandomUser
];