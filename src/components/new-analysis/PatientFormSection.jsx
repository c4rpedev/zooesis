
    import React from 'react';
    import { Input } from '@/components/ui/input.jsx';
    import { Label } from '@/components/ui/label.jsx';
    import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.jsx';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
    import { PawPrint, Bone, Dog, Cat, Rabbit, Bird, Weight, Info } from 'lucide-react';
    import { motion } from 'framer-motion';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';

    const speciesOptions = [
      { value: "canine", labelKey: "canine", icon: <Dog className="mr-2 h-4 w-4" /> },
      { value: "feline", labelKey: "feline", icon: <Cat className="mr-2 h-4 w-4" /> },
      { value: "equine", labelKey: "equine", icon: <Bone className="mr-2 h-4 w-4" /> },
      { value: "bovine", labelKey: "bovine", icon: <Bone className="mr-2 h-4 w-4" /> },
      { value: "avian", labelKey: "avian", icon: <Bird className="mr-2 h-4 w-4" /> },
      { value: "lagomorph", labelKey: "lagomorph", icon: <Rabbit className="mr-2 h-4 w-4" /> },
      { value: "other", labelKey: "other", icon: <PawPrint className="mr-2 h-4 w-4" /> },
    ];

    const PatientFormSection = ({ 
      patientName, setPatientName,
      identifier, setIdentifier,
      sex, setSex,
      species, setSpecies,
      breed, setBreed,
      age, setAge,
      weight, setWeight,
      errors = {}, 
      itemVariants 
    }) => {
      const { t } = useTranslation();
      
      const translatedSpeciesOptions = speciesOptions.map(opt => ({
        ...opt,
        label: t(opt.labelKey) || opt.labelKey, 
      }));


      return (
        <motion.div variants={itemVariants} initial="hidden" animate="visible" className="space-y-6 border-b pb-6 border-dashed border-slate-300 dark:border-slate-600">
          <div className="flex items-center space-x-2 text-lg font-semibold text-primary">
            <Info className="h-6 w-6" />
            <span>{t('patientInfo')}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="patientName" className="flex items-center mb-1"><PawPrint className="mr-2 h-4 w-4 text-primary"/>{t('patientName')} <span className="text-red-500 ml-1">*</span></Label>
              <Input id="patientName" name="patientName" value={patientName || ''} onChange={(e) => setPatientName(e.target.value)} placeholder={t('patientNamePlaceholder')} className={errors.patientName ? 'border-red-500' : ''}/>
              {errors.patientName && <p className="text-sm text-red-500 mt-1">{errors.patientName}</p>}
            </div>
            <div>
              <Label htmlFor="identifier" className="flex items-center mb-1"><PawPrint className="mr-2 h-4 w-4 text-primary"/>{t('identifierOptional')}</Label>
              <Input id="identifier" name="identifier" value={identifier || ''} onChange={(e) => setIdentifier(e.target.value)} placeholder={t('identifierPlaceholder')}/>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="flex items-center mb-2"><PawPrint className="mr-2 h-4 w-4 text-primary"/>{t('sex')} <span className="text-red-500 ml-1">*</span></Label>
              <RadioGroup name="sex" onValueChange={(value) => setSex(value)} value={sex || ''} className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">{t('male')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">{t('female')}</Label>
                </div>
              </RadioGroup>
              {errors.sex && <p className="text-sm text-red-500 mt-1">{errors.sex}</p>}
            </div>
            <div>
              <Label htmlFor="species" className="flex items-center mb-1"><PawPrint className="mr-2 h-4 w-4 text-primary"/>{t('species')} <span className="text-red-500 ml-1">*</span></Label>
              <Select name="species" onValueChange={(value) => setSpecies(value)} value={species || ''}>
                <SelectTrigger id="species" className={errors.species ? 'border-red-500' : ''}>
                  <SelectValue placeholder={t('selectSpecies')} />
                </SelectTrigger>
                <SelectContent>
                  {translatedSpeciesOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <div className="flex items-center">{opt.icon} {opt.label}</div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.species && <p className="text-sm text-red-500 mt-1">{errors.species}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="breed" className="flex items-center mb-1"><PawPrint className="mr-2 h-4 w-4 text-primary"/>{t('breedOptional')}</Label>
              <Input id="breed" name="breed" value={breed || ''} onChange={(e) => setBreed(e.target.value)} placeholder={t('breedPlaceholder')}/>
            </div>
            <div>
              <Label htmlFor="age" className="flex items-center mb-1"><PawPrint className="mr-2 h-4 w-4 text-primary"/>{t('ageYears')} <span className="text-red-500 ml-1">*</span></Label>
              <Input id="age" name="age" type="number" step="0.1" value={age || ''} onChange={(e) => setAge(e.target.value)} placeholder={t('agePlaceholder')} className={errors.age ? 'border-red-500' : ''}/>
              {errors.age && <p className="text-sm text-red-500 mt-1">{errors.age}</p>}
            </div>
            <div>
              <Label htmlFor="weight" className="flex items-center mb-1"><Weight className="mr-2 h-4 w-4 text-primary"/>{t('weightKg')} <span className="text-red-500 ml-1">*</span></Label>
              <Input id="weight" name="weight" type="number" step="0.1" value={weight || ''} onChange={(e) => setWeight(e.target.value)} placeholder={t('weightPlaceholder')} className={errors.weight ? 'border-red-500' : ''}/>
              {errors.weight && <p className="text-sm text-red-500 mt-1">{errors.weight}</p>}
            </div>
          </div>
        </motion.div>
      );
    };

    export default PatientFormSection;
  