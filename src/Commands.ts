import { Command } from "./Command";
import { User } from "./commands/user";
import { IP } from "./commands/ip";
import { Ping } from "./commands/ping";
import { RandomUser } from "./commands/randomuser";
import { BackUp } from "./commands/minecraftServerCommands/backup";
import { McCmd } from "./commands/minecraftServerCommands/mccmd";
import { McStatus } from "./commands/minecraftServerCommands/mcstatus";
import { MapFromPicture } from "./commands/minecraftServerCommands/mapfrompicture";
import { McPlayerCount } from "./commands/minecraftServerCommands/mcusercount";
import { StartServer } from "./commands/minecraftServerCommands/startserver";
import { StopServer } from "./commands/minecraftServerCommands/stopserver";

export const Commands: Command[] = [
    BackUp,
    MapFromPicture,
    McCmd,
    McStatus,
    McPlayerCount,
    StartServer,
    StopServer,
    User,
    IP,
    Ping,
    RandomUser
];