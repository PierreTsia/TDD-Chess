export const SQL_COMMANDS = `
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);



CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  white_player_id UUID REFERENCES users(id),
  black_player_id UUID REFERENCES users(id),
  status TEXT NOT NULL,
  winner_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS Policies for the 'games' table

-- Allow users to create new games
CREATE POLICY games_insert
  ON games FOR INSERT
  WITH CHECK (auth.uid() = white_player_id OR auth.uid() = black_player_id);

-- Allow users to view games they are participating in
CREATE POLICY games_select
  ON games FOR SELECT
  USING (auth.uid() = white_player_id OR auth.uid() = black_player_id);

-- Allow users to update games they are participating in
CREATE POLICY games_update
  ON games FOR UPDATE
  USING (auth.uid() = white_player_id OR auth.uid() = black_player_id);

-- Prevent users from deleting games
CREATE POLICY games_delete
  ON games FOR DELETE
  USING (FALSE);

-- EnableRLS on the \`games\` table:
ALTER TABLE games FORCE ROW LEVEL SECURITY;


CREATE TABLE game_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES games(id),
  board JSONB NOT NULL,
  move_history JSONB NOT NULL,
  captured_pieces JSONB NOT NULL,
  current_player_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE POLICY game_states_insert
  ON game_states FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT white_player_id
      FROM games
      WHERE game_id = games.id
      UNION
      SELECT black_player_id
      FROM games
      WHERE game_id = games.id
    )
  );

CREATE POLICY game_states_select
  ON game_states FOR SELECT
  USING (
    auth.uid() IN (
      SELECT white_player_id
      FROM games
      WHERE game_id = games.id
      UNION SELECT black_player_id
      FROM games
      WHERE game_id = games.id
    )
  );

CREATE POLICY game_states_update
  ON game_states FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT white_player_id
      FROM games
      WHERE game_id = games.id
      UNION
      SELECT black_player_id
      FROM games
      WHERE game_id = games.id
    )
  );

CREATE POLICY game_states_delete
  ON game_states FOR DELETE
  USING (FALSE);

ALTER TABLE game_states FORCE ROW LEVEL SECURITY;

CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES games(id),
  user_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);



-- Allow users to send chat messages in games they are participating in
CREATE POLICY chat_messages_insert
  ON chat_messages FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT white_player_id
      FROM games
      WHERE game_id = games.id
      UNION
      SELECT black_player_id
      FROM games
      WHERE game_id = games.id
    )
  );

-- Allow users to view chat messages in games they are participating in
CREATE POLICY chat_messages_select
  ON chat_messages FOR SELECT
  USING (
    auth.uid() IN (
      SELECT white_player_id
      FROM games
      WHERE game_id = games.id
      UNION
      SELECT black_player_id
      FROM games
      WHERE game_id = games.id
    )
  );

-- Preventusers from updating chat messages
CREATE POLICY chat_messages_update
  ON chat_messages FOR UPDATE
  USING (FALSE);

-- Prevent users from deleting chat messages
CREATE POLICY chat_messages_delete
  ON chat_messages FOR DELETE
  USING (FALSE);

-- Enable RLS on the \`chat_messages\` table:

ALTER TABLE chat_messages FORCE ROW LEVEL SECURITY;

-- view for player statistics
DROP VIEW IF EXISTS player_statistics;

CREATE OR REPLACE VIEW player_statistics AS
SELECT
  player_id,
  COUNT(*) AS total_games,
  COUNT(*) FILTER (WHERE win) AS wins,
  COUNT(*) FILTER (WHERE NOT win AND winner_id IS NOT NULL) AS losses,
  COUNT(*) FILTER (WHERE win AND white_player) AS wins_as_white,
  COUNT(*) FILTER (WHERE win AND NOT white_player) AS wins_as_black
FROM
  (
    SELECT
      white_player_id AS player_id,
      winner_id = white_player_id AS win,
      true AS white_player,
      winner_id
    FROM
      games
    WHERE
      white_player_id IS NOT NULL
    UNION ALL
    SELECT
      black_player_id AS player_id,
      winner_id = black_player_id AS win,
      false AS white_player,
      winner_id
    FROM
      games
    WHERE
      black_player_id IS NOT NULL
  ) AS game_results
GROUP BY
  player_id;
`
