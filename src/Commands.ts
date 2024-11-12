import { Command } from "./Command";
import { Ping } from "./commands/ping";
import { RandomUser } from "./commands/randomuser";
import { BackUp } from "./commands/minecraftServerCommands/backup";
import { McCmd } from "./commands/minecraftServerCommands/mccmd";
import { McStatus } from "./commands/minecraftServerCommands/mcstatus";
import { McPlayerCount } from "./commands/minecraftServerCommands/mcusercount";
import { StartServer } from "./commands/minecraftServerCommands/startserver";
import { StopServer } from "./commands/minecraftServerCommands/stopserver";

export const Commands: Command[] = [
  // BackUp,
  // McCmd,**
  // McStatus,
  // McPlayerCount,
  // StartServer,
  // StopServer,
  Ping,
  RandomUser,
];
