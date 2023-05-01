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
exports.execute = exports.getButton = exports.getCustomId = void 0;
const discord_js_1 = require("discord.js");
const settings_model_1 = __importDefault(require("../../models/settings_model"));
const ticket_model_1 = __importDefault(require("../../models/ticket_model"));
const getCustomId = () => {
    return 'close_ticket_button';
};
exports.getCustomId = getCustomId;
const getButton = () => {
    return new discord_js_1.ButtonBuilder()
        .setCustomId((0, exports.getCustomId)())
        .setEmoji('🔒')
        .setLabel('Close Ticket')
        .setStyle(discord_js_1.ButtonStyle.Danger);
};
exports.getButton = getButton;
const execute = (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    /* Initial response */
    yield interaction.deferReply({
        ephemeral: true
    });
    /* Get first doc */
    const settings = yield settings_model_1.default.findOne();
    /* Settings not exist */
    if (settings == null) {
        yield interaction.editReply({
            embeds: [
                new discord_js_1.EmbedBuilder()
                    .setColor('#E74C3C')
                    .setTitle('❌ Oops')
                    .setDescription('Unable to delete ticket. Settings not found.' +
                    '\nPlease contact staff.')
            ]
        });
        return;
    }
    /* Get text channel */
    const ticketTextChannel = client.channels.cache.get(settings.text_channel_id);
    /* Text channel not found */
    if (ticketTextChannel == null) {
        yield interaction.editReply({
            embeds: [
                new discord_js_1.EmbedBuilder()
                    .setColor('#E74C3C')
                    .setTitle('❌ Oops')
                    .setDescription('Unable to delete ticket. Ticket text channel not found.' +
                    '\nPlease contact staff.')
            ]
        });
        return;
    }
    /* Text channel not text */
    if (ticketTextChannel.type != discord_js_1.ChannelType.GuildText) {
        yield interaction.editReply({
            embeds: [
                new discord_js_1.EmbedBuilder()
                    .setColor('#E74C3C')
                    .setTitle('❌ Oops')
                    .setDescription('Unable to delete ticket. Ticket text channel is not a text channel.' +
                    '\nPlease contact staff.')
            ]
        });
        return;
    }
    /* Find ticket */
    const ticket = yield ticket_model_1.default.findOne({
        channel_id: (_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.id
    });
    /* Ticket exist */
    if (ticket != null) {
        /* Mark ticket as closed */
        yield ticket_model_1.default.findByIdAndUpdate(ticket._id, { closed: true }, { new: true });
        /* Delete post in ticket list */
        try {
            yield ticketTextChannel.messages.delete(ticket.ticket_message_id);
        }
        catch (error) {
        }
    }
    /* Delete channel */
    (_b = interaction.channel) === null || _b === void 0 ? void 0 : _b.delete();
});
exports.execute = execute;
