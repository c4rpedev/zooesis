
    import React from 'react';
    import { Label } from '@/components/ui/label.jsx';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
    import { Stethoscope, TestTube2, Droplet } from 'lucide-react';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';
    import { motion } from 'framer-motion';

    const analysisTypes = [
      { value: 'hemogram', labelKey: 'hemogram', icon: Stethoscope, disabled: false },
      { value: 'biochemistry', labelKey: 'biochemistry', icon: TestTube2, disabled: true },
      { value: 'urinalysis', labelKey: 'urinalysis', icon: Droplet, disabled: true },
    ];

    const AnalysisTypeSelector = ({ selectedType, onTypeChange, error, itemVariants }) => {
      const { t } = useTranslation();

      return (
        <motion.div variants={itemVariants} initial="hidden" animate="visible" className="space-y-3">
          <Label htmlFor="analysisType" className="text-lg font-semibold text-primary dark:text-sky-400">
            {t('selectAnalysisType')}
          </Label>
          <Select value={selectedType} onValueChange={onTypeChange}>
            <SelectTrigger 
              id="analysisType" 
              className={`w-full h-12 text-base transition-all ${error ? 'border-red-500 ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:border-primary dark:focus:border-sky-500 focus:ring-primary dark:focus:ring-sky-500'}`}
            >
              <SelectValue placeholder={t('selectTypePlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              {analysisTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <SelectItem 
                    key={type.value} 
                    value={type.value} 
                    className="text-base py-3"
                    disabled={type.disabled}
                  >
                    <div className="flex items-center">
                      <Icon className={`mr-3 h-5 w-5 ${type.disabled ? 'text-slate-400 dark:text-slate-500' : 'text-primary'}`} />
                      {t(type.labelKey)}
                      {type.disabled && <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">({t('comingSoon')})</span>}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </motion.div>
      );
    };

    export default AnalysisTypeSelector;
  