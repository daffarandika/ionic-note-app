import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { AlertController, Platform } from '@ionic/angular';
import { BehaviorSubject, Observable, from, of, switchMap } from 'rxjs';
import { CapacitorSQLite, JsonSQLite, capSQLiteImportOptions, capSQLiteJson, capSQLiteOptions, capSQLiteQueryOptions, capSQLiteValues } from '@capacitor-community/sqlite';
import { Preferences } from '@capacitor/preferences';

const DB_SETUP_KEY = 'first_db_setup';
const DB_NAME_KEY = 'db_name';
@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private readonly URL: string = "assets/databases/database_schema.json";
  isDbReady = new BehaviorSubject(false);
  dbName = "";

  constructor(
    private httpClient: HttpClient,
    private platform: Platform,
    private alertController: AlertController,
  ) {
 }

  private getDbSchema(): Observable<JsonSQLite> {
    return this.httpClient.get<JsonSQLite>(this.URL);
  }

  async init(): Promise<void> {
    if (this.platform.is('android')) {
      try {
        const sqlite = CapacitorSQLite as any;
        await sqlite.requestPermissions();
        this.setupDB();
      } catch(err) {
        const alert = await this.alertController.create({
          header: "Error",
          message: "This application cannot run without database access",
          buttons: ["OK"]
        })
        await alert.present()
      }
    } else {
      this.setupDB();
    }
  }

  async setupDB() {
    // await Preferences.remove({key: DB_SETUP_KEY})
    try {
      // await CapacitorSQLite.setEncryptionSecret({passphrase: "f344a9bacf13e303c04e8cc2d352e3e39938a2545a2976ed7bcb03b044a9b9bb"})
      // console.log(">> set passphrase")
      const { value } = await Preferences.get({key: DB_SETUP_KEY})
      console.log(">> ran setup db");
      if (!value) {
        console.log(">> download db");
        this.downloadDatabase();
      } else {
        console.log(">> did not download db");
        CapacitorSQLite.getDatabaseList().then( async (res) => {
          const alert = await this.alertController.create({
            message: JSON.stringify(res.values)
          });
          await alert.present();
          console.log(JSON.stringify(res.values));
        })
        this.dbName = (await Preferences.get({key: DB_NAME_KEY})).value ?? "null";
        await CapacitorSQLite.open({database: this.dbName});
                                                                                                                                    
        this.isDbReady.next(true);
      }
    } catch (err) {
      console.log(">> error when downloading database")
      await Preferences.remove({key: DB_SETUP_KEY})
    }
  }

  downloadDatabase(update: boolean = false) {
    this.getDbSchema().subscribe(async (schema) => {
      console.log("schema: " + schema.database);
      try {
        const jsonstring = JSON.stringify(schema);
        const alert = await this.alertController.create({
          message: ">>> downloadDB" +  jsonstring
        })
        await alert.present()

        const isJsonValid = await CapacitorSQLite.isJsonValid({ jsonstring: jsonstring } as capSQLiteImportOptions);
        if (isJsonValid.result) {
          this.dbName = schema.database;
          console.log(`databasename: ${this.dbName}`);
          await Preferences.set({key: DB_NAME_KEY, value: this.dbName});
          await CapacitorSQLite.importFromJson({ jsonstring });
          await Preferences.set({key: DB_SETUP_KEY, value: "1"});

          if (update) {
            await CapacitorSQLite.setSyncDate({syncdate: new Date().getTime().toString(), database: schema.database, readonly: false})
            console.log(">> synced database")
          } else {
            await CapacitorSQLite.createConnection({database: schema.database, readonly: false})
            await CapacitorSQLite.open({database: schema.database});
            await CapacitorSQLite.createSyncTable({ database: schema.database,  readonly: false})
            console.log(" >> opened database")
          }
          this.isDbReady.next(true);
        } else {
          throw new Error(">> json is not valid")
        }
      } catch (err) {
        throw new Error((err as Error).message + ">>><><><><><><>< cannot parse json");
      }

    })
  }

  getNotes() {
  return this.isDbReady.pipe(
    switchMap(isReady => {
      if (!isReady) {
        return of({ values: [] });
      } else {
          return from(CapacitorSQLite.query({statement: "SELECT * FROM note;", database: "note-db", readonly: false, values: []}))
      }
    })
  )}

}
