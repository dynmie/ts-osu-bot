import { Client } from "discord.js";
import { Api as OsuApi } from "node-osu";
import { osuKey, token } from "../config.json";
import CommandManager from "./commands/CommandManager";
import { ListenerManager } from "./listeners/ListenerManager";

export default class App {

    private _commandManager = new CommandManager(this);
    get commandManager(): CommandManager {
        return this._commandManager;
    }

    private _listenerManager = new ListenerManager(this);
    get listenerManager(): ListenerManager {
        return this._listenerManager;
    }

    private _client = new Client({ intents: 3276799 });
    get client(): Client {
        return this._client;
    }

    private _osuApi = new OsuApi(osuKey, {
        notFoundAsError: true,
        completeScores: false,
        parseNumeric: false,
    });
    get osuApi(): OsuApi {
        return this._osuApi;
    }

    run() {
        this.listenerManager.register();
        this.client.login(token);
    }

}