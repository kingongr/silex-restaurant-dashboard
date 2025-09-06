import React, { useState } from 'react';
import { getModalClasses, MODAL_CONFIGS } from '../../utils/modalSizes';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { User, Mail, Phone, Plus } from 'lucide-react';
import { 
  validateName, 
  getNameError,
  validateEmail, 
  getEmailError,
  formatPhoneNumber, 
  getPhoneError
} from '../../utils/validation';
import { useToast } from '../../hooks/use-toast';

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStaff: (staffData: {
    name: string;
    role: string;
    email: string;
    phone: string;
    isActive: boolean;
  }) => void;
}

export default function AddStaffModal({ isOpen, onClose, onAddStaff }: AddStaffModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    phone: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    role: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roles = [
    { value: 'manager', label: 'Manager' },
    { value: 'head-chef', label: 'Head Chef' },
    { value: 'chef', label: 'Chef' },
    { value: 'server', label: 'Server' },
    { value: 'host', label: 'Host' },
    { value: 'bartender', label: 'Bartender' },
    { value: 'busser', label: 'Busser' },
    { value: 'dishwasher', label: 'Dishwasher' },
    { value: 'delivery', label: 'Delivery Driver' }
  ];

  const handleInputChange = (field: string, value: string) => {
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

  const handleNameChange = (value: string) => {
    setFormData(prev => ({ ...prev, name: value }));
    
    // Validate name
    const nameError = getNameError(value);
    setErrors(prev => ({ ...prev, name: nameError }));
  };

  const handleSave = async () => {
    // Validate all fields
    const newErrors = {
      name: getNameError(formData.name),
      role: formData.role ? '' : 'Role is required',
      email: getEmailError(formData.email),
      phone: getPhoneError(formData.phone)
    };

    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some(error => error !== '')) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create new staff member
      const newStaff = {
        name: formData.name,
        role: roles.find(r => r.value === formData.role)?.label || formData.role,
        email: formData.email,
        phone: formData.phone,
        isActive: true
      };

      onAddStaff(newStaff);
      
      // Show success toast
      toast({
        title: "Success!",
        description: `${formData.name} has been added to the staff.`,
        variant: "default",
      });
      
      // Reset form
      setFormData({ name: '', role: '', email: '', phone: '' });
      setErrors({ name: '', role: '', email: '', phone: '' });
      
      // Close modal after showing toast
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      
      // Show error toast
      toast({
        title: "Error",
        description: "Failed to add staff member. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setFormData({ name: '', role: '', email: '', phone: '' });
    setErrors({ name: '', role: '', email: '', phone: '' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden max-h-[85vh] overflow-y-auto ml-[132px]">
        <div className="p-6 sm:p-8">
          <DialogHeader className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                  Add Staff Member
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400">
                  Add a new staff member to your restaurant
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <User className="w-4 h-4" />
                <h3 className="font-medium">Staff Information</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g., John Smith"
                    className={`w-full ${errors.name ? 'border-red-500' : ''}`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                    <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.role && (
                    <p className="text-red-500 text-sm">{errors.role}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    placeholder="e.g., john@silexrestaurant.com"
                    className={`w-full ${errors.email ? 'border-red-500' : ''}`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="e.g., (555) 123-4567"
                    className={`w-full ${errors.phone ? 'border-red-500' : ''}`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm">{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="ghost"
              onClick={handleClose}
              className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSubmitting}
              className="px-8 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:opacity-90 transition-opacity duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Adding...' : 'Add Staff Member'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
