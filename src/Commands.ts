import { ApplicationCommandDataResolvable } from "discord.js";
import Ping from "./commands/Ping";
import RandomUser from "./commands/RandomUser";
import { BaseCommand } from "./commands/BaseCommand";

export const Commands: BaseCommand[] = [
  // BackUp,
  // McCmd,
  // McStatus,
  // McPlayerCount,
  // StartServer,
  // StopServer,
  new Ping(),
  new RandomUser()
];
