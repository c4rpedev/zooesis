
    import React from 'react';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button.jsx';
    import { Input } from '@/components/ui/input.jsx';
    import { Textarea } from '@/components/ui/textarea.jsx';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
    import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card.jsx';
    import { PlusCircle, Save, Loader2 } from 'lucide-react';

    const PromptEditForm = ({
      editingPrompt,
      onCancelEdit,
      onSave,
      onInputChange,
      onSelectChange,
      isSaving,
      analysisTypes,
      languages,
      promptNames
    }) => {
      const { t } = useTranslation();

      return (
        <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Card className="mb-6 shadow-lg border-primary">
            <CardHeader>
              <CardTitle>{editingPrompt.id ? t('editPrompt') : t('createNewPrompt')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="analysis_type" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('analysisType')}</label>
                <Select name="analysis_type" value={editingPrompt.analysis_type} onValueChange={(value) => onSelectChange('analysis_type', value)} disabled={!!editingPrompt.id}>
                  <SelectTrigger><SelectValue placeholder={t('selectAnalysisType')} /></SelectTrigger>
                  <SelectContent>{analysisTypes.map(type => <SelectItem key={type} value={type}>{t(type) || type}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('language')}</label>
                <Select name="language" value={editingPrompt.language} onValueChange={(value) => onSelectChange('language', value)} disabled={!!editingPrompt.id}>
                  <SelectTrigger><SelectValue placeholder={t('selectLanguage')} /></SelectTrigger>
                  <SelectContent>{languages.map(lang => <SelectItem key={lang} value={lang}>{t(lang) || lang}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="prompt_name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('promptName')}</label>
                <Select name="prompt_name" value={editingPrompt.prompt_name} onValueChange={(value) => onSelectChange('prompt_name', value)} disabled={!!editingPrompt.id}>
                  <SelectTrigger><SelectValue placeholder={t('selectPromptName')} /></SelectTrigger>
                  <SelectContent>{promptNames.map(name => <SelectItem key={name} value={name}>{t(name) || name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="model_name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('modelName')}</label>
                <Input
                  id="model_name"
                  name="model_name"
                  type="text"
                  value={editingPrompt.model_name || ''}
                  onChange={onInputChange}
                  placeholder={t('modelNamePlaceholder') || "e.g., gemini-1.5-flash-latest"}
                  className="focus:ring-primary focus:border-primary dark:focus:ring-sky-500 dark:focus:border-sky-500"
                />
              </div>
              <div>
                <label htmlFor="prompt_text" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('promptText')}</label>
                <Textarea
                  id="prompt_text"
                  name="prompt_text"
                  value={editingPrompt.prompt_text}
                  onChange={onInputChange}
                  rows={10}
                  className="focus:ring-primary focus:border-primary dark:focus:ring-sky-500 dark:focus:border-sky-500"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onCancelEdit} disabled={isSaving}>{t('cancel')}</Button>
              <Button onClick={onSave} disabled={isSaving} className="bg-primary hover:bg-primary/90 text-white">
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (editingPrompt.id ? <Save className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />)}
                {editingPrompt.id ? t('saveChanges') : t('addPrompt')}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      );
    };

    export default PromptEditForm;
  