import {
  ApplicationCommandOptionData,
  ApplicationCommandType,
  ChatInputApplicationCommandData,
  ChatInputCommandInteraction,
  Client
} from "discord.js";

export abstract class BaseCommand implements ChatInputApplicationCommandData {
  public name: string;
  public description: string;
  public type: ApplicationCommandType.ChatInput =
    ApplicationCommandType.ChatInput;
  public options: ApplicationCommandOptionData[];

  constructor(
    name = "baseCommand",
    description = "baseDescription",
    options: ApplicationCommandOptionData[] = []
  ) {
    this.name = name;
    this.description = description;
    this.options = options;
  }

  public abstract run(
    client: Client,
    interaction: ChatInputCommandInteraction
  ): void;
}
