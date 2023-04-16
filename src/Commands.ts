import { Command } from "./Command";
import { User } from "./commands/user";
import { IP } from "./commands/ip";

export const Commands: Command[] = [
    User,
    IP
];