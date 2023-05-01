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
const ticket_model_1 = __importDefault(require("../../models/ticket_model"));
const getCustomId = () => {
    return 'claim_ticket_button';
};
exports.getCustomId = getCustomId;
const getButton = () => {
    return new discord_js_1.ButtonBuilder()
        .setCustomId((0, exports.getCustomId)())
        .setEmoji('🎫')
        .setLabel('Claim Ticket')
        .setStyle(discord_js_1.ButtonStyle.Success);
};
exports.getButton = getButton;
const execute = (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
    /* Initial response */
    yield interaction.deferReply({
        ephemeral: true
    });
    /* Delete message */
    try {
        yield interaction.message.delete();
    }
    catch (error) {
    }
    /* Find ticket */
    const ticket = yield ticket_model_1.default.findOne({
        ticket_message_id: interaction.message.id
    });
    /* Ticket does not exist */
    if (ticket == null) {
        yield interaction.editReply({
            embeds: [
                new discord_js_1.EmbedBuilder()
                    .setColor('#E74C3C')
                    .setTitle('❌ Oops')
                    .setDescription('Ticket does not exist.')
            ]
        });
        return;
    }
    /* Ticket already closed */
    if (ticket.closed) {
        yield interaction.editReply({
            embeds: [
                new discord_js_1.EmbedBuilder()
                    .setColor('#E74C3C')
                    .setTitle('❌ Oops')
                    .setDescription('Ticket was already closed.')
            ]
        });
        return;
    }
    /* Ticket already claimed by staff */
    if (ticket.staff_id != null) {
        yield interaction.editReply({
            embeds: [
                new discord_js_1.EmbedBuilder()
                    .setColor('#E74C3C')
                    .setTitle('❌ Oops')
                    .setDescription('Ticket was already claimed by other staff.')
            ]
        });
        return;
    }
    /* Find channel */
    const ticketChannel = client.channels.cache.get(ticket.channel_id);
    /* Ticket channel not found */
    if (ticketChannel == null) {
        yield interaction.editReply({
            embeds: [
                new discord_js_1.EmbedBuilder()
                    .setColor('#E74C3C')
                    .setTitle('❌ Oops')
                    .setDescription('Unable to claim ticket. Ticket channel no longer exist.')
            ]
        });
        return;
    }
    /* Set staff (claim ticket) */
    yield ticket_model_1.default.findByIdAndUpdate(ticket._id, { staff_id: interaction.user.id }, { new: true });
    /* Add staff to channel */
    if (ticketChannel.type == discord_js_1.ChannelType.GuildText) {
        /* Add staff */
        ticketChannel.permissionOverwrites.edit(interaction.user, {
            ViewChannel: true,
            SendMessages: true,
            ReadMessageHistory: true
        });
        /* Find message */
        const ticketMessage = yield ticketChannel.messages.fetch(ticket.message_id);
        /* Edit message */
        ticketMessage.edit({
            embeds: [
                new discord_js_1.EmbedBuilder(ticketMessage.embeds[0].data)
            ],
            components: []
        });
        /* Send message */
        const user = client.users.cache.get(ticket.user_id);
        /* User exist */
        if (user != null) {
            ticketChannel.send({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setColor('#57F287')
                        .setTitle('🔔 Staff Arrived')
                        .setDescription(`Hello ${user.toString()}, our staff ${interaction.user.toString()} will now assist you.`)
                ]
            });
        }
    }
    /* Success */
    yield interaction.editReply({
        embeds: [
            new discord_js_1.EmbedBuilder()
                .setColor('#57F287')
                .setTitle('Ticket Claimed')
                .setDescription(`Hello ${interaction.user.toString()}, you have claimed a new ticket.` +
                `\nYou can view it here ${ticketChannel.toString()}.`)
        ]
    });
});
exports.execute = execute;
