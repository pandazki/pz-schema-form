import { parse } from "./parser";

import { defaultDetect } from "./detect";
test("simple detect", () => {
  const data = {};
  let parsed = parse(data, [], defaultDetect);
  console.log(JSON.stringify(parsed, null, 2));
  expect(parsed.schema.$schema).toBe("http://json-schema.org/draft-06/schema#");
});
