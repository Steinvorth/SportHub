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

// Delete user
export const deleteAuthUser = async (userId) => {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error deleting user:', error);
    return null;
  }
};