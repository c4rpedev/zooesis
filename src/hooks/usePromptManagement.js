
    import { useState, useEffect, useCallback } from 'react';
    import { supabase } from '@/lib/supabaseClient.jsx';
    import { useToast } from '@/components/ui/use-toast.jsx';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';

    export const ANALYSIS_TYPES = ['hemogram', 'biochemistry', 'urinalysis'];
    export const LANGUAGES = ['en', 'es', 'pt'];
    export const PROMPT_NAMES = ['ocr_extraction', 'clinical_interpretation'];

    const usePromptManagement = () => {
      const { t } = useTranslation();
      const { toast } = useToast();
      const [prompts, setPrompts] = useState([]);
      const [loading, setLoading] = useState(true);
      const [editingPrompt, setEditingPrompt] = useState(null);
      const [isSaving, setIsSaving] = useState(false);
      const [searchTerm, setSearchTerm] = useState('');
      const [expandedPrompts, setExpandedPrompts] = useState({});

      const fetchPrompts = useCallback(async () => {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from('analysis_prompts')
            .select('*')
            .order('analysis_type', { ascending: true })
            .order('prompt_name', { ascending: true })
            .order('language', { ascending: true });

          if (error) throw error;
          setPrompts(data || []);
        } catch (error) {
          toast({ title: t('errorFetchingPrompts'), description: error.message, variant: 'destructive' });
          setPrompts([]);
        } finally {
          setLoading(false);
        }
      }, [toast, t]);

      useEffect(() => {
        fetchPrompts();
      }, [fetchPrompts]);

      const handleEdit = (prompt) => {
        setEditingPrompt({ ...prompt });
      };

      const handleCancelEdit = () => {
        setEditingPrompt(null);
      };

      const handleSaveExistingPrompt = async () => {
        if (!editingPrompt || !editingPrompt.id) return;
        setIsSaving(true);
        try {
          const { id, created_at, ...updateData } = editingPrompt;
          
          const dataToUpdate = {
            prompt_text: updateData.prompt_text,
            model_name: updateData.model_name,
            updated_at: new Date().toISOString()
          };

          const { error } = await supabase
            .from('analysis_prompts')
            .update(dataToUpdate)
            .eq('id', id);

          if (error) throw error;
          toast({ title: t('promptSavedSuccessTitle'), description: t('promptSavedSuccessMessage') });
          setEditingPrompt(null);
          fetchPrompts();
        } catch (error) {
          toast({ title: t('errorSavingPrompt'), description: error.message, variant: 'destructive' });
        } finally {
          setIsSaving(false);
        }
      };
      
      const handleCreateNewPrompt = () => {
        setEditingPrompt({
          analysis_type: ANALYSIS_TYPES[0],
          language: LANGUAGES[0],
          prompt_name: PROMPT_NAMES[0],
          model_name: 'gemini-1.5-flash-latest',
          prompt_text: '',
        });
      };
      
      const handleAddNewPromptToDB = async () => {
        if (!editingPrompt || !editingPrompt.analysis_type || !editingPrompt.language || !editingPrompt.prompt_name || !editingPrompt.prompt_text || !editingPrompt.model_name) {
            toast({ title: t('errorMissingFields'), description: t('errorAllFieldsRequiredForNewPrompt'), variant: 'destructive'});
            return;
        }
        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('analysis_prompts')
                .insert([{ 
                    analysis_type: editingPrompt.analysis_type,
                    language: editingPrompt.language,
                    prompt_name: editingPrompt.prompt_name,
                    prompt_text: editingPrompt.prompt_text,
                    model_name: editingPrompt.model_name,
                    updated_at: new Date().toISOString()
                }])
                .select();

            if (error) throw error;
            toast({ title: t('promptCreatedSuccessTitle'), description: t('promptCreatedSuccessMessage')});
            setEditingPrompt(null);
            fetchPrompts();
        } catch (error) {
            toast({ title: t('errorCreatingPrompt'), description: error.message, variant: 'destructive' });
        } finally {
            setIsSaving(false);
        }
      };

      const handleDelete = async (promptId) => {
        if (!window.confirm(t('areYouSureDeletePrompt'))) return;
        setIsSaving(true); 
        try {
            const { error } = await supabase
                .from('analysis_prompts')
                .delete()
                .eq('id', promptId);
            if (error) throw error;
            toast({ title: t('promptDeletedSuccessTitle'), description: t('promptDeletedSuccessMessage') });
            if (editingPrompt && editingPrompt.id === promptId) {
              setEditingPrompt(null);
            }
            fetchPrompts();
        } catch (error) {
            toast({ title: t('errorDeletingPrompt'), description: error.message, variant: 'destructive' });
        } finally {
            setIsSaving(false);
        }
      };

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditingPrompt(prev => ({ ...prev, [name]: value }));
      };
      
      const handleSelectChange = (name, value) => {
        setEditingPrompt(prev => ({...prev, [name]: value}));
      };

      const toggleExpand = (id) => {
        setExpandedPrompts(prev => ({ ...prev, [id]: !prev[id] }));
      };
      
      const filteredPrompts = prompts.filter(prompt => 
        prompt.analysis_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.language.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.prompt_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (prompt.prompt_text && prompt.prompt_text.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (prompt.model_name && prompt.model_name.toLowerCase().includes(searchTerm.toLowerCase()))
      );

      return {
        prompts,
        loading,
        editingPrompt,
        isSaving,
        searchTerm,
        setSearchTerm,
        expandedPrompts,
        fetchPrompts,
        handleEdit,
        handleCancelEdit,
        handleSaveExistingPrompt,
        handleCreateNewPrompt,
        handleAddNewPromptToDB,
        handleDelete,
        handleInputChange,
        handleSelectChange,
        toggleExpand,
        filteredPrompts,
        ANALYSIS_TYPES,
        LANGUAGES,
        PROMPT_NAMES
      };
    };

    export default usePromptManagement;
  