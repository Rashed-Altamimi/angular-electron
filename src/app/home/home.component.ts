/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from '../core/services';
import xlsx from 'node-xlsx';
import { DateTime } from 'mssql';
import { log } from 'console';
import { formatDate } from '@angular/common';
import { delay } from 'rxjs';
import { Stopwatch } from 'ts-stopwatch';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  x = 'test';
  constructor(
    private router: Router,
    private electronService: ElectronService
  ) {}

  ngOnInit(): void {
    console.log('HomeComponent INIT');
  }

  async test() {
    // this.x = this.electronService.fs.readFileSync(
    //   'C:\\Users\\f\\Desktop\\test.txt',
    //   'utf8'
    // );
    // const db = new this.electronService.sqlite3.Database('db.db');

    // db.serialize(() => {
    //   const stmt = db.prepare('INSERT INTO lorem VALUES (?)');
    //   for (let i = 0; i < 10; i++) {
    //     stmt.run('Ipsum ' + i);
    //   }
    //   stmt.finalize();

    //   db.each('SELECT rowid AS id, info FROM lorem', (err, row: any) => {
    //     console.log(row.id + ': ' + row.info);
    //   });
    // });

    // db.close();

    try {
      // make sure that any items are correctly URL encoded in the connection string
      await this.electronService.sql.connect(
        'Server=192.168.2.11;Database=HR;User Id=dev-user;Password=P@ssw0rd;TrustServerCertificate=true'
      );
      const result = await this.electronService.sql
        .query<User>`select * from users`;
      console.log(result.recordset);
    } catch (err) {
      console.log(err);

      // ... error checks
    }
  }
  async excel() {
    const excel = xlsx.parse(
      this.electronService.fs.readFileSync(`C:\\Users\\f\\Desktop\\m.xlsx`)
    );

    const keys: string[] = [];
    const values: string[][] = [];
    if (excel.length > 0)
      if (excel[0].data.length > 0)
        excel[0].data[0].forEach((element) => {
          keys.push(element as string);
        });
    console.log(keys);
    for (const sheet of excel) {
      for (let i = 1; i < sheet.data.length; i++) {
        values.push(sheet.data[i] as string[]);
      }
    }

    await this.insertintosql(values);
  }

  selectSql(values: string[][]) {
    const d = new Date().getTime() / 1000;
    console.log(Date());
    const db = new this.electronService.sqlite3.Database('db.db');

    db.serialize(() => {
      const stmt = db.prepare(`insert into offices values(?, ?)`);
      for (let i = 0; i < values.length; i++) {
        const v = values[i];
        stmt.run(v[0], v[1]);
        console.log(v[0]);
      }
    });
    db.close();
    const s = new Date().getTime() / 1000;

    console.log('timeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
    console.log(Date());

    console.log(s - d);
  }
  async insertintosql(values: string[][]) {
    // const d = new Date().getTime() / 1000;
    // console.log(Date());

    // console.log('dddddddddddddddddddddddddddddddddddd');
    console.log(values);

    const stopwatch = new Stopwatch();
    stopwatch.start();
    await this.electronService.sql.connect(
      'Server=192.168.1.2;Database=mutest;User Id=rtamimi;Password=rtamimi;TrustServerCertificate=true'
    );
    for (let i = 0; i < values.length; i++) {
      const v = values[i];
      await this.electronService.sql
        .query`insert into offices values(${v[0]}, ${v[1]})`;
    }
    console.log(stopwatch.getTime());

    // const s = new Date().getTime() / 1000;

    // console.log('timeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
    // console.log(Date());

    // console.log(s - d);

    // insertSql(statement: string) {
    //   const db = new this.electronService.sqlite3.Database('db.db');
    //   db.serialize(() => {
    //     const stmt = db.prepare(statement);
    //     stmt.run();
    //     stmt.finalize();
    //   });
    // }
  }
}
type User = {
  id: number;
  name: string;
};
//sqlite =
//mssql = 50 m
