// ⚠️  TEMPLATE FILE - DO NOT MODIFY OR DELETE ⚠️
// Copy this file to create new repositories (e.g., user.repo.ts)

import { eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type * as dbSchema from '../db/schema';
import * as tokenSchema from '../db/schema';
import { log } from '../utils/index';

export const __entity__Repo = (db: NodePgDatabase<typeof dbSchema>) => ({
  create: (p: dbSchema.New__Entity__) =>
    db
      .insert(tokenSchema.__entityPlural__)
      .values(p)
      .returning()
      .then(r => r[0]),

  findById: (id: string) =>
    db.query.__entityPlural__.findFirst({
      where: eq(tokenSchema.__entityPlural__.id, id),
    }),

  findAll: () => db.select().from(tokenSchema.__entityPlural__),

  update: async (id: string, c: Partial<dbSchema.__Entity__>) => {
    log.info('Updating entity');
    const [updated] = await db
      .update(tokenSchema.__entityPlural__)
      .set(c)
      .where(eq(tokenSchema.__entityPlural__.id, id))
      .returning();
    return updated;
  },

  delete: (id: string) =>
    db
      .delete(tokenSchema.__entityPlural__)
      .where(eq(tokenSchema.__entityPlural__.id, id)),
});
