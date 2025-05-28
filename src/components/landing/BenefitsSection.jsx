
    import React from 'react';
    import { motion } from 'framer-motion';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';
    import { Brain, Search, FileText, Languages, Users, CheckCircle } from 'lucide-react';

    const BenefitsSection = () => {
      const { t } = useTranslation();
      const benefits = [
        { icon: Brain, title: t('benefitsItem1Title'), description: t('benefitsItem1Description') },
        { icon: Search, title: t('benefitsItem2Title'), description: t('benefitsItem2Description') },
        { icon: FileText, title: t('benefitsItem3Title'), description: t('benefitsItem3Description') },
        { icon: Languages, title: t('benefitsItem4Title'), description: t('benefitsItem4Description') },
        { icon: Users, title: t('benefitsItem5Title'), description: t('benefitsItem5Description') },
        { icon: CheckCircle, title: t('benefitsItem6Title'), description: t('benefitsItem6Description') }
      ];
      return (
        <section className="py-16 md:py-24 bg-sky-50 dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-4">{t('benefitsTitle')} <span className="text-primary">{t('benefitsTitleHighlight')}</span></h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg flex items-start space-x-4 hover:shadow-primary/20 transition-shadow"
                >
                  <div className="flex-shrink-0 p-3 bg-primary/10 rounded-full">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">{feature.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      );
    };
    export default BenefitsSection;
  