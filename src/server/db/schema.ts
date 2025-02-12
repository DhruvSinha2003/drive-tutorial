import { int, singlestoreTable, text } from "drizzle-orm/singlestore-core";

export const users = singlestoreTable("users_table", {
  id: int("id", { mode: "int" }).primaryKey().autoincrement(),
  name: text("name"),
  age: int("age"),
});