import Database from "bun:sqlite";

export const initDb = () => {
  const db = new Database("spenn.sqlite", { create: true });
  // const db = new Database(":memory:");
  db.exec("PRAGMA journal_mode = WAL;"); // https://bun.sh/docs/api/sqlite#wal-mode
  const query = db.query(
    "create table if not exists spenn(user text primary key not null, state text);"
  );
  query.run();
  return db;
};

export const closeDb = (db: Database) => {
  db.close();
};

export const insertState = (db: Database, row: SpennRow) => {
  try {
    const query = db.query(
      "insert into spenn(user, state) values($user, $state) on conflict(user) do update set state=excluded.state;"
    );

    query.run({
      $user: row.user,
      $state: JSON.stringify(row.state),
    });
    return 200;
  } catch (error) {
    console.log(`Inserting ${row} failed with error ${error}`);
    return 500;
  }
};

type SpennRow = {
  id: number;
  user: string;
  state: string;
};

export const getState = (db: Database, user: string) => {
  const query = db.query("select state from spenn where user = $user;");
  const result = query.get({
    $user: user,
  }) as SpennRow;

  return JSON.parse(result.state);
};
