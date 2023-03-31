-- CreateTable
CREATE TABLE "games" (
    "id" TEXT NOT NULL,
    "is_game_over" BOOLEAN NOT NULL DEFAULT false,
    "winner_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "players" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "pick" TEXT,
    "game_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
