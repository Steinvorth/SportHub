import { supabaseAdmin } from './supabase';

// Fetch all auth users
export const getAllUsers = async () => {
  try {
    const { data: users, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) throw error;
    return users.users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

// Suspend user
export const suspendUser = async (userId) => {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { ban_duration: '876000h' } // ~100 years
    );
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error suspending user:', error);
    return null;
  }
};

// Unsuspend user
export const unsuspendUser = async (userId) => {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { ban_duration: '0h' }
    );
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error unsuspending user:', error);
    return null;
  }
};

// Delete user and all related data
export const deleteAuthUser = async (userId) => {
  try {
    // First delete user data from database
    const { error: dbError } = await supabaseAdmin
      .from('Usuarios')
      .delete()
      .eq('User_Auth_Id', userId);

    if (dbError) throw dbError;

    // Then delete auth user
    const { data, error: authError } = await supabaseAdmin.auth.admin.deleteUser(
      userId
    );

    if (authError) throw authError;

    return { success: true, message: 'Cuenta eliminada exitosamente' };
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Error al eliminar la cuenta. Por favor intente nuevamente.');
  }
};