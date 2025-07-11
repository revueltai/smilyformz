-- =============================================================================
-- FUNCTION: update_league_rankings
-- =============================================================================

-- Update league rankings for all leagues
-- 
-- Parameters:
--   p_top_players_per_league INTEGER - The number of top players per league to update
-- 
-- Returns: JSON - Object containing success status, message, and rankings details
-- 
-- Description:
--   This function updates the league rankings for all leagues.
--   It first clears the existing rankings, then inserts the top players for each league,
--   and finally updates the league_stats with the count for each league.
-- 
-- Returns JSON structure:
--   {
--     "success": boolean,
--     "message": string,
--     "total_rankings_updated": integer,
--     "rankings_by_league": JSONB,
--     "top_players_per_league": integer,
--     "execution_time": string (ISO timestamp) 
--   }
-- 
-- Example:
--   SELECT update_league_rankings(100);
-- 
-- Returns:   
--   {
--     "success": true,
--     "message": "League rankings updated successfully",
--     "total_rankings_updated": 100,
--     "rankings_by_league": {
--       "easy": 100, 
--       "medium": 100,
--       "hard": 100,
--       "legend": 100
--     },
--     "top_players_per_league": 100,
--     "execution_time": "2025-01-01T00:00:00Z" 
--   }
-- 
-- Error Conditions:
--   - "User not found" if the user_id doesn't exist
--   - Database errors if insertion fails
--   - "Invalid league level" if the league_level is not valid
--   - "Invalid top_players_per_league" if the value is not an integer

-- Uncomment if running as standalone SQL script
-- CREATE OR REPLACE FUNCTION update_league_rankings(
--   p_top_players_per_league INTEGER DEFAULT 100
-- )
-- RETURNS JSON
-- LANGUAGE plpgsql
-- SECURITY DEFINER
-- AS $$

DECLARE
  league_record RECORD;
  total_rankings INTEGER := 0;
  league_stats JSONB := '{}'::jsonb;
  league_count INTEGER;
  result JSON;
BEGIN
  -- Clear existing league rankings
  DELETE FROM leagues_ranking;
  
  -- Update rankings for each league level
  FOR league_record IN 
    SELECT DISTINCT league_level 
    FROM game_sessions 
    WHERE league_level IS NOT NULL 
    AND league_level IN ('easy', 'medium', 'hard', 'legend')
  LOOP
    -- Insert top players for this league
    WITH top_players AS (
      SELECT 
        gs.user_id,
        u.raw_user_meta_data->>'display_name' as username,
        u.raw_user_meta_data->>'country' as country,
        MAX(CAST(gs.score AS INTEGER)) as highest_score
      FROM game_sessions gs
      JOIN auth.users u ON gs.user_id = u.id
      WHERE gs.league_level = league_record.league_level
        AND u.raw_user_meta_data->>'account_deleted' IS NULL
        AND gs.user_id IS NOT NULL
      GROUP BY gs.user_id, u.raw_user_meta_data
      ORDER BY highest_score DESC
      LIMIT p_top_players_per_league
    ),
    ranked_players AS (
      SELECT 
        user_id,
        username,
        country,
        highest_score
      FROM top_players
    )
    INSERT INTO leagues_ranking (user_id, league_level, score)
    SELECT 
      user_id,
      league_record.league_level,
      highest_score
    FROM ranked_players;
    
    -- Get count for this league
    SELECT COUNT(*) INTO league_count
    FROM leagues_ranking 
    WHERE league_level = league_record.league_level;
    
    -- Update league_stats with the count for this league
    league_stats := league_stats || jsonb_build_object(league_record.league_level, league_count);
    
    total_rankings := total_rankings + league_count;
  END LOOP;
  
  -- Return success result
  result := json_build_object(
    'success', true,
    'message', 'League rankings updated successfully',
    'total_rankings_updated', total_rankings,
    'rankings_by_league', league_stats,
    'top_players_per_league', p_top_players_per_league,
    'execution_time', now()::text
  );
  
  RETURN result;
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM,
      'total_rankings_updated', total_rankings,
      'execution_time', now()::text
    );
END; 

-- Uncomment if running as standalone SQL script
--$$;