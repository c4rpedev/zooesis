
    import React from 'react';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
    import { CheckCircle, AlertCircle, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';

    const ParameterRow = ({ parameter, value, unit, referenceRange, isNormal }) => {
      const { t } = useTranslation();
      let IconComponent = CheckCircle;
      let iconColor = "text-green-500";

      if (isNormal === false) {
        IconComponent = AlertCircle;
        iconColor = "text-red-500";
      } else if (isNormal === null) { 
        IconComponent = CheckCircle; 
        iconColor = "text-slate-400"; 
      }

      return (
        <TableRow className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
          <TableCell className="font-medium text-slate-700 dark:text-slate-200">{parameter}</TableCell>
          <TableCell className="text-slate-600 dark:text-slate-300">{value ?? t('notAvailable')}</TableCell>
          <TableCell className="text-slate-600 dark:text-slate-300">{unit || ''}</TableCell>
          <TableCell className="text-slate-600 dark:text-slate-300">{referenceRange || t('notAvailable')}</TableCell>
          <TableCell className="text-center">
            <IconComponent className={`h-5 w-5 inline-block ${iconColor}`} />
          </TableCell>
        </TableRow>
      );
    };

    const HemogramTableDisplay = ({ hemogramValues }) => {
      const { t } = useTranslation();

      const formattedValues = React.useMemo(() => {
        if (Array.isArray(hemogramValues)) {
          return hemogramValues;
        }
        if (typeof hemogramValues === 'object' && hemogramValues !== null) {
          return Object.entries(hemogramValues).map(([key, val]) => {
            const valueObj = typeof val === 'object' && val !== null ? val : { value: val };
            return {
              parameter: key,
              value: valueObj.value ?? String(val ?? ''), // Handle both object and direct value cases
              unit: valueObj.unit || '', // Assuming unit might be part of the object
              referenceRange: valueObj.referenceRange || '', // Assuming referenceRange might be part of the object
              isNormal: valueObj.isNormal ?? null, // Assuming isNormal might be part of the object
            };
          });
        }
        return [];
      }, [hemogramValues]);

      if (!formattedValues || formattedValues.length === 0) {
        return (
          <Card className="my-6 shadow-lg bg-white dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-primary dark:text-primary-dark">{t('hemogramValues')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-500 dark:text-slate-400">{t('noHemogramData')}</p>
            </CardContent>
          </Card>
        );
      }
      
      return (
        <Card className="my-6 shadow-lg bg-white dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-primary dark:text-sky-400">{t('hemogramValues')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-md border dark:border-slate-700">
              <Table>
                <TableHeader className="bg-slate-100 dark:bg-slate-700/50">
                  <TableRow>
                    <TableHead className="text-slate-700 dark:text-slate-200">{t('parameter')}</TableHead>
                    <TableHead className="text-slate-700 dark:text-slate-200">{t('value')}</TableHead>
                    <TableHead className="text-slate-700 dark:text-slate-200">{t('unit')}</TableHead>
                    <TableHead className="text-slate-700 dark:text-slate-200">{t('referenceRange')}</TableHead>
                    <TableHead className="text-center text-slate-700 dark:text-slate-200">{t('status')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formattedValues.map((item, index) => (
                    <ParameterRow
                      key={item.parameter || index}
                      parameter={item.parameter || t('unknownParameter')}
                      value={item.value}
                      unit={item.unit}
                      referenceRange={item.referenceRange}
                      isNormal={item.isNormal}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      );
    };

    export default HemogramTableDisplay;
  