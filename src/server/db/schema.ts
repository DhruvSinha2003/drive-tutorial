import { index, int, singlestoreTable, text } from "drizzle-orm/singlestore-core";

export const files = singlestoreTable("files_table", {
  id: int("id").primaryKey().autoIncrement(),
  name: text("name"),
  url: text("url"),
  parent: int("parent"),
  size: int("size"),
},(t) => {
  return [
    index("parent_index").on(t.parent)
  ]
});