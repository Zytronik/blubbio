-- AlterTable
ALTER TABLE "User" ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL DEFAULT 1500,
ADD COLUMN     "ratingDeviation" DOUBLE PRECISION NOT NULL DEFAULT 350,
ADD COLUMN     "volatility" DOUBLE PRECISION NOT NULL DEFAULT 0.06;
