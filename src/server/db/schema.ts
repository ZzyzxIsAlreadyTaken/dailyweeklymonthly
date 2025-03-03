// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  timestamp,
  varchar,
  text,
  date,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator(
  (name) => `todaythisweekthismonth_${name}`,
);

export const goals = createTable(
  "goal",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    type: varchar("type", { length: 20 }).notNull(), // 'daily', 'weekly', 'monthly'
    status: varchar("status", { length: 20 }).notNull().default("not-started"),
    date: date("date"), // For daily goals
    weekNumber: integer("week_number"), // For weekly goals
    year: integer("year"), // For weekly and monthly goals
    month: integer("month"), // For monthly goals
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (table) => ({
    titleIndex: index("title_idx").on(table.title),
    statusIndex: index("status_idx").on(table.status),
    typeIndex: index("type_idx").on(table.type),
    dateIndex: index("date_idx").on(table.date),
    weekYearIndex: index("week_year_idx").on(table.weekNumber, table.year),
    monthYearIndex: index("month_year_idx").on(table.month, table.year),
  }),
);
