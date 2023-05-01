"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buttonHandler = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const buttonHandler = (client) => {
    let count = 0;
    const directoryPath = node_path_1.default.resolve(__dirname, '../components/buttons');
    const files = node_fs_1.default.readdirSync(directoryPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
    for (const file of files) {
        const button = require(node_path_1.default.join(directoryPath, file));
        // Add to buttons collection
        client.buttons.set(button.getCustomId(), button);
        count++;
    }
    console.log(`Loaded ${count} buttons`);
};
exports.buttonHandler = buttonHandler;
