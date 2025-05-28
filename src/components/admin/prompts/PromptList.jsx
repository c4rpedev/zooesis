
    import React from 'react';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';
    import { motion } from 'framer-motion';
    import PromptCard from './PromptCard.jsx';

    const PromptList = ({ prompts, loading, editingPrompt, expandedPrompts, onToggleExpand, onEdit, onDelete }) => {
      const { t } = useTranslation();

      const cardVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
      };

      if (prompts.length === 0 && !loading && !editingPrompt) {
        return (
          <p className="text-center text-muted-foreground py-8">{t('noPromptsFound')}</p>
        );
      }

      return (
        <div className="space-y-4">
          {prompts.map(prompt => (
            <motion.div key={prompt.id} layout variants={cardVariants} initial="initial" animate="animate" exit="exit">
              <PromptCard
                prompt={prompt}
                isExpanded={expandedPrompts[prompt.id]}
                onToggleExpand={() => onToggleExpand(prompt.id)}
                onEdit={() => onEdit(prompt)}
                onDelete={() => onDelete(prompt.id)}
              />
            </motion.div>
          ))}
        </div>
      );
    };

    export default PromptList;
  