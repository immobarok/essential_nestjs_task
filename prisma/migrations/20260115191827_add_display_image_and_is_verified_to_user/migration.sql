-- AlterTable
ALTER TABLE "User" ADD COLUMN     "displayImage" TEXT,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;
