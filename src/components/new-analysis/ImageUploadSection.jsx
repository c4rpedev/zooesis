import React from 'react';
    import { Label } from '@/components/ui/label.jsx';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';
    import { motion } from 'framer-motion';

    const ImageUploadSection = ({ hemogramImage, setHemogramImage, imagePreview, setImagePreview, errors = {}, setErrors, itemVariants, uploadIcon, analysisType }) => {
      const { t } = useTranslation();

      const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const newErrors = { ...errors };
          let validFile = true;

          if (file.size > 10 * 1024 * 1024) {
            newErrors.imageFile = t('fileTooLargeError', { maxSize: '10MB' });
            validFile = false;
          }
          if (!['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'application/pdf'].includes(file.type)) {
            newErrors.imageFile = t('invalidFileTypeError');
            validFile = false;
          }

          if (!validFile) {
            setErrors(newErrors);
            setHemogramImage(null);
            setImagePreview(null);
            return;
          }

          delete newErrors.imageFile;
          setErrors(newErrors);

          setHemogramImage(file);
          const reader = new FileReader();
          reader.onloadend = () => {
            setImagePreview(reader.result);
          };
          reader.readAsDataURL(file);
        }
      };

      const titleKey = `${analysisType}UploadTitle`;
      const instructionKey = `${analysisType}UploadInstruction`;

      return (
        <motion.div variants={itemVariants} initial="hidden" animate="visible" className="space-y-4">
          <div className="flex items-center space-x-2 text-lg font-semibold text-primary">
            {React.cloneElement(uploadIcon, { className: "h-6 w-6" })}
            <span>{t(titleKey, t('uploadAnalysisImageTitle'))}</span>
          </div>
          <div>
            <Label htmlFor="analysisImage" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
              {t(instructionKey, t('uploadAnalysisImageInstruction'))} <span className="text-red-500 ml-1">*</span>
            </Label>
            <div
              className={`mt-1 flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 ${errors.imageFile ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} border-dashed rounded-md group hover:border-primary/70 transition-colors`}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleImageChange({ target: { files: e.dataTransfer.files } });
                }
              }}
            >
              {imagePreview ? (
                <div className="mb-4">
                  {hemogramImage.type === 'application/pdf' ? (
                    <iframe src={imagePreview} title={t('imagePreviewAlt', {type: t(analysisType)})} className="mx-auto h-96 w-full max-w-full rounded-md shadow-md" />
                  ) : (
                    <img src={imagePreview} alt={t('imagePreviewAlt', {type: t(analysisType)})} className="mx-auto h-48 w-auto max-w-full rounded-md object-contain shadow-md" />
                  )}
                </div>
              ) : (
                <div className="text-center mb-2">
                  {React.cloneElement(uploadIcon, { className: "mx-auto h-12 w-12 text-slate-400 group-hover:text-primary/80 transition-colors" })}
                </div>
              )}
              <div className="text-center">
                <div className="flex text-sm text-slate-600 dark:text-slate-400 justify-center">
                  <label
                    htmlFor="analysisImage"
                    className="relative cursor-pointer rounded-md bg-white dark:bg-slate-800 font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 dark:ring-offset-slate-900 px-1"
                  >
                    <span>{t('uploadFile')}</span>
                    <input id="analysisImage" name="analysisImage" type="file" className="sr-only" onChange={handleImageChange} accept="image/png, image/jpeg, image/gif, image/webp, application/pdf" />
                  </label>
                  <p className="pl-1 hidden sm:inline">{t('dragAndDrop')}</p>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t('fileTypes')}</p>
                {hemogramImage && !errors.imageFile && <p className="text-sm text-green-600 dark:text-green-400 mt-2">{t('selectedFileLabel')}{hemogramImage.name}</p>}
              </div>
            </div>
            {errors.imageFile && <p className="text-sm text-red-500 mt-1">{errors.imageFile}</p>}
          </div>
        </motion.div>
      );
    };
    export default ImageUploadSection;
