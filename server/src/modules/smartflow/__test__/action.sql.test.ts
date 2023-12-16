import test from "ava";
import SqlAction from "../node/actions/sql/Sql";
import db from "../../../db";

test("test SQL action", async (t) => {
  const sql = new SqlAction(
    { sql: "select * from node", isDml: false, params: [] },
    await db()
  );
  const result = await sql.invoke([]);
  t.assert(result.length > 0);
});

test("test SQL - DML ", async (t) => {
  t.pass();
});
