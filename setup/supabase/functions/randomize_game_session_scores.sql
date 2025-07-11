-- =============================================================================
-- FUNCTION: randomize_game_session_scores
-- =============================================================================
-- Randomizes the scores in the game_sessions table for dummy players in each league.
-- Each league player gets a realistic score range based on its difficulty.
-- This script is used for testing purposes only, as it alters the scores of players.
-- 
-- Returns: JSON with the number of updated rows per league.
-- 
-- Example:
--   SELECT randomize_game_session_scores();
-- 
-- Returns:
--   {
--     "easy": 42,
--     "medium": 37,
--     "hard": 28,
--     "legend": 13
--   }
-- =============================================================================

-- Uncomment if running as standalone SQL script
CREATE OR REPLACE FUNCTION randomize_game_session_scores()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$

DECLARE
  updated_easy INTEGER := 0;
  updated_medium INTEGER := 0;
  updated_hard INTEGER := 0;
  updated_legend INTEGER := 0;
BEGIN
  -- Easy league: scores between 10 and 70
  UPDATE game_sessions
  SET score = FLOOR(RANDOM() * 61 + 10)::int
  WHERE league_level = 'easy';
  GET DIAGNOSTICS updated_easy = ROW_COUNT;

  -- Medium league: scores between 60 and 180
  UPDATE game_sessions
  SET score = FLOOR(RANDOM() * 121 + 60)::int
  WHERE league_level = 'medium';
  GET DIAGNOSTICS updated_medium = ROW_COUNT;

  -- Hard league: scores between 120 and 300
  UPDATE game_sessions
  SET score = FLOOR(RANDOM() * 181 + 120)::int
  WHERE league_level = 'hard';
  GET DIAGNOSTICS updated_hard = ROW_COUNT;

  -- Legend league: scores between 200 and 600
  UPDATE game_sessions
  SET score = FLOOR(RANDOM() * 401 + 200)::int
  WHERE league_level = 'legend';
  GET DIAGNOSTICS updated_legend = ROW_COUNT;

  -- Return update counts as JSON
  RETURN json_build_object(
    'easy', updated_easy,
    'medium', updated_medium,
    'hard', updated_hard,
    'legend', updated_legend
  );
END;

-- Uncomment if running as standalone SQL script
$$; 