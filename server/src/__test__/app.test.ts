import test from "ava";
import { build } from "../../test/helper.ava";

test("get APP instance", async (t) => {
  const app = await build(t);
  t.assert(app, "app instance is not null");
});

test("test API /module/node - except 401 - unauthorized", async (t) => {
  const app = await build(t);
  const res = await app.inject({
    url: "/example",
  });

  app.close();
  t.is(res.statusCode, 401);
});

test("test API /module/node - except {status:ok} ", async (t) => {
  const app = await build(t);
  const res = await app.inject({
    url: "/status",
  });
  app.close();
  t.deepEqual(JSON.parse(res.body), { status: "ok" });
});
