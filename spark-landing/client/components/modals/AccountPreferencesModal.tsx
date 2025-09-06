import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { Settings, User, Bell, Eye, Shield, Globe, Sparkles } from 'lucide-react';
import {
  formatPhoneNumber,
  validatePhoneNumber,
  getPhoneError,
  validateEmail,
  getEmailError,
  validateName,
  getNameError
} from '../../utils/validation';
import MissingInformationModal from './MissingInformationModal';
import ErrorModal from './ErrorModal';
import ConfirmationModal from './ConfirmationModal';

interface AccountPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AccountPreferencesModal({ isOpen, onClose }: AccountPreferencesModalProps) {
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@silexrestaurant.com',
    phone: '+1 (555) 123-4567',
    language: 'English',
    timezone: 'America/New_York',
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    orderAlerts: true,
    reservationAlerts: true,
    inventoryAlerts: true,
    twoFactorAuth: false,
    sessionTimeout: '4',
    theme: 'system'
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Standard modal states
  const [showMissingInfoModal, setShowMissingInfoModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear errors when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setFormData(prev => ({ ...prev, phone: formatted }));
    
    // Validate phone number
    const phoneError = getPhoneError(formatted);
    setErrors(prev => ({ ...prev, phone: phoneError }));
  };

  const handleEmailChange = (value: string) => {
    setFormData(prev => ({ ...prev, email: value }));
    
    // Validate email
    const emailError = getEmailError(value);
    setErrors(prev => ({ ...prev, email: emailError }));
  };

  const handleNameChange = (field: 'firstName' | 'lastName', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Validate name
    const nameError = getNameError(value);
    setErrors(prev => ({ ...prev, [field]: nameError }));
  };

  const handleSave = () => {
    // Validate all fields
    const newErrors = {
      firstName: getNameError(formData.firstName),
      lastName: getNameError(formData.lastName),
      email: getEmailError(formData.email),
      phone: getPhoneError(formData.phone)
    };

    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some(error => error !== '')) {
      setMissingFields(Object.entries(newErrors)
        .filter(([_, error]) => error !== '')
        .map(([field, error]) => {
          const fieldNames: { [key: string]: string } = {
            firstName: 'First Name',
            lastName: 'Last Name',
            email: 'Email Address',
            phone: 'Phone Number'
          };
          return fieldNames[field] || field;
        })
      );
      setShowMissingInfoModal(true);
      return;
    }

    // Show confirmation modal
    setShowConfirmationModal(true);
  };

  const handleConfirmSave = async () => {
    setIsSubmitting(true);

    try {
      setShowConfirmationModal(false);
      onClose();
    } catch (error) {
      const errorMsg = error instanceof Error
        ? error.message
        : 'Failed to save account preferences. Please try again.';
      setErrorMessage(errorMsg);
      setShowErrorModal(true);
      setShowConfirmationModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl mx-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl max-h-[85vh] overflow-y-auto">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-white/30 to-pink-50/50 dark:from-purple-950/20 dark:via-gray-900/30 dark:to-pink-950/20 pointer-events-none" />

        <div className="relative p-5 lg:p-6">
          {/* Enhanced Header */}
          <DialogHeader className="mb-6 lg:mb-7">
            <div className="flex items-center gap-3 mb-2">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <div>
                <DialogTitle className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                  Account Preferences
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400 mt-0.5 text-sm">
                  Manage your account settings and preferences
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Personal Information */}
            <div className="group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    First Name
                  </Label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => handleNameChange('firstName', e.target.value)}
                    className={`w-full p-3 border-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 ${
                      errors.firstName ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Last Name
                  </Label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => handleNameChange('lastName', e.target.value)}
                    className={`w-full p-3 border-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 ${
                      errors.lastName ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Email Address
                  </Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    className={`w-full p-3 border-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 ${
                      errors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Phone Number
                  </Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className={`w-full p-3 border-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 ${
                      errors.phone ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Localization */}
            <div className="group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Localization</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Language
                  </Label>
                  <Select value={formData.language} onValueChange={(value) => handleInputChange('language', value)}>
                    <SelectTrigger className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Spanish">Spanish</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                      <SelectItem value="German">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Timezone
                  </Label>
                  <Select value={formData.timezone} onValueChange={(value) => handleInputChange('timezone', value)}>
                    <SelectTrigger className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Notifications */}
            <div className="group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/25">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Email Notifications</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Receive notifications via email</div>
                  </div>
                  <Switch
                    checked={formData.emailNotifications}
                    onCheckedChange={(value) => handleInputChange('emailNotifications', value)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Push Notifications</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Receive browser push notifications</div>
                  </div>
                  <Switch
                    checked={formData.pushNotifications}
                    onCheckedChange={(value) => handleInputChange('pushNotifications', value)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">SMS Notifications</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Receive notifications via text message</div>
                  </div>
                  <Switch
                    checked={formData.smsNotifications}
                    onCheckedChange={(value) => handleInputChange('smsNotifications', value)}
                  />
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <h4 className="font-medium text-gray-900 dark:text-white text-sm">Alert Types</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Order Alerts</span>
                    <Switch
                      checked={formData.orderAlerts}
                      onCheckedChange={(value) => handleInputChange('orderAlerts', value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Reservation Alerts</span>
                    <Switch
                      checked={formData.reservationAlerts}
                      onCheckedChange={(value) => handleInputChange('reservationAlerts', value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Inventory Alerts</span>
                    <Switch
                      checked={formData.inventoryAlerts}
                      onCheckedChange={(value) => handleInputChange('inventoryAlerts', value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Security */}
            <div className="group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/25">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Security</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Add extra security to your account</div>
                  </div>
                  <Switch
                    checked={formData.twoFactorAuth}
                    onCheckedChange={(value) => handleInputChange('twoFactorAuth', value)}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Session Timeout (hours)
                  </Label>
                  <Select value={formData.sessionTimeout} onValueChange={(value) => handleInputChange('sessionTimeout', value)}>
                    <SelectTrigger className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 hour</SelectItem>
                      <SelectItem value="2">2 hours</SelectItem>
                      <SelectItem value="4">4 hours</SelectItem>
                      <SelectItem value="8">8 hours</SelectItem>
                      <SelectItem value="24">24 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="ghost"
                onClick={onClose}
                className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSubmitting}
                className="px-8 py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white rounded-xl hover:opacity-90 transition-opacity duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Standard Modal Components */}
      <MissingInformationModal
        isOpen={showMissingInfoModal}
        onClose={() => setShowMissingInfoModal(false)}
        title="Missing Information"
        message="Please fill in all required fields before saving."
        missingFields={missingFields}
      />

      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Save Failed"
        message="Unable to save account preferences."
        error={errorMessage}
        showRetry={true}
        onRetry={() => {
          setShowErrorModal(false);
          handleConfirmSave();
        }}
      />

      <ConfirmationModal
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        onConfirm={handleConfirmSave}
        title="Save Account Preferences"
        message="Are you sure you want to save these account preferences?"
        confirmText="Save Changes"
        cancelText="Cancel"
        type="info"
        isLoading={isSubmitting}
      />
    </Dialog>
  );
}
