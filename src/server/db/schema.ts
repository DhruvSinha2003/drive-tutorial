import "server-only";

import { bigint, index, int, singlestoreTable, singlestoreTableCreator, text } from "drizzle-orm/singlestore-core";

export const createTable = singlestoreTableCreator((name)=> `drive-tutorial_${name}`);

export const folders = createTable("folders_table", { 
  id: bigint("id", {mode:"number", unsigned: true}).primaryKey().autoincrement(),
  name: text("name").notNull(),
  // Root folder will reference its own ID
  parent: bigint("parent", {mode: "number", unsigned: true}).notNull(),
}, (t) => ({
  parentIndex: index("parent_index").on(t.parent),
}));

export const files = createTable("files_table", {
  id: bigint("id", {mode:"number", unsigned: true}).primaryKey().autoincrement(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  parent: bigint("parent", {mode: "number", unsigned: true}).notNull(),
  size: int("size").notNull(),
}, (t) => ({
  parentIndex: index("parent_index").on(t.parent),
}));