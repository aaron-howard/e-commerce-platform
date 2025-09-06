import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Phone, MapPin, Lock, Save } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile, changePassword, isLoading } = useAuthStore();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      address: user?.address || '',
      city: user?.city || '',
      state: user?.state || '',
      zipCode: user?.zipCode || '',
      country: user?.country || ''
    }
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword
  } = useForm();

  const onProfileSubmit = async (data) => {
    setIsProfileLoading(true);
    const result = await updateProfile(data);
    
    if (result.success) {
      toast.success('Profile updated successfully!');
      resetProfile(data);
    } else {
      toast.error(result.error);
    }
    setIsProfileLoading(false);
  };

  const onPasswordSubmit = async (data) => {
    setIsPasswordLoading(true);
    const result = await changePassword(data.currentPassword, data.newPassword);
    
    if (result.success) {
      toast.success('Password changed successfully!');
      setIsPasswordModalOpen(false);
      resetPassword();
    } else {
      toast.error(result.error);
    }
    setIsPasswordLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Personal Information
              </h2>

              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <Input
                    label="First Name"
                    {...registerProfile('firstName', { required: 'First name is required' })}
                    error={profileErrors.firstName?.message}
                  />
                  <Input
                    label="Last Name"
                    {...registerProfile('lastName', { required: 'Last name is required' })}
                    error={profileErrors.lastName?.message}
                  />
                </div>

                <Input
                  label="Email Address"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-gray-100"
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  {...registerProfile('phone')}
                  error={profileErrors.phone?.message}
                />

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    loading={isProfileLoading}
                    className="flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </Button>
                </div>
              </form>
            </div>

            {/* Address Information */}
            <div className="card p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Address Information
              </h2>

              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <Input
                  label="Address"
                  {...registerProfile('address')}
                  error={profileErrors.address?.message}
                />

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <Input
                    label="City"
                    {...registerProfile('city')}
                    error={profileErrors.city?.message}
                  />
                  <Input
                    label="State"
                    {...registerProfile('state')}
                    error={profileErrors.state?.message}
                  />
                  <Input
                    label="ZIP Code"
                    {...registerProfile('zipCode')}
                    error={profileErrors.zipCode?.message}
                  />
                </div>

                <Input
                  label="Country"
                  {...registerProfile('country')}
                  error={profileErrors.country?.message}
                />

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    loading={isProfileLoading}
                    className="flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Account Actions */}
            <div className="card p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Change Password</span>
                </Button>
              </div>
            </div>

            {/* Account Information */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{user?.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    {user?.firstName} {user?.lastName}
                  </span>
                </div>
                {user?.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{user.phone}</span>
                  </div>
                )}
                {user?.isAdmin && (
                  <div className="mt-4 p-2 bg-primary-50 rounded-lg">
                    <span className="text-primary-700 font-medium">Admin Account</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Modal */}
        <Modal
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
          title="Change Password"
        >
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <Input
              label="Current Password"
              type="password"
              {...registerPassword('currentPassword', { required: 'Current password is required' })}
              error={passwordErrors.currentPassword?.message}
            />

            <Input
              label="New Password"
              type="password"
              {...registerPassword('newPassword', { 
                required: 'New password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              error={passwordErrors.newPassword?.message}
            />

            <Input
              label="Confirm New Password"
              type="password"
              {...registerPassword('confirmPassword', {
                required: 'Please confirm your password',
                validate: value => value === passwordErrors.newPassword?.value || 'Passwords do not match'
              })}
              error={passwordErrors.confirmPassword?.message}
            />

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPasswordModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isPasswordLoading}
              >
                Change Password
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default Profile;
