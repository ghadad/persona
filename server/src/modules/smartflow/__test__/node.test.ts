import test from "ava";
import { build } from "../../../../test/helper.ava";

test("test API /example ", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/example",
  });

  t.is(res.statusCode, 401);

  const res2 = await app.inject({
    url: "/status",
  });
  t.deepEqual(JSON.parse(res2.body), { status: "ok" });
});
