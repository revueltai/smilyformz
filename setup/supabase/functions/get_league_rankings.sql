-- =============================================================================
-- FUNCTION: get_league_rankings
-- =============================================================================

-- Function: get_league_rankings
-- 
-- Parameters:
--   p_league_level TEXT - The league level to fetch rankings for ('easy', 'medium', 'hard', 'legend')
--   p_limit INTEGER - Maximum number of records to fetch (default: 100)
-- 
-- Returns: TABLE with ranking data including user information
-- 
-- Description:
--   This function fetches league rankings with user display names and countries
--   in a single query by joining leagues_ranking with auth.users table.
--   Results are ordered by score (descending) within each league group.
-- 
-- Returns table structure:
--   username: TEXT - Player's display name
--   score: TEXT - Player's score
--   country: TEXT - Player's country code
--   league: TEXT - League level
-- 
-- Examples:
--   -- Get top 100 players in easy league
--   SELECT * FROM get_league_rankings('easy', 100);
--   
--   -- Get top 50 players in legend league
--   SELECT * FROM get_league_rankings('legend', 50);
-- 
-- Error Conditions:
--   - Returns empty result if league doesn't exist or no data found
--   - Handles missing user data gracefully

CREATE OR REPLACE FUNCTION get_league_rankings(
  p_league_level TEXT,
  p_limit INTEGER DEFAULT 100
)
RETURNS TABLE (
  username TEXT,
  score TEXT,
  country TEXT,
  league TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(u.raw_user_meta_data->>'display_name', 'Unknown Player')::TEXT as username,
    COALESCE(lr.score, '0')::TEXT as score,
    COALESCE(u.raw_user_meta_data->>'country', 'unknown')::TEXT as country,
    lr.league_level::TEXT as league
  FROM leagues_ranking lr
  LEFT JOIN auth.users u ON lr.user_id = u.id
  WHERE lr.league_level = p_league_level
    AND (u.raw_user_meta_data->>'account_deleted' IS NULL OR u.raw_user_meta_data->>'account_deleted' != 'true')
  ORDER BY CAST(lr.score AS INTEGER) DESC
  LIMIT p_limit;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_league_rankings(TEXT, INTEGER) TO authenticated;

-- Grant execute permission to anon users (if you want public access)
GRANT EXECUTE ON FUNCTION get_league_rankings(TEXT, INTEGER) TO anon; 