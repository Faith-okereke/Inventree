/*
  Warnings:

  - The primary key for the `PasswordResetToken` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('pending', 'accepted', 'revoked', 'expired');

-- DropIndex
DROP INDEX "Order_businessId_idx";

-- AlterTable
ALTER TABLE "PasswordResetToken" DROP CONSTRAINT "PasswordResetToken_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "PasswordResetToken_id_seq";

-- CreateTable
CREATE TABLE "Invitation" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'staff',
    "status" "InvitationStatus" NOT NULL DEFAULT 'pending',
    "tokenHash" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "invitedById" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptedAt" TIMESTAMP(3),

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_tokenHash_key" ON "Invitation"("tokenHash");

-- CreateIndex
CREATE INDEX "Invitation_businessId_idx" ON "Invitation"("businessId");

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_email_businessId_status_key" ON "Invitation"("email", "businessId", "status");

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
