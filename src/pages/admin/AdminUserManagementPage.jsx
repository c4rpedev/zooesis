
    import React, { useEffect, useState, useCallback } from 'react';
    import { supabase } from '@/lib/supabaseClient.jsx';
    import { useToast } from '@/components/ui/use-toast.jsx';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';
    import { motion } from 'framer-motion';
    import UserTable from '@/components/admin/users/UserTable.jsx';
    import UserEditDialog from '@/components/admin/users/UserEditDialog.jsx';
    import UserDeleteDialog from '@/components/admin/users/UserDeleteDialog.jsx';
    import { Loader2 } from 'lucide-react';
    import AdminPageHeader from '@/components/admin/shared/AdminPageHeader.jsx';
    import AdminSearchInput from '@/components/admin/shared/AdminSearchInput.jsx';

    const AdminUserManagementPage = () => {
      const [users, setUsers] = useState([]);
      const [loading, setLoading] = useState(true);
      const [searchTerm, setSearchTerm] = useState('');
      
      const [editingUser, setEditingUser] = useState(null); 
      const [showEditDialog, setShowEditDialog] = useState(false);

      const [userToDelete, setUserToDelete] = useState(null); 
      const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
      
      const [isSaving, setIsSaving] = useState(false); 

      const { toast } = useToast();
      const { t } = useTranslation();

      const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const { data: profilesData, error: profilesError } = await supabase
                .from('user_profiles')
                .select(`id, email, full_name, is_admin, subscription_plan, analysis_count, updated_at`); // Select only the necessary fields
    
            if (profilesError) throw profilesError;
    
            // No longer call fetchUserAuthDetails
            setUsers(profilesData); // Set the state with the data from user_profiles directly
    
        } catch (error) {
            toast({ title: t('errorFetchingUsers'), description: error.message, variant: 'destructive' });
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, [toast, t]); // Remove fetchUserAuthDetails from the dependency array
    

      useEffect(() => {
        fetchUsers();
      }, [fetchUsers]);

      const handleOpenEditDialog = (user) => {
        setEditingUser(user);
        setShowEditDialog(true);
      };

      const handleCloseEditDialog = () => {
        setEditingUser(null);
        setShowEditDialog(false);
      };

      const handleSaveUser = async (userId, editFormData) => {
        setIsSaving(true);
        try {
          const updates = {
            full_name: editFormData.full_name,
            is_admin: editFormData.is_admin,
            subscription_plan: editFormData.subscription_plan,
            analyses_used: parseInt(editFormData.analyses_used, 10) || 0,
            updated_at: new Date().toISOString()
          };

          const { error } = await supabase
            .from('user_profiles')
            .update(updates)
            .eq('id', userId);

          if (error) throw error;
          
          toast({ title: t('userUpdatedTitle'), description: t('userUpdatedSuccess') });
          handleCloseEditDialog();
          fetchUsers(); 
        } catch (error) {
          toast({ title: t('errorUpdatingUser'), description: error.message, variant: 'destructive' });
        } finally {
          setIsSaving(false);
        }
      };

      const handleOpenDeleteDialog = (user) => {
        setUserToDelete(user);
        setShowDeleteConfirm(true);
      };

      const handleCloseDeleteDialog = () => {
        setUserToDelete(null);
        setShowDeleteConfirm(false);
      };

      const handleDeleteUser = async () => {
        if (!userToDelete) return;
        setIsSaving(true);
        try {
          const { error: adminError } = await supabase.auth.admin.deleteUser(userToDelete.id);
          if (adminError) throw adminError;
          
          const { error: profileError } = await supabase
            .from('user_profiles')
            .delete()
            .eq('id', userToDelete.id);
          if (profileError) throw profileError;

          toast({ title: t('userDeletedTitle'), description: t('userDeletedSuccess', { email: userToDelete.email }) });
          fetchUsers(); 
        } catch (error) {
          console.error("Error deleting user:", error.message);
          toast({ title: t('errorDeletingUser'), description: error.message, variant: 'destructive' });
        } finally {
          setIsSaving(false);
          handleCloseDeleteDialog();
        }
      };

      const filteredUsers = users.filter(user =>
        (user.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (user.subscription_plan?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      );

      if (loading && users.length === 0) {
        return (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        );
      }

      return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
          <AdminPageHeader title={t('userManagement')} />
          
          <AdminSearchInput 
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            placeholder={t('searchUsersPlaceholder')}
          />

          <UserTable
            users={filteredUsers}
            onEditUser={handleOpenEditDialog}
            onDeleteUser={handleOpenDeleteDialog}
            loading={loading && users.length > 0}
          />
          
          {filteredUsers.length === 0 && !loading && (
            <p className="text-center text-muted-foreground py-8">{t('noUsersFound')}</p>
          )}

          {editingUser && (
            <UserEditDialog
              user={editingUser}
              isOpen={showEditDialog}
              onClose={handleCloseEditDialog}
              onSave={handleSaveUser}
              isSaving={isSaving}
            />
          )}

          {userToDelete && (
            <UserDeleteDialog
              user={userToDelete}
              isOpen={showDeleteConfirm}
              onClose={handleCloseDeleteDialog}
              onConfirmDelete={handleDeleteUser}
              isDeleting={isSaving}
            />
          )}

        </motion.div>
      );
    };

    export default AdminUserManagementPage;
  