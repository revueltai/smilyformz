-- =============================================================================
-- FUNCTION: update_league_rankings (Cron Job)
-- =============================================================================

-- Function: update_league_rankings (Cron Job)
-- 
-- Parameters:
--   p_top_players_per_league INTEGER - Number of top players to rank per league (default: 100)
-- 
-- Returns: JSON - Object containing update statistics
-- 
-- Description:
--   This function updates the leagues_ranking table with the top players per league
--   based on their highest scores in game_sessions. It's designed to be run as a cron job.
-- 
--   The function:
--   1. Clears existing league rankings
--   2. Calculates top players per league based on highest scores
--   3. Inserts new ranking entries with proper positions
--   4. Excludes deleted accounts from rankings
-- 
-- Returns JSON structure:
--   {
--     "success": boolean,
--     "message": string,
--     "total_rankings_updated": integer,
--     "rankings_by_league": object,
--     "execution_time": string (ISO timestamp),
--     "error": string (only if success is false)
--   }
-- 
-- Examples:
--   -- Update rankings with top 100 players per league (default)
--   SELECT update_league_rankings(100);
--   
--   -- Update rankings with top 50 players per league
--   SELECT update_league_rankings(50);
-- 
-- Error Conditions:
--   - Database errors if update fails
CREATE OR REPLACE FUNCTION update_league_rankings(
  p_top_players_per_league INTEGER DEFAULT 100
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  league_record RECORD;
  total_rankings INTEGER := 0;
  league_stats JSON := '{}'::json;
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
    ORDER BY 
      CASE league_level 
        WHEN 'easy' THEN 1 
        WHEN 'medium' THEN 2 
        WHEN 'hard' THEN 3 
        WHEN 'legend' THEN 4 
      END
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
        highest_score,
        ROW_NUMBER() OVER (ORDER BY highest_score DESC) as position
      FROM top_players
    )
    INSERT INTO leagues_ranking (user_id, league_level, position, score)
    SELECT 
      user_id,
      league_record.league_level,
      position,
      highest_score::text
    FROM ranked_players;
    
    -- Get count for this league
    SELECT COUNT(*) INTO league_count
    FROM leagues_ranking 
    WHERE league_level = league_record.league_level;
    
    -- Update league_stats with the count for this league
    league_stats := league_stats || json_build_object(league_record.league_level, league_count);
    
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
$$; 

-- Grant execute permission to service_role for update_league_rankings (cron job)
GRANT EXECUTE ON FUNCTION update_league_rankings(INTEGER) TO service_role; 