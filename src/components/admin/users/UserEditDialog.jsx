
    import React, { useState, useEffect } from 'react';
    import {
      Dialog,
      DialogContent,
      DialogHeader,
      DialogTitle,
      DialogDescription,
      DialogFooter,
      DialogClose,
    } from '@/components/ui/dialog.jsx';
    import { Button } from '@/components/ui/button.jsx';
    import { Input } from '@/components/ui/input.jsx';
    import { Label } from '@/components/ui/label.jsx';
    import { Checkbox } from '@/components/ui/checkbox.jsx';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
    import { Loader2 } from 'lucide-react';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';

    const UserEditDialog = ({ user, isOpen, onClose, onSave, isSaving }) => {
      const { t } = useTranslation();
      const [formData, setFormData] = useState({});

      useEffect(() => {
        if (user) {
          setFormData({
            full_name: user.full_name || '',
            is_admin: user.is_admin || false,
            subscription_plan: user.subscription_plan || 'free',
            analyses_used: user.analyses_used || 0,
          });
        }
      }, [user]);

      if (!user) return null;

      const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
          ...prev,
          [name]: type === 'checkbox' ? checked : value,
        }));
      };

      const handleSelectChange = (name, value) => {
         setFormData(prev => ({ ...prev, [name]: value }));
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        onSave(user.id, formData);
      };

      return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{t('editUserTitle', { email: user.email })}</DialogTitle>
              <DialogDescription>{t('editUserDescription')}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="full_name" className="text-right">{t('fullName')}</Label>
                  <Input id="full_name" name="full_name" value={formData.full_name} onChange={handleInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="analyses_used" className="text-right">{t('analysesUsed')}</Label>
                  <Input id="analyses_used" name="analyses_used" type="number" value={formData.analyses_used} onChange={handleInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="subscription_plan" className="text-right">{t('subscriptionPlan')}</Label>
                   <Select name="subscription_plan" value={formData.subscription_plan} onValueChange={(value) => handleSelectChange('subscription_plan', value)}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder={t('selectPlan')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">{t('freePlan')}</SelectItem>
                        <SelectItem value="basic">{t('basicPlan')}</SelectItem>
                        <SelectItem value="premium">{t('premiumPlan')}</SelectItem>
                      </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="is_admin" className="text-right">{t('adminStatus')}</Label>
                  <Checkbox id="is_admin" name="is_admin" checked={formData.is_admin} onCheckedChange={(checked) => handleSelectChange('is_admin', checked)} className="col-span-3 justify-self-start" />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline" onClick={onClose}>{t('cancel')}</Button>
                </DialogClose>
                <Button type="submit" disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t('saveChanges')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      );
    };

    export default UserEditDialog;
  