
import React from 'react';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx';
import { useTranslation } from '@/contexts/TranslationContext.jsx';
import { motion } from 'framer-motion';

const EditableHemogramTable = ({ parameters, values, onValueChange, analysisType }) => {
  const { t } = useTranslation();

  const getTranslationKey = (paramId) => `${analysisType}Params.${paramId}`;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4">{t('editableValuesTitle', {type: t(analysisType)})}</h3>
      <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-750">
            <TableRow>
              <TableHead className="w-[30%] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">{t('parameter')}</TableHead>
              <TableHead className="w-[25%] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">{t('value')}</TableHead>
              <TableHead className="w-[20%] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">{t('unit')}</TableHead>
              <TableHead className="w-[25%] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">{t('referenceRange')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {parameters.map((param, index) => (
              <motion.tr 
                key={param.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-700/50"
              >
                <TableCell className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">
                  <Label htmlFor={param.id} className="cursor-pointer">{t(getTranslationKey(param.id), param.label)}</Label>
                </TableCell>
                <TableCell className="px-4 py-3">
                  <Input
                    id={param.id}
                    type="text"
                    value={values[param.id]?.value || ''}
                    onChange={(e) => onValueChange(param.id, 'value', e.target.value)}
                    className="h-9 text-sm bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-primary dark:focus:border-sky-500 focus:ring-primary dark:focus:ring-sky-500"
                    placeholder={t('enterValuePlaceholder')}
                  />
                </TableCell>
                <TableCell className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{values[param.id]?.unit || param.unit || 'N/A'}</TableCell>
                <TableCell className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                  {values[param.id]?.reference_range || (param.refMin && param.refMax ? `${param.refMin} - ${param.refMax}` : (param.reference_range || 'N/A'))}
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
};

export default EditableHemogramTable;
