import {Injectable, Inject} from '@angular/core';
import {Storage} from '@ionic/storage';
import { Platform } from 'ionic-angular';

// import { SQLite } from 'ionic-native'; 

import {tables} from './tables';
import {versions} from './versions';

import {SqlBatch} from '../../../beans/sqlBatch.bean';

const win: any = window;
const DB_NAME: string = '__ionicstorage';

@Injectable()
export class DBService{

    public db: any;
	public dbname: string = 'YourDBName.db';
    constructor( ) {
    }




	init(): Promise<any> {
		return new Promise(resolve => {
			if (typeof win.sqlitePlugin !== 'undefined') {
				this.db = win.sqlitePlugin.openDatabase({ name: this.dbname, location: 'default' });
				// console.log("--> running on device: ", this.db);
				resolve();
			} else {
				this.db = win.openDatabase(this.dbname, '1.0', 'Test DB', -1);
				// console.log("--> running in browser: ", this.db);
				resolve();
			};
		});
    }

    _db(){

    }

    tableCount = 0;


    initTables(){
        for(let i =0 ; i < tables.length; i++){
            let table = tables[i];
            let columns = [];

            // this.query("drop table "+table.name, []);

            for(let j = 0 ;j < table.columns.length; j++){
                let column = table.columns[j];
                columns.push(column.name + ' ' + column.type);
            }

            let query = 'CREATE TABLE IF NOT EXISTS ' + table.name + ' (' + columns.join(',') + ')';
            //console.log(query);

            this.query(query, []).then().then((d)=>{
                this.tableCount++;
                if(this.tableCount == tables.length)
                  this.runModifications();
            },(e)=>console.error(e));
        }
    }

    runModifications(){
        this.query("select version from schema_details",[]).then(
            (data) =>{
                let currentVersion;
                if(data.rows.length === 0){
                    currentVersion = 1;
                    this.query("insert into schema_details (version) values(?)",[1]).then((d)=>{},(e)=>console.error(e));
                }else
                   currentVersion = data.rows.item(0).version;

                for(let i =0 ; i < versions.length;i++){
                    if(versions[i].version <= currentVersion)continue;

                    for(let c = 0; c< versions[i].changes.length; c++){
                        this.query(versions[i].changes[c].sql, versions[i].changes[c].params).then((d)=>{
                            // this.query("update schema_details set version = ? ",[versions[i].version]);
                        },(e)=>console.error(e));
                    }
                }
                //in case we set the wrong version first
                setTimeout(() => {this.query("update schema_details set version = ? ",[versions[versions.length -1].version]);}, 2000);
                
            },
            (error) => {
                console.error(error);
            }
        );
    }

  query(q: string, params?: any): Promise<any> {
        if(q.trim().toLowerCase().startsWith("select"))
           return this.readQuery(q, params);
		return new Promise((resolve, reject) => {
			params = params || [];
			this.db.transaction((tx) => {
				tx.executeSql(q, params, (tx, res) => {
					resolve(res);
				}, (tx, err) => {
					reject(err);
				});
			});
		});
	}


    // query(query: string, params: any[] = []): Promise<any> {
    //     if(query.trim().toLowerCase().startsWith("select"))
    //        return this.readQuery(query, params);
    //     return new Promise((resolve, reject) => {
    //         try {


    //             this.db.transaction(
    //                 (tx) =>{
    //                     tx.executeSql(query, params,
    //                       (tx, res) => {
    //                           resolve({ tx: tx, res: res })
    //                       },
    //                       (tx, err) => {
    //                           console.log(err);
    //                           reject({ tx: tx, err: err });
    //                       }
    //                     )

    //                 }
    //             );
    //         } catch (err) {
    //             reject({ err: err });
    //         }
    //     });
    // }


    
    readQuery(q: string, params: any[] = []): Promise<any> {
		return new Promise((resolve, reject) => {
			params = params || [];
			this.db.readTransaction((tx) => {
				tx.executeSql(q, params, (tx, res) => {
					resolve(res);
				}, (tx, err) => {
					reject(err);
				});
			});
		});
    }

    closeDB() {
      this.db.close(function () {
        console.log("DB closed!");
      }, function (error) {
        console.log("Error closing DB:" + error.message);
      });
    }

    sqlBatch(sqlBatch : Array<SqlBatch>): Promise<any> {
        let batch = new Array();
        for(let i =0 ; i < sqlBatch.length; i++){
            batch[i] = new Array();
            batch[i][0] = sqlBatch[i].query;
            batch[i][1] = sqlBatch[i].params;
        }
        
        if (win.sqlitePlugin) {
		  return new Promise((resolve) => { this.db.sqlBatch(batch); resolve();});
        }else{
            for(let i =0 ; i < (batch.length - 1); i++){
                this.query(batch[i][0],batch[i][1]);
            }

            return this.query(batch[batch.length - 1][0],batch[batch.length - 1][1]);
        }
    }

    // openDB(){

    //    if (win.sqlitePlugin) {
    //         this.db = win.sqlitePlugin.openDatabase({
    //             name: DB_NAME,
    //             location: 2,
    //             createFromLocation: 0
    //         });

    //     } else {
    //         console.warn('Storage: SQLite plugin not installed, falling back to WebSQL. Make sure to install cordova-sqlite-storage in production!');

    //         this.db = win.openDatabase(DB_NAME, '1.0', 'database', 5 * 1024 * 1024);
    //     }
    // }

    restartDB(){
    //   if (win.sqlitePlugin) {
    //     this.closeDB();
    //     this.init();
    //   }
        //  if (win.sqlitePlugin){
        //     this.openDB();
        //  }else{
        //     this.openDB();
        //  }
        // if(this.db.close){
        //     console.log("Closing in if");
        //     this.db.close();
        //     this.openDB();
        // }


    }

    //query(query, params){
     //   return this.db.executeSql(query, params);
        //return this.storage.query(query, params);
   // }
}