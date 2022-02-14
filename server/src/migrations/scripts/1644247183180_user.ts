/* eslint-disable @typescript-eslint/camelcase */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable("users", {
    id: { type: "text", primaryKey: true },
    position_x: { type: "integer" },
    position_y: { type: "integer" },
    connected: { type: "boolean" },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable("users");
}
