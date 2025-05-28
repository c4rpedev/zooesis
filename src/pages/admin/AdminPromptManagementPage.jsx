
    import React from 'react';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';
    import { motion } from 'framer-motion';
    import { Loader2, Search } from 'lucide-react';
    import { Input } from '@/components/ui/input.jsx';
    import PromptHeader from '@/components/admin/prompts/PromptHeader.jsx';
    import PromptEditForm from '@/components/admin/prompts/PromptEditForm.jsx';
    import PromptList from '@/components/admin/prompts/PromptList.jsx';
    import usePromptManagement, { ANALYSIS_TYPES, LANGUAGES, PROMPT_NAMES } from '@/hooks/usePromptManagement.js';
    import AdminPageHeader from '@/components/admin/shared/AdminPageHeader.jsx';

    const AdminPromptManagementPage = () => {
      const { t } = useTranslation();
      const {
        prompts, 
        loading,
        editingPrompt,
        isSaving,
        searchTerm,
        setSearchTerm,
        expandedPrompts,
        handleEdit,
        handleCancelEdit,
        handleSaveExistingPrompt,
        handleCreateNewPrompt,
        handleAddNewPromptToDB,
        handleDelete,
        handleInputChange,
        handleSelectChange,
        toggleExpand,
        filteredPrompts
      } = usePromptManagement();

      const pageVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
      };

      if (loading && !editingPrompt && prompts.length === 0) {
        return (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        );
      }

      return (
        <motion.div 
          initial="initial"
          animate="animate"
          variants={pageVariants}
          className="space-y-6"
        >
          <AdminPageHeader title={t('promptManagementTitle')} description={t('promptManagementDescription')} />
          
          <PromptHeader onHandleCreateNewPrompt={handleCreateNewPrompt} />
          
          <div className="relative w-full max-w-md mb-6">
            <Input
              type="text"
              placeholder={t('searchPromptsPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>

          {editingPrompt && (
            <PromptEditForm
              editingPrompt={editingPrompt}
              onCancelEdit={handleCancelEdit}
              onSave={editingPrompt.id ? handleSaveExistingPrompt : handleAddNewPromptToDB}
              onInputChange={handleInputChange}
              onSelectChange={handleSelectChange}
              isSaving={isSaving}
              analysisTypes={ANALYSIS_TYPES}
              languages={LANGUAGES}
              promptNames={PROMPT_NAMES}
            />
          )}

          <PromptList
            prompts={filteredPrompts}
            loading={loading && prompts.length === 0}
            editingPrompt={editingPrompt}
            expandedPrompts={expandedPrompts}
            onToggleExpand={toggleExpand}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </motion.div>
      );
    };

    export default AdminPromptManagementPage;
  