export const up = async ({ context: { query } }) => {
    await query(`
    CREATE TABLE IF NOT EXISTS texts (
      pk SERIAL PRIMARY KEY,
      id CHAR(20) NOT NULL,
      title VARCHAR(500) NOT NULL,
      description VARCHAR(4000) NULL,
      text VARCHAR(4000) NOT NULL,
      "allowShowingFirstLetters" BOOLEAN NOT NULL,
      "allowShowingText" BOOLEAN NOT NULL,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
    await query(`CREATE UNIQUE INDEX id_idx ON texts (id)`);
};
export const down = async () => {
    // No down migration
};
//# sourceMappingURL=2022-03-23-initial.js.map