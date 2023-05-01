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
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.getButton = exports.getCustomId = void 0;
const discord_js_1 = require("discord.js");
const getCustomId = () => {
    return 'suggestions_button';
};
exports.getCustomId = getCustomId;
const getButton = () => {
    return new discord_js_1.ButtonBuilder()
        .setCustomId((0, exports.getCustomId)())
        .setEmoji('💡')
        .setLabel('Suggestions')
        .setStyle(discord_js_1.ButtonStyle.Secondary);
};
exports.getButton = getButton;
const execute = (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
    yield interaction.showModal(client.modals.get('suggestions_modal').getModal());
});
exports.execute = execute;
