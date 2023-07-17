import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { AlertController, Platform } from '@ionic/angular';
import { BehaviorSubject, Observable, from, of, switchMap } from 'rxjs';
import { CapacitorSQLite, JsonSQLite, SQLiteConnection, SQLiteDBConnection, capSQLiteImportOptions, capSQLiteJson, capSQLiteOptions, capSQLiteQueryOptions, capSQLiteValues } from '@capacitor-community/sqlite';
import { Preferences } from '@capacitor/preferences';
import { Note } from '../data/note';

const DB_SETUP_KEY = 'first_db_setup';
const DB_NAME_KEY = 'db_name';
@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private readonly URL: string = "assets/databases/database_schema.json";
  private sqlite = CapacitorSQLite;
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
        this.sqlite.getDatabaseList().then(val => {
          console.error(`>> list of db ${JSON.stringify(val)}`);
        })
    }
  }

  async setupDB() {
    try {
      const { value } = await Preferences.get({key: DB_SETUP_KEY})
      console.log(">> ran setup db");
      if (!value) {
        console.log(">> download db");
        this.downloadDatabase();
      } else {
        console.log(">> did not download db");
        this.dbName = (await Preferences.get({key: DB_NAME_KEY})).value ?? "null";
        await this.sqlite.createConnection({database: this.dbName, readonly: false})
        await this.sqlite.open({database: this.dbName, readonly: false});
        this.isDbReady.next(true);
      }
    } catch (err) {
      console.log(`>> error when downloading database ${JSON.stringify(err)}`)
    }
  }

  downloadDatabase(update: boolean = false) {
    this.getDbSchema().subscribe(async (schema) => {
      console.log("schema: " + schema.database);
      try {
        const jsonstring = JSON.stringify(schema);
        const isJsonValid = await this.sqlite.isJsonValid({ jsonstring: jsonstring } as capSQLiteImportOptions);
        if (isJsonValid.result) {
          this.dbName = schema.database;
          console.log(`databasename: ${this.dbName}`);
          await Preferences.set({key: DB_NAME_KEY, value: this.dbName});
          await this.sqlite.importFromJson({ jsonstring });
          await Preferences.set({key: DB_SETUP_KEY, value: "1"});

          if (update) {
            console.log(">> synced database")
            await this.sqlite.setSyncDate({syncdate: new Date().getTime().toString(), database: this.dbName, readonly: false})
          } else {
            console.log(" >> opened database")
            await this.sqlite.createConnection(schema);
            await this.sqlite.open(schema);
            await this.sqlite.createSyncTable(schema);
          }

          this.isDbReady.next(true);
        } else {
          throw new Error(">> json is not valid")
        }
      } catch (err) {
        throw new Error((err as Error).message + ">> cannot parse json");
      }

    })
  }

  getNotes() {
    // await this.sqlite.open({database: this.dbName, readonly: true});
    return this.isDbReady.pipe(
      switchMap(isReady => {
        if (!isReady) {
          return of({ values: [] });
        } else {
          return from(this.sqlite.query({statement: "SELECT * FROM note where sql_deleted = 0", database: "note-db", readonly: false, values: []}))
        }
    })
  )}

  async addNote(title: string = "title", content: string = "content", color : string = "green") {
    const statement = `INSERT INTO note (title, content, color, timestamp, last_modified, sql_deleted) values ('${title}', '${content}', '${color}', ${Date.now()}, ${Date.now()}, ${0})`
    console.log(`>> insert ${statement}`);
    await this.sqlite.execute({database: this.dbName, statements: statement, readonly: false, transaction: true })
    return this.sqlite.query({statement: "SELECT * FROM note where sql_deleted = 0;", database: "note-db", readonly: false, values: []}).then((res) => {
      return res.values as Note[];
    })
  }
  async deleteNoteById(id: number) {
    const statement = `DELETE FROM note WHERE id = ${id}`
    return this.sqlite.execute({statements: statement, database: "note-db", readonly: false, transaction: true });
  }
  
  async getNoteById(id: number) {
    const statement = `SELECT * FROM note WHERE id = ${id}`;
    return (await this.sqlite.query({statement: statement, database: "note-db", readonly: false, values: [] })).values![0];
  }
  async editNote(note: Note) {
    const { title, content, color, id } = note;
    const statement = `UPDATE note SET title = '${title}', content = '${content}', color = '${color}' WHERE id = '${id}'`;
    return this.sqlite.execute({statements: statement, database: 'note-db', readonly: false, transaction: true});
  }

}
