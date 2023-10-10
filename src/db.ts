import Database from "bun:sqlite";

export const initDb = () => {
  const db = new Database(":memory:");
  db.exec("PRAGMA journal_mode = WAL;"); // https://bun.sh/docs/api/sqlite#wal-mode
  const query = db.query(
    "create table state(id integer primary key autoincrement not null, json text);"
  );
  query.run();
  return db;
};

export const closeDb = (db: Database) => {
  db.close();
};

export const insertState = (db: Database, state: string) => {
  try {
    const query = db.query("insert into state(json) values($state);");
    query.run({
      $state: state,
    });
    return 200;
  } catch (error) {
    console.log(`Inserting ${state} failed with error ${error}`);
    return 500;
  }
};

type State = {
  id: number;
  json: string;
};

export const getState = (db: Database) => {
  const query = db.query("select * from state;");
  const result = query.get() as State;
  try {
    const json = JSON.parse(result.json);
    return json;
  } catch (error) {
    console.log(`Getting state failed with error ${error}`);
    return {};
  }
};
