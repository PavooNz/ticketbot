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
exports.execute = exports.getDmPermission = exports.getOptions = exports.getDescription = exports.getName = void 0;
const discord_js_1 = require("discord.js");
const settings_model_1 = __importDefault(require("../models/settings_model"));
const ticket_model_1 = __importDefault(require("../models/ticket_model"));
const getName = () => {
    return 'ticket';
};
exports.getName = getName;
const getDescription = () => {
    return 'Set ticket';
};
exports.getDescription = getDescription;
const getOptions = () => {
    return [
        {
            name: 'set',
            description: 'Display ticket message',
            type: 1
        },
        {
            name: 'done',
            description: 'Mark ticket as closed',
            type: 1
        },
        {
            name: 'category',
            description: 'Set category channel id',
            type: 1,
            options: [
                {
                    name: 'id',
                    description: 'Category channel id',
                    type: 3,
                    required: true
                }
            ]
        },
        {
            name: 'text',
            description: 'Set text channel id',
            type: 1,
            options: [
                {
                    name: 'id',
                    description: 'Text channel id',
                    type: 3,
                    required: true
                }
            ]
        }
    ];
};
exports.getOptions = getOptions;
const getDmPermission = () => {
    return false;
};
exports.getDmPermission = getDmPermission;
const execute = (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    /* Check if admin or has role */
    if (!(yield interaction.guild.members.fetch(interaction.user)).permissions.has('Administrator')) {
        yield interaction.reply({
            embeds: [
                new discord_js_1.EmbedBuilder()
                    .setColor('#E74C3C')
                    .setTitle('❌ Oops')
                    .setDescription('Only admin can use this command.')
            ],
            ephemeral: true
        });
        return;
    }
    yield interaction.deferReply({
        ephemeral: true
    });
    /* Ticket setup */
    if (interaction.options.getSubcommand(false) == 'set') {
        yield ((_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.send({
            embeds: [
                new discord_js_1.EmbedBuilder()
                    .setColor('#3498DB')
                    .setTitle('Create Ticket')
                    .setDescription('Please click a button below to continue.')
            ],
            components: [
                new discord_js_1.ActionRowBuilder()
                    .addComponents(client.buttons.get('general_ticket_button').getButton())
                    .addComponents(client.buttons.get('report_bug_button').getButton())
                    .addComponents(client.buttons.get('suggestions_button').getButton())
            ]
        }));
        /* Success */
        yield interaction.editReply({
            embeds: [
                new discord_js_1.EmbedBuilder()
                    .setColor('#57F287')
                    .setTitle('Ticket Page Created')
                    .setDescription('You successfully added a ticket page.')
            ]
        });
    }
    /* Ticket done */
    if (interaction.options.getSubcommand(false) == 'done') {
        /* Find ticket */
        const ticket = yield ticket_model_1.default.findOne({
            channel_id: (_b = interaction.channel) === null || _b === void 0 ? void 0 : _b.id
        });
        /* Ticket not exist */
        if (ticket == null) {
            yield interaction.editReply({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setColor('#E74C3C')
                        .setTitle('❌ Oops')
                        .setDescription('Unable to close ticket. Ticket does not exist.')
                ]
            });
            return;
        }
        /* Mark ticket as closed */
        yield ticket_model_1.default.findByIdAndUpdate(ticket._id, { closed: true }, { new: true });
        yield ((_c = interaction.channel) === null || _c === void 0 ? void 0 : _c.send({
            embeds: [
                new discord_js_1.EmbedBuilder()
                    .setColor('#3498DB')
                    .setTitle('Ticket Closed')
                    .setDescription('Your ticket has been closed.' +
                    '\nWe would love to hear your feedback.')
            ],
            components: [
                new discord_js_1.ActionRowBuilder()
                    .addComponents(client.selectMenus.get('rate_select_menu').getSelectMenu())
            ]
        }));
        /* Success */
        yield interaction.editReply({
            embeds: [
                new discord_js_1.EmbedBuilder()
                    .setColor('#57F287')
                    .setTitle('Ticket Closed')
                    .setDescription('You successfully closed the ticket.')
            ]
        });
        return;
    }
    /* Ticket category channel */
    if (interaction.options.getSubcommand(false) == 'category') {
        const id = interaction.options.getString('id');
        /* Get first doc */
        const settings = yield settings_model_1.default.findOne();
        /* Settings not exist */
        if (settings == null) {
            /* Create */
            const newSettings = new settings_model_1.default({
                category_channel_id: id
            });
            yield newSettings.save();
        }
        else {
            /* Update */
            yield settings_model_1.default.findByIdAndUpdate(settings._id, { category_channel_id: id }, { new: true });
        }
        /* Success */
        yield interaction.editReply({
            embeds: [
                new discord_js_1.EmbedBuilder()
                    .setColor('#57F287')
                    .setTitle('Ticket Closed')
                    .setDescription('You successfully set the category channel id.')
            ]
        });
        return;
    }
    /* Ticket text channel */
    if (interaction.options.getSubcommand(false) == 'text') {
        const id = interaction.options.getString('id');
        /* Get first doc */
        const settings = yield settings_model_1.default.findOne();
        /* Settings not exist */
        if (settings == null) {
            /* Create */
            const newSettings = new settings_model_1.default({
                text_channel_id: id
            });
            yield newSettings.save();
        }
        else {
            /* Update */
            yield settings_model_1.default.findByIdAndUpdate(settings._id, { text_channel_id: id }, { new: true });
        }
        /* Success */
        yield interaction.editReply({
            embeds: [
                new discord_js_1.EmbedBuilder()
                    .setColor('#57F287')
                    .setTitle('Ticket Closed')
                    .setDescription('You successfully set the text channel id.')
            ]
        });
        return;
    }
});
exports.execute = execute;
