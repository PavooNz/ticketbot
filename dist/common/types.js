"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomClient = void 0;
const discord_js_1 = require("discord.js");
class CustomClient extends discord_js_1.Client {
    constructor() {
        super(...arguments);
        this.buttons = new discord_js_1.Collection();
        this.commands = new discord_js_1.Collection();
        this.modals = new discord_js_1.Collection();
        this.selectMenus = new discord_js_1.Collection();
    }
}
exports.CustomClient = CustomClient;
