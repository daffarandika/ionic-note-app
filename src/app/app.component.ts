import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SQLiteService } from './services/sqlite.service';
import { CapacitorSQLite } from '@capacitor-community/sqlite';
import { DatabaseService } from './services/database.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public isWeb: boolean = true;
  private initPlugin: boolean = false;
  constructor(
    private platform: Platform,
    private databaseService: DatabaseService,
  ) {
    this.init();
    console.log("is web: " + this.isWeb)
  }
  init() {
    this.platform.ready().then(async () => {
        this.databaseService.init();
    })
  }
}
