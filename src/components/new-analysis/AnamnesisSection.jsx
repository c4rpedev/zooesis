
    import React from 'react';
    import { Label } from '@/components/ui/label.jsx';
    import { Textarea } from '@/components/ui/textarea.jsx';
    import { FileText } from 'lucide-react';
    import { motion } from 'framer-motion';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';

    const AnamnesisSection = ({ anamnesis, setAnamnesis, errors = {}, setErrors, itemVariants }) => {
      const { t } = useTranslation();

      const handleChange = (e) => {
        const { name, value } = e.target;
        setAnamnesis(value);
        if (errors[name]) {
          setErrors(prev => ({...prev, [name]: null}));
        }
      };

      return (
        <motion.div variants={itemVariants} initial="hidden" animate="visible" className="space-y-4 border-b pb-6 border-dashed border-slate-300 dark:border-slate-600">
            <div className="flex items-center space-x-2 text-lg font-semibold text-primary">
                <FileText className="h-6 w-6" />
                <span>{t('anamnesisTitle')}</span>
            </div>
            <div>
                <Label htmlFor="anamnesis" className="flex items-center mb-1">{t('anamnesisLabel')} <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">({t('optional')})</span></Label>
                <Textarea 
                  id="anamnesis" 
                  name="anamnesis" 
                  value={anamnesis || ''} 
                  onChange={handleChange} 
                  rows={5} 
                  placeholder={t('anamnesisPlaceholder')} 
                  className={errors.anamnesis ? 'border-red-500' : ''}
                />
                {errors.anamnesis && <p className="text-sm text-red-500 mt-1">{errors.anamnesis}</p>}
            </div>
        </motion.div>
      );
    };

    export default AnamnesisSection;
  