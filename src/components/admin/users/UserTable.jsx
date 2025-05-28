
    import React from 'react';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx';
    import { Button } from '@/components/ui/button.jsx';
    import { Badge } from '@/components/ui/badge.jsx';
    import { Edit, Trash2, UserCheck, UserX, Loader2 } from 'lucide-react';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';

    const UserTable = ({ users, onEditUser, onDeleteUser, loading }) => {
      const { t } = useTranslation();

      return (
        <div className="overflow-x-auto bg-white dark:bg-slate-800 shadow-md rounded-lg border border-slate-200 dark:border-slate-700">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-750">
              <TableRow>
                <TableHead>{t('fullName')}</TableHead>
                <TableHead>{t('emailAddress')}</TableHead>
                <TableHead className="text-center">{t('adminStatus')}</TableHead>
                <TableHead>{t('subscriptionPlan')}</TableHead>
                <TableHead className="text-center">{t('analysesUsed')}</TableHead>
                <TableHead>{t('lastSignIn')}</TableHead>
                <TableHead>{t('registeredOn')}</TableHead>
                <TableHead className="text-right">{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-200 dark:divide-slate-700">
              {users.map((user) => (
                <TableRow key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/50">
                  <TableCell className="font-medium">{user.full_name || t('notSet')}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="text-center">
                    {user.is_admin ? 
                      <Badge variant="default" className="bg-green-500 hover:bg-green-600"><UserCheck className="mr-1 h-3.5 w-3.5"/> {t('admin')}</Badge> : 
                      <Badge variant="secondary"><UserX className="mr-1 h-3.5 w-3.5"/> {t('user')}</Badge>
                    }
                  </TableCell>
                  <TableCell>
                     <Badge variant={user.subscription_plan === 'premium' ? 'default' : (user.subscription_plan === 'basic' ? 'outline' : 'secondary')}
                            className={user.subscription_plan === 'premium' ? 'bg-primary hover:bg-primary/90' : ''}>
                       {t(user.subscription_plan || 'unknownPlan')}
                     </Badge>
                  </TableCell>
                  <TableCell className="text-center">{user.analyses_used}</TableCell>
                  <TableCell>{user.last_sign_in_at}</TableCell>
                  <TableCell>{user.created_at}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => onEditUser(user)}>
                      <Edit className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDeleteUser(user)} disabled={user.is_admin && users.filter(u=>u.is_admin).length <=1 }>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {loading && (
            <div className="flex justify-center items-center py-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
           )}
        </div>
      );
    };

    export default UserTable;
  