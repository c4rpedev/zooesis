
    import React from 'react';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';
    import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card.jsx';
    import { Button } from '@/components/ui/button.jsx';
    import { Edit, Trash2, ChevronDown, ChevronUp, FileText, Brain, Cpu } from 'lucide-react';

    const PromptCard = ({ prompt, isExpanded, onToggleExpand, onEdit, onDelete }) => {
      const { t } = useTranslation();

      return (
        <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
          <CardHeader 
            className="flex flex-row justify-between items-center cursor-pointer p-4 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600"
            onClick={onToggleExpand}
          >
            <div className="flex flex-col sm:flex-row sm:items-center">
                <div className="flex items-center mb-2 sm:mb-0">
                    {prompt.prompt_name === 'ocr_extraction' ? 
                        <FileText className="h-5 w-5 mr-3 text-sky-600 dark:text-sky-400 flex-shrink-0" /> : 
                        <Brain className="h-5 w-5 mr-3 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                    }
                    <CardTitle className="text-lg font-medium text-slate-800 dark:text-slate-100">
                        {t(prompt.analysis_type) || prompt.analysis_type} - {t(prompt.prompt_name)} ({t(prompt.language) || prompt.language})
                    </CardTitle>
                </div>
                {prompt.model_name && (
                    <div className="flex items-center text-xs text-muted-foreground sm:ml-4">
                        <Cpu className="h-3 w-3 mr-1 text-amber-500"/>
                        <span>{prompt.model_name}</span>
                    </div>
                )}
            </div>
            <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onEdit(); }} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" title={t('editPrompt')}>
                    <Edit className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onDelete(); }} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300" title={t('deletePrompt')}>
                    <Trash2 className="h-5 w-5" />
                </Button>
                {isExpanded ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
            </div>
          </CardHeader>
          {isExpanded && (
            <CardContent className="p-4 border-t dark:border-slate-600">
              <pre className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 p-3 rounded-md">{prompt.prompt_text}</pre>
              <p className="text-xs text-muted-foreground mt-2">{t('lastUpdated')}: {new Date(prompt.updated_at).toLocaleString()}</p>
            </CardContent>
          )}
        </Card>
      );
    };

    export default PromptCard;
  