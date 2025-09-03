import React, { useState } from 'react';
import { getModalClasses, MODAL_CONFIGS } from '../../utils/modalSizes';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { Settings, User, Bell, Eye, Shield, Globe } from 'lucide-react';
import { 
  formatPhoneNumber, 
  validatePhoneNumber, 
  getPhoneError,
  validateEmail, 
  getEmailError,
  validateName,
  getNameError
} from '../../utils/validation';

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

  const handleSave = async () => {
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
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Saving account preferences:', formData);
      onClose();
    } catch (error) {
      console.error('Error saving account preferences:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={getModalClasses('FORM')}>
        <div className="p-6 sm:p-8">
          <DialogHeader className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                  Account Preferences
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400">
                  Manage your account settings and preferences
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Personal Information</h3>
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
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Localization</h3>
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
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notifications</h3>
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
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Security</h3>
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
            <div className="flex justify-end gap-3 pt-4">
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
                className="px-8 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:opacity-90 transition-opacity duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
