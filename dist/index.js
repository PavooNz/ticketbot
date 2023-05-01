"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
const discord_js_1 = require("discord.js");
const types_1 = require("./common/types");
const button_handler_1 = require("./handlers/button_handler");
const command_handler_1 = require("./handlers/command_handler");
const modal_handler_1 = require("./handlers/modal_handler");
const select_menu_handler_1 = require("./handlers/select_menu_handler");
mongoose_1.default.connect(process.env.CONNECTION_URL)
    .then(() => console.log('Ticket bot is now connected to database'))
    .catch((error) => console.log(error.message));
/* Custom client with commands property */
const client = new types_1.CustomClient({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds
    ]
});
/* Initialize collections */
client.buttons = new discord_js_1.Collection();
client.commands = new discord_js_1.Collection();
client.modals = new discord_js_1.Collection();
client.selectMenus = new discord_js_1.Collection();
/* Ready */
client.once('ready', () => {
    (0, button_handler_1.buttonHandler)(client);
    (0, command_handler_1.commandHandler)(client);
    (0, modal_handler_1.modalHandler)(client);
    (0, select_menu_handler_1.selectMenuHandler)(client);
    console.log('Ticket bot is online');
});
/* Interaction */
client.on('interactionCreate', (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    /* Not in guild */
    if (interaction.guild == null) {
        if (interaction.isRepliable()) {
            yield interaction.reply({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setColor(0x0099FF)
                        .setTitle('❌ Oops')
                        .setDescription('Hello! Please invite me to your server first.')
                ]
            });
        }
        return;
    }
    if (interaction.isButton()) {
        const button = client.buttons.get(interaction.customId);
        if (!button)
            return;
        button.execute(client, interaction);
        return;
    }
    if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command)
            return;
        command.execute(client, interaction);
        return;
    }
    if (interaction.isModalSubmit()) {
        const modal = client.modals.get(interaction.customId);
        if (!modal)
            return;
        modal.execute(client, interaction);
        return;
    }
    if (interaction.isSelectMenu()) {
        const selectMenu = client.selectMenus.get(interaction.customId);
        if (!selectMenu)
            return;
        selectMenu.execute(client, interaction);
        return;
    }
}));
client.login(process.env.DISCORD_TOKEN);
