import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { supabase } from '@/lib/supabaseClient.jsx';


const useRecentAnalysis = () => {
  const [recentAnalysis, setRecentAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchRecentAnalysis = useCallback(async () => {
    if (!user) {
      setLoading(false);
      // setError(new Error("User not authenticated.")); // Optional: set an error or just return
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: supabaseError } = await supabase
        .from('analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('upload_date', { ascending: false })
        .limit(1);

      if (supabaseError) {
        throw supabaseError;
      }

      if (data && data.length > 0) {
        setRecentAnalysis(data[0]);
      } else {
        setRecentAnalysis(null); // No recent analysis found
      }
    } catch (err) {
      console.error('Error fetching recent analysis:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [user, supabase]); // Added supabase as a dependency for useCallback

  useEffect(() => {
    fetchRecentAnalysis();
  }, [user, fetchRecentAnalysis]); // user dependency is indirect via fetchRecentAnalysis

  return { recentAnalysis, loading, error, fetchRecentAnalysis };
};

export default useRecentAnalysis;
