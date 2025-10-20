-- CreateTable
CREATE TABLE "residents" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "unit_id" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'owner',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "residents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "residents_user_id_key" ON "residents"("user_id");

-- CreateIndex
CREATE INDEX "idx_residents_user" ON "residents"("user_id");

-- CreateIndex
CREATE INDEX "idx_residents_unit" ON "residents"("unit_id");

-- AddForeignKey
ALTER TABLE "residents" ADD CONSTRAINT "residents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "residents" ADD CONSTRAINT "residents_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DropForeignKey (remove a foreign key antiga)
ALTER TABLE "resident_visitors" DROP CONSTRAINT IF EXISTS "resident_visitors_resident_id_fkey";

-- AddForeignKey (adiciona nova foreign key apontando para residents)
ALTER TABLE "resident_visitors" ADD CONSTRAINT "resident_visitors_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "residents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

