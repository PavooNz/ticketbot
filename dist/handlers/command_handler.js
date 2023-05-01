"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandHandler = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const commandHandler = (client) => {
    var _a;
    let count = 0;
    let applicationCommands = (_a = client.application) === null || _a === void 0 ? void 0 : _a.commands;
    const directoryPath = node_path_1.default.resolve(__dirname, '../commands');
    const files = node_fs_1.default.readdirSync(directoryPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
    for (const file of files) {
        const command = require(node_path_1.default.join(directoryPath, file));
        // Add to commands collection
        client.commands.set(command.getName(), command);
        // Register command
        applicationCommands === null || applicationCommands === void 0 ? void 0 : applicationCommands.create({
            name: command.getName(),
            description: command.getDescription(),
            options: command.getOptions(),
            dmPermission: command.getDmPermission(),
        });
        count++;
    }
    console.log(`Loaded ${count} commands`);
};
exports.commandHandler = commandHandler;
