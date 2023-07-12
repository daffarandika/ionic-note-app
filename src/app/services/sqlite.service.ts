import { Injectable } from '@angular/core';

import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteDBConnection, SQLiteConnection, capSQLiteSet,
         capSQLiteChanges, capSQLiteValues, capEchoResult, capSQLiteResult,
         capNCDatabasePathResult,
         JsonSQLite,
         capSQLiteQueryOptions,
         CapacitorSQLitePlugin,
         capSQLiteOptions} from '@capacitor-community/sqlite';

@Injectable()

export class SQLiteService {
    sqliteConnection: SQLiteConnection;
    isService: boolean = false;
    platform: string = "";
    sqlitePlugin: CapacitorSQLitePlugin;
    native: boolean = false;

    constructor() {
        this.sqlitePlugin = CapacitorSQLite;
        this.sqliteConnection = new SQLiteConnection(this.sqlitePlugin);
        this.isService = true;
        console.log("sqlite service const" + JSON.stringify(this.sqliteConnection))
    }
    /**
     * Plugin Initialization
     */
    initializePlugin(): Promise<boolean> {
        return new Promise (resolve => {
            this.platform = Capacitor.getPlatform();
            if(this.platform === 'ios' || this.platform === 'android') this.native = true;
            this.sqlitePlugin = CapacitorSQLite;
            this.sqliteConnection = new SQLiteConnection(this.sqlitePlugin);
            this.isService = true;
            resolve(true);
            console.log("init sqlite service")
        });
    }
    /**
     * Echo a value
     * @param value
     */
    async echo(value: string): Promise<capEchoResult> {
        if(this.sqliteConnection != null) {
            try {
                const ret = await this.sqliteConnection.echo(value);
                return Promise.resolve(ret);
            } catch (err) {
                return Promise.reject(new Error("Error on echo"));
            }
        } else {
            return Promise.reject(new Error("no connection open"));
        }
    }
    async isSecretStored(): Promise<capSQLiteResult> {
        if(!this.native) {
            return Promise.reject(new Error(`Not implemented for ${this.platform} platform`));
        }
        if(this.sqliteConnection != null) {
            try {
                return Promise.resolve(await this.sqliteConnection.isSecretStored());
            } catch (err) {
                return Promise.reject(new Error(JSON.stringify(err)));
            }
        } else {
            return Promise.reject(new Error(`no connection open`));
        }
    }
    async setEncryptionSecret(passphrase: string): Promise<void> {
        if(!this.native) {
            return Promise.reject(new Error(`Not implemented for ${this.platform} platform`));
        }
        if(this.sqliteConnection != null) {
            try {
                return Promise.resolve(await this.sqliteConnection.setEncryptionSecret(passphrase));
            } catch (err) {
                return Promise.reject(new Error(JSON.stringify(err)));
            }
        } else {
            return Promise.reject(new Error(`no connection open`));
        }

    }

    async changeEncryptionSecret(passphrase: string, oldpassphrase: string): Promise<void> {
        if(!this.native) {
            return Promise.reject(new Error(`Not implemented for ${this.platform} platform`));
        }
        if(this.sqliteConnection != null) {
            try {
                return Promise.resolve(await this.sqliteConnection.changeEncryptionSecret(passphrase, oldpassphrase));
            } catch (err) {
                return Promise.reject(new Error(JSON.stringify(err)));
            }
        } else {
            return Promise.reject(new Error(`no connection open`));
        }

    }

    /**
     * addUpgradeStatement
     * @param database
     * @param toVersion
     * @param statements
     */
    async addUpgradeStatement(database:string, toVersion: number, statements: string[])
                                        : Promise<void> {
        if(this.sqliteConnection != null) {
            try {
                await this.sqliteConnection.addUpgradeStatement(database, toVersion, statements);
                return Promise.resolve();
            } catch (err) {
                return Promise.reject(new Error(JSON.stringify(err)));
            }
        } else {
            return Promise.reject(new Error(`no connection open for ${database}`));
        }
    }
    /**
     * get a non-conformed database path
     * @param path
     * @param database
     * @returns Promise<capNCDatabasePathResult>
     * @since 3.3.3-1
     */
    async getNCDatabasePath(folderPath: string, database: string): Promise<capNCDatabasePathResult> {
        if(this.sqliteConnection != null) {
            try {
                const res: capNCDatabasePathResult = await this.sqliteConnection.getNCDatabasePath(
                                                        folderPath, database);
                return Promise.resolve(res);
            } catch (err) {
                return Promise.reject(new Error(JSON.stringify(err)));
            }
        } else {
            return Promise.reject(new Error(`no connection open for ${database}`));
        }

    }
    /**
     * Create a non-conformed database connection
     * @param databasePath
     * @param version
     * @returns Promise<SQLiteDBConnection>
     * @since 3.3.3-1
     */
    async createNCConnection(databasePath: string, version: number): Promise<SQLiteDBConnection> {
        if(this.sqliteConnection != null) {
            try {
                const db: SQLiteDBConnection = await this.sqliteConnection.createNCConnection(
                                databasePath, version);
                if (db != null) {
                    return Promise.resolve(db);
                } else {
                    return Promise.reject(new Error(`no db returned is null`));
                }
            } catch (err) {
                return Promise.reject(new Error(JSON.stringify(err)));
            }
        } else {
            return Promise.reject(new Error(`no connection open for ${databasePath}`));
        }

    }
    /**
     * Close a non-conformed database connection
     * @param databasePath
     * @returns Promise<void>
     * @since 3.3.3-1
     */
    async closeNCConnection(databasePath: string): Promise<void> {
        if(this.sqliteConnection != null) {
            try {
                await this.sqliteConnection.closeNCConnection(databasePath);
                return Promise.resolve();
            } catch (err) {
                return Promise.reject(new Error(JSON.stringify(err)));
            }
        } else {
            return Promise.reject(new Error(`no connection open for ${databasePath}`));
        }
    }
    /**
     * Check if a non-conformed databaseconnection exists
     * @param databasePath
     * @returns Promise<capSQLiteResult>
     * @since 3.3.3-1
     */
    async isNCConnection(databasePath: string): Promise<capSQLiteResult> {
        if(this.sqliteConnection != null) {
            try {
                return Promise.resolve(await this.sqliteConnection.isNCConnection(databasePath));
            } catch (err) {
                return Promise.reject(new Error(JSON.stringify(err)));
            }
        } else {
            return Promise.reject(new Error(`no connection open`));
        }

    }
    /**
     * Retrieve a non-conformed database connection
     * @param databasePath
     * @returns Promise<SQLiteDBConnection>
     * @since 3.3.3-1
     */
     async retrieveNCConnection(databasePath: string): Promise<SQLiteDBConnection> {
        if(this.sqliteConnection != null) {
            try {
                return Promise.resolve(await this.sqliteConnection.retrieveNCConnection(databasePath));
            } catch (err) {
                return Promise.reject(new Error(JSON.stringify(err)));
            }
        } else {
            return Promise.reject(new Error(`no connection open for ${databasePath}`));
        }
    }
    /**
     * Check if a non conformed database exists
     * @param databasePath
     * @returns Promise<capSQLiteResult>
     * @since 3.3.3-1
     */
    async isNCDatabase(databasePath: string): Promise<capSQLiteResult> {
        if(this.sqliteConnection != null) {
            try {
                return Promise.resolve(await this.sqliteConnection.isNCDatabase(databasePath));
            } catch (err) {
                return Promise.reject(new Error(JSON.stringify(err)));
            }
        } else {
            return Promise.reject(new Error(`no connection open`));
        }
    }
    /**
     * Create a connection to a database
     * @param database
     * @param encrypted
     * @param mode
     * @param version
     */
    async createConnection(dbSchema: JsonSQLite): Promise<SQLiteDBConnection> {
      var database= "";
      var encrypted = true;
      var mode = "";
      var version = 0;
      ({ database, encrypted, mode, version } = dbSchema);
      if(this.sqliteConnection != null) {
        let db: SQLiteDBConnection;
        try {
            const isConsistent = (await this.sqliteConnection.checkConnectionsConsistency()).result
            const isConnected = (await this.sqliteConnection.isConnection(database, true)).result

if (isConnected && isConsistent) {
    db = await this.sqliteConnection.retrieveConnection(database, true);
} else {
    db = await this.sqliteConnection.createConnection(database, encrypted, mode, version, true);
}
            console.log("create conn db" + JSON.stringify(dbSchema))
            return new Promise(async (resolve, reject) => {
                if (db === null) {
                    console.log("null db")
                    reject(new Error("null db"))
                }
                console.log("not null db")
                await db.open()
                resolve(db)
            })
        } catch (err) {
            // this.createSyncTable(dbSchema);
            if (err instanceof Error) {
                throw err;
            } else {
                throw new Error(JSON.stringify(err))
            }
        }
        } else {
            return Promise.reject(new Error(`no connection open for ${database}`));
        }
    }
    /**
     * Close a connection to a database
     * @param database
     */
    async closeConnection(database:string): Promise<void> {
        if(this.sqliteConnection != null) {
            try {
                await this.sqliteConnection.closeConnection(database, false);
                return Promise.resolve();
            } catch (err) {
                return Promise.reject(new Error(JSON.stringify(err)));
            }
        } else {
            return Promise.reject(new Error(`no connection open for ${database}`));
        }
    }
    /**
     * Retrieve an existing connection to a database
     * @param database
     */
    async retrieveConnection(database:string):
            Promise<SQLiteDBConnection> {
        if(this.sqliteConnection != null) {
            try {
                return Promise.resolve(await this.sqliteConnection.retrieveConnection(database, false));
            } catch (err) {
                return Promise.reject(new Error(JSON.stringify(err)));
            }
        } else {
            return Promise.reject(new Error(`no connection open for ${database}`));
        }
    }
    /**
     * Retrieve all existing connections
     */
    async retrieveAllConnections():
                    Promise<Map<string, SQLiteDBConnection>> {
        if(this.sqliteConnection != null) {
            try {
                const myConns =  await this.sqliteConnection.retrieveAllConnections();
/*                let keys = [...myConns.keys()];
                keys.forEach( (value) => {
                    console.log("Connection: " + value);
                });
*/
                return Promise.resolve(myConns);
            } catch (err) {
                return Promise.reject(new Error(JSON.stringify(err)));
            }
        } else {
            return Promise.reject(new Error(`no connection open`));
        }
    }
    /**
     * Close all existing connections
     */
    async closeAllConnections(): Promise<void> {
        if(this.sqliteConnection != null) {
            try {
                return Promise.resolve(await this.sqliteConnection.closeAllConnections());
            } catch (err) {
                return Promise.reject(new Error(JSON.stringify(err)));
            }
        } else {
            return Promise.reject(new Error(`no connection open`));
        }
    }
    /**
     * Check if connection exists
     * @param database
     */
     async isConnection(database: string): Promise<capSQLiteResult> {
        if(this.sqliteConnection != null) {
            try {
                return Promise.resolve(await this.sqliteConnection.isConnection(database, false));
            } catch (err) {
                return Promise.reject(new Error(JSON.stringify(err)));
            }
        } else {
            return Promise.reject(new Error(`no connection open`));
        }
    }
    /**
     * Check Connections Consistency
     * @returns
     */
    async checkConnectionsConsistency(): Promise<capSQLiteResult> {
        if(this.sqliteConnection != null) {
            try {
                const res = await this.sqliteConnection.checkConnectionsConsistency();
                return Promise.resolve(res);
            } catch (err) {
                return Promise.reject(new Error(JSON.stringify(err)));
            }
        } else {
            return Promise.reject(new Error(`no connection open`));
        }
    }
    /**
     * Check if database exists
     * @param database
     */
    async isDatabase(database: string): Promise<capSQLiteResult> {
        if(this.sqliteConnection != null) {
            try {
                return Promise.resolve(await this.sqliteConnection.isDatabase(database));
            } catch (err) {
                return Promise.reject(new Error(JSON.stringify(err)));
            }
        } else {
            return Promise.reject(new Error(`no connection open`));
        }
    }
    /**
     * Get the list of databases
     */
    async getDatabaseList() : Promise<capSQLiteValues> {
        if(this.sqliteConnection != null) {
            try {
                return Promise.resolve(await this.sqliteConnection.getDatabaseList());
            } catch (err) {
                return Promise.reject(new Error(JSON.stringify(err)));
            }
        } else {
            return Promise.reject(new Error(`no connection open`));
        }
    }
    /**
     * Get Migratable databases List
     */
    async getMigratableDbList(folderPath?: string): Promise<capSQLiteValues>{
        if(!this.native) {
            return Promise.reject(new Error(`Not implemented for ${this.platform} platform`));
        }
        if(this.sqliteConnection != null) {
            try {
                if(!folderPath || folderPath.length === 0) {
                    return Promise.reject(new Error(`You must provide a folder path`));
                }
                return Promise.resolve(await this.sqliteConnection.getMigratableDbList(folderPath));
            } catch (err) {
                return Promise.reject(new Error(JSON.stringify(err)));
            }
        } else {
            return Promise.reject(new Error(`no connection open`));
        }
    }

    /**
     * Add "SQLite" suffix to old database's names
     */
    async addSQLiteSuffix(folderPath?: string, dbNameList?: string[]): Promise<void>{
        if(!this.native) {
            return Promise.reject(new Error(`Not implemented for ${this.platform} platform`));
        }
        if(this.sqliteConnection != null) {
            try {
                const path: string = folderPath ? folderPath : "default";
                const dbList: string[] = dbNameList ? dbNameList : [];
                return Promise.resolve(await this.sqliteConnection.addSQLiteSuffix(path, dbList));
            } catch (err) {
                return Promise.reject(new Error(JSON.stringify(err)));
            }
        } else {
            return Promise.reject(new Error(`no connection open`));
        }
    }
    /**
     * Delete old databases
     */
    async deleteOldDatabases(folderPath?: string, dbNameList?: string[]): Promise<void>{
        if(!this.native) {
            return Promise.reject(new Error(`Not implemented for ${this.platform} platform`));
        }
        if(this.sqliteConnection != null) {
            try {
                const path: string = folderPath ? folderPath : "default";
                const dbList: string[] = dbNameList ? dbNameList : [];
                return Promise.resolve(await this.sqliteConnection.deleteOldDatabases(path, dbList));
            } catch (err) {
                return Promise.reject(new Error(JSON.stringify(err)));
            }
        } else {
            return Promise.reject(new Error(`no connection open`));
        }
    }

    /**
     * Import from a Json Object
     * @param jsonstring
     */
    async importFromJson(jsonstring:string): Promise<capSQLiteChanges> {
        if(this.sqliteConnection != null) {
            try {
                return Promise.resolve(await this.sqliteConnection.importFromJson(jsonstring));
            } catch (err) {
                return Promise.reject(new Error(JSON.stringify(err)));
            }
        } else {
            return Promise.reject(new Error(`no connection open`));
        }

    }

    /**
     * Is Json Object Valid
     * @param jsonstring Check the validity of a given Json Object
     */

    async isJsonValid(jsonstring:string): Promise<capSQLiteResult> {
        if(this.sqliteConnection != null) {
            try {
                return Promise.resolve(await this.sqliteConnection.isJsonValid(jsonstring));
            } catch (err) {
                return Promise.reject(new Error(JSON.stringify(err)));
            }
        } else {
            return Promise.reject(new Error(`no connection open`));
        }

    }

    /**
     * Copy databases from public/assets/databases folder to application databases folder
     */
    async copyFromAssets(overwrite?: boolean): Promise<void> {
        const mOverwrite: boolean = overwrite != null ? overwrite : true;
        console.log(`&&&& mOverwrite ${mOverwrite}`);
        if (this.sqliteConnection != null) {
            try {
                return Promise.resolve(await this.sqliteConnection.copyFromAssets(mOverwrite));
            } catch (err) {
                return Promise.reject(new Error(JSON.stringify(err)));
            }
        } else {
            return Promise.reject(new Error(`no connection open`));
        }
    }

    /**
     * Initialize the Web store
     * @param database
     */
     async initWebStore(): Promise<void> {
        if(this.platform !== 'web')  {
            // return Promise.reject(new Error(`not implemented for this platform: ${this.platform}`));
            throw new Error(`not implemented for this platform: ${this.platform}`)
        }
        return new Promise<void>(async (resolve, reject) => {
            if(this.sqliteConnection != null) {
                try {
                    await this.sqliteConnection.initWebStore();
                    console.log("success init webstore")
                    resolve()
                } catch (err) {
                    console.log("fail init webstore")
                    reject(JSON.stringify(err));
                }
            } else {
                    console.log("fail init webstore")
                reject("no connection present");
            }
        })
    }
    /**
     * Save a database to store
     * @param database
     */
     async saveToStore(database:string): Promise<void> {
        if(this.platform !== 'web')  {
            return Promise.reject(new Error(`not implemented for this platform: ${this.platform}`));
        }
        if(this.sqliteConnection != null) {
            try {
                await this.sqliteConnection.saveToStore(database);
                return Promise.resolve();
            } catch (err) {
                return Promise.reject(new Error(JSON.stringify(err)));
            }
        } else {
            return Promise.reject(new Error(`no connection open for ${database}`));
        }
    }

    public runQuery(opt: capSQLiteQueryOptions) {
        console.log(`running ${JSON.stringify(opt)}`);
        this.sqlitePlugin.query(opt).then((val) => {
            console.log(`running ${JSON.stringify(val)}`);
        }).catch((err) => {
            throw new Error(err.message + "error when running query");
        })
        return this.sqlitePlugin.query(opt)
    }

    public createSyncTable(opt: capSQLiteOptions){
        try {
            this.sqlitePlugin.createSyncTable(opt)
        } catch (err) {
            throw ("error when creating sync table")
                // if (err instanceof Error) {
                //     throw err;
                // } else {
                //     throw new Error(JSON.stringify(err))
                // }
        }
    }

}
