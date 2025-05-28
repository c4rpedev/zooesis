
    import { useState, useEffect, useCallback } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { useToast } from '@/components/ui/use-toast.jsx';
    import { useAuth } from '@/contexts/AuthContext.jsx';
    import { supabase } from '@/lib/supabaseClient.jsx';

    const STORAGE_BUCKET_NAME = 'analysis-images';

    const useHistoryData = () => {
      const [analyses, setAnalyses] = useState([]);
      const [loading, setLoading] = useState(true);
      const [analysisToDelete, setAnalysisToDelete] = useState(null);
      const navigate = useNavigate();
      const { toast } = useToast();
      const { user } = useAuth();

      const fetchAnalyses = useCallback(async () => {
        if (!user) {
          setLoading(false);
          toast({ title: "Not Authenticated", description: "Please log in to view history.", variant: "destructive" });
          navigate('/login');
          return;
        }
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from('analyses')
            .select('*')
            .eq('user_id', user.id)
            .order('upload_date', { ascending: false });

          if (error) throw error;
          setAnalyses(data || []);
        } catch (error) {
          toast({
            title: "Error Fetching History",
            description: error.message,
            variant: "destructive",
          });
          setAnalyses([]);
        } finally {
          setLoading(false);
        }
      }, [user, toast, navigate]);

      useEffect(() => {
        fetchAnalyses();
      }, [fetchAnalyses]);

      const handleDeleteAnalysis = async () => {
        if (!analysisToDelete || !user) return;
        
        const analysisToRemove = analyses.find(a => a.id === analysisToDelete);

        try {
          if (analysisToRemove?.image_path) {
            const { error: storageError } = await supabase.storage
              .from(STORAGE_BUCKET_NAME)
              .remove([analysisToRemove.image_path]);
            if (storageError) {
              console.warn("Error deleting image from storage, proceeding with DB delete:", storageError.message);
            }
          }

          const { error: dbError } = await supabase
            .from('analyses')
            .delete()
            .eq('id', analysisToDelete)
            .eq('user_id', user.id);

          if (dbError) throw dbError;

          setAnalyses(prevAnalyses => prevAnalyses.filter(a => a.id !== analysisToDelete));
          setAnalysisToDelete(null); 
          toast({
            title: "Analysis Deleted",
            description: "The selected analysis has been successfully removed.",
          });

        } catch (error) {
           toast({
            title: "Error Deleting Analysis",
            description: error.message,
            variant: "destructive",
          });
        }
      };
      
      const confirmDeleteAnalysis = (analysisId) => {
        setAnalysisToDelete(analysisId);
      };

      const cancelDeleteAnalysis = () => {
        setAnalysisToDelete(null);
      };

      return {
        analyses,
        loading,
        analysisToDelete,
        confirmDeleteAnalysis,
        cancelDeleteAnalysis,
        handleDeleteAnalysis,
        fetchAnalyses, 
      };
    };

    export default useHistoryData;
  