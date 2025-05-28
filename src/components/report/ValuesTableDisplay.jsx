
    import React from 'react';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';
    import { motion } from 'framer-motion';
    import ReportSection from '@/components/report/ReportSection.jsx';
    import { ListChecks } from 'lucide-react';

    const ValuesTableDisplay = ({ values, analysisType, parameters }) => {
      const { t } = useTranslation();

      if (!values || Object.keys(values).length === 0) {
        return (
          <ReportSection title={t('extractedValuesTitle', {type: t(analysisType)})} icon={<ListChecks />}>
            <p>{t('noValuesExtracted')}</p>
          </ReportSection>
        );
      }
      
      const displayParameters = Array.isArray(parameters) ? parameters : [];
      
      const valuesArray = displayParameters.map(param => {
        const paramData = values[param.id]; 
        let displayValue = 'N/A';
        let unit = param.unit || ''; 

        if (paramData !== undefined && paramData !== null) {
          if (typeof paramData === 'object') {
            displayValue = paramData.value !== undefined ? String(paramData.value) : 'N/A';
            if (paramData.unit !== undefined) { 
              unit = paramData.unit;
            }
          } else {
            displayValue = String(paramData);
          }
        }

        return {
          id: param.id,
          label: t(`${analysisType}Params.${param.id}`, param.label || param.id),
          value: displayValue,
          unit: unit,
          referenceRange: (param.refMin && param.refMax ? `${param.refMin} - ${param.refMax}` : param.reference_range) || 'N/A'
        };
      });


      return (
        <ReportSection title={t('extractedValuesTitle', {type: t(analysisType)})} icon={<ListChecks />}>
          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-600 shadow-sm print:shadow-none print:border-slate-400">
            <Table>
              <TableHeader className="bg-slate-100 dark:bg-slate-750 print:bg-slate-100">
                <TableRow>
                  <TableHead className="w-[40%] px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200 print:text-black">{t('parameter')}</TableHead>
                  <TableHead className="w-[20%] px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200 print:text-black">{t('value')}</TableHead>
                  <TableHead className="w-[15%] px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200 print:text-black">{t('unit')}</TableHead>
                  <TableHead className="w-[25%] px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200 print:text-black">{t('referenceRange')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-600 print:bg-white print:divide-slate-400">
                {valuesArray.map((item, index) => (
                  <motion.tr 
                    key={item.id || index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-700/50 print:hover:bg-transparent"
                  >
                    <TableCell className="px-3 py-2.5 font-medium text-slate-800 dark:text-slate-100 print:text-black">{item.label}</TableCell>
                    <TableCell className="px-3 py-2.5 text-sm text-slate-600 dark:text-slate-300 print:text-black">{item.value}</TableCell>
                    <TableCell className="px-3 py-2.5 text-sm text-slate-600 dark:text-slate-300 print:text-black">{item.unit}</TableCell>
                    <TableCell className="px-3 py-2.5 text-sm text-slate-600 dark:text-slate-300 print:text-black">{item.referenceRange}</TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </ReportSection>
      );
    };

    export default ValuesTableDisplay;
  