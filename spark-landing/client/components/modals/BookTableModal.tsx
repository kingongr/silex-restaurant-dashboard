import React, { useState, useEffect } from 'react';
import { getModalClasses, MODAL_CONFIGS } from '../../utils/modalSizes';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { Calendar, Clock, Users, User, Phone, MapPin, Star, AlertCircle } from 'lucide-react';
import { validateRequired, getRequiredError, validateEmail, getEmailError, validatePhoneNumber, getPhoneError } from '../../utils/validation';
import { useToast } from '../../hooks/use-toast';

interface BookTableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookTableModal({ isOpen, onClose }: BookTableModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    partySize: '',
    reservationDate: '',
    reservationTime: '',
    tableType: '',
    specialRequests: '',
    occasion: '',
    isVIP: false
  });

  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [availableTables, setAvailableTables] = useState<Array<{id: string, number: number, capacity: number, type: string}>>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear errors when user starts typing
    if (field === 'customerPhone') setPhoneError('');
    if (field === 'customerEmail') setEmailError('');
    
    // Update available tables when time changes
    if (field === 'reservationTime') {
      updateAvailableTables(value as string);
    }
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Limit to 10 digits
    if (digits.length > 10) return;
    
    // Format as (XXX) XXX-XXXX
    if (digits.length >= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    } else if (digits.length >= 3) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else if (digits.length > 0) {
      return `(${digits}`;
    }
    return '';
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    if (formatted !== undefined) {
      setFormData(prev => ({ ...prev, customerPhone: formatted }));
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (value: string) => {
    setFormData(prev => ({ ...prev, customerEmail: value }));
    
    if (value && !validateEmail(value)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const updateAvailableTables = (selectedTime: string) => {
    if (!selectedTime) {
      setAvailableTables([]);
      return;
    }
    
    // Filter tables based on party size and availability
    const partySize = parseInt(formData.partySize) || 0;
    const filteredTables = allTables.filter(table => 
      table.capacity >= partySize && table.status === 'available'
    );
    
    setAvailableTables(filteredTables);
  };

  useEffect(() => {
    if (formData.reservationTime && formData.partySize) {
      updateAvailableTables(formData.reservationTime);
    }
  }, [formData.reservationTime, formData.partySize]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Validate required fields
    if (!formData.customerName?.trim()) {
      newErrors.customerName = 'Customer name is required';
    }
    
    if (!formData.customerPhone?.trim()) {
      newErrors.customerPhone = 'Phone number is required';
    } else if (!validatePhoneNumber(formData.customerPhone)) {
      newErrors.customerPhone = 'Please enter a valid 10-digit phone number';
    }
    
    if (formData.customerEmail && !validateEmail(formData.customerEmail)) {
      newErrors.customerEmail = 'Please enter a valid email address';
    }
    
    if (!formData.partySize) {
      newErrors.partySize = 'Party size is required';
    }
    
    if (!formData.reservationDate) {
      newErrors.reservationDate = 'Reservation date is required';
    }
    
    if (!formData.reservationTime) {
      newErrors.reservationTime = 'Reservation time is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('Booking table:', formData);
      
      // Show success toast
      toast({
        title: "Table Booked Successfully!",
        description: `Reservation for ${formData.customerName} on ${formData.reservationDate} at ${formData.reservationTime} has been confirmed.`,
        variant: "default",
      });
      
      // Close modal after showing toast
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error booking table:', error);
      
      // Show error toast
      toast({
        title: "Error",
        description: "Failed to book table. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const partySizes = [
    { value: '1', label: '1 person' },
    { value: '2', label: '2 people' },
    { value: '3', label: '3 people' },
    { value: '4', label: '4 people' },
    { value: '5', label: '5 people' },
    { value: '6', label: '6 people' },
    { value: '7', label: '7 people' },
    { value: '8', label: '8 people' },
    { value: '9+', label: '9+ people' }
  ];

  const tableTypes = [
    'Window View',
    'Garden View',
    'Private Corner',
    'Bar Seating',
    'Outdoor Patio',
    'Chef\'s Table',
    'Standard Table',
    'High Top'
  ];

  const availableTimeSlots = [
    { value: '17:00', label: '5:00 PM' },
    { value: '17:30', label: '5:30 PM' },
    { value: '18:00', label: '6:00 PM' },
    { value: '18:30', label: '6:30 PM' },
    { value: '19:00', label: '7:00 PM' },
    { value: '19:30', label: '7:30 PM' },
    { value: '20:00', label: '8:00 PM' },
    { value: '20:30', label: '8:30 PM' },
    { value: '21:00', label: '9:00 PM' },
    { value: '21:30', label: '9:30 PM' }
  ];

  const allTables = [
    { id: '1', number: 1, capacity: 2, type: 'Window View', status: 'available' },
    { id: '2', number: 2, capacity: 4, type: 'Garden View', status: 'available' },
    { id: '3', number: 3, capacity: 6, type: 'Private Corner', status: 'available' },
    { id: '4', number: 4, capacity: 4, type: 'Standard Table', status: 'available' },
    { id: '5', number: 5, capacity: 8, type: 'Chef\'s Table', status: 'available' },
    { id: '6', number: 6, capacity: 2, type: 'Bar Seating', status: 'available' },
    { id: '7', number: 7, capacity: 4, type: 'Outdoor Patio', status: 'available' },
    { id: '8', number: 8, capacity: 6, type: 'High Top', status: 'available' }
  ];

  const occasions = [
    'Business Meeting',
    'Date Night',
    'Family Dinner',
    'Birthday Celebration',
    'Anniversary',
    'Group Gathering',
    'Casual Dining',
    'Special Occasion'
  ];

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
              <DialogContent className={getModalClasses('FORM')}>
        <div className="p-6 sm:p-8">
          <DialogHeader className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                  Book Table
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400">
                  Make a reservation for your customers
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Customer Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <User className="w-4 h-4" />
                <h3 className="font-medium">Customer Information</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name *</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    placeholder="Enter customer name"
                    className={`w-full ${errors.customerName ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                  {errors.customerName && (
                    <p className="text-sm text-red-500 mt-1">{errors.customerName}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      id="customerPhone"
                      value={formData.customerPhone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder="(555) 123-4567"
                      className="pl-10"
                      maxLength={14}
                    />
                  </div>
                  {(phoneError || errors.customerPhone) && (
                    <div className="flex items-center gap-1 text-sm text-red-500">
                      <AlertCircle className="w-4 h-4" />
                      {errors.customerPhone || phoneError}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerEmail">Email Address</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="customer@example.com"
                  className="w-full"
                />
                {(emailError || errors.customerEmail) && (
                  <div className="flex items-center gap-1 text-sm text-red-500">
                    <AlertCircle className="w-4 h-4" />
                    {errors.customerEmail || emailError}
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Reservation Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Calendar className="w-4 h-4" />
                <h3 className="font-medium">Reservation Details</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reservationDate">Date *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      id="reservationDate"
                      type="date"
                      min={today}
                      value={formData.reservationDate}
                      onChange={(e) => handleInputChange('reservationDate', e.target.value)}
                      className={`pl-10 ${errors.reservationDate ? 'border-red-500 focus:border-red-500' : ''}`}
                    />
                  </div>
                  {errors.reservationDate && (
                    <p className="text-sm text-red-500 mt-1">{errors.reservationDate}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reservationTime">Time *</Label>
                  <Select value={formData.reservationTime} onValueChange={(value) => handleInputChange('reservationTime', value)}>
                    <SelectTrigger className={errors.reservationTime ? 'border-red-500 focus:border-red-500' : ''}>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTimeSlots.map((slot) => (
                        <SelectItem key={slot.value} value={slot.value}>
                          {slot.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.reservationTime && (
                    <p className="text-sm text-red-500 mt-1">{errors.reservationTime}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="partySize">Party Size *</Label>
                <Select value={formData.partySize} onValueChange={(value) => handleInputChange('partySize', value)}>
                  <SelectTrigger className={errors.partySize ? 'border-red-500 focus:border-red-500' : ''}>
                    <SelectValue placeholder="Select party size" />
                  </SelectTrigger>
                  <SelectContent>
                    {partySizes.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.partySize && (
                  <p className="text-sm text-red-500 mt-1">{errors.partySize}</p>
                )}
              </div>
            </div>

            <Separator />

            {/* Table Preferences */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Star className="w-4 h-4" />
                <h3 className="font-medium">Table Preferences</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tableType">Available Tables</Label>
                  {!formData.reservationTime || !formData.partySize ? (
                    <div className="text-sm text-muted-foreground p-3 border rounded-md">
                      Select date, time, and party size to see available tables
                    </div>
                  ) : availableTables.length === 0 ? (
                    <div className="text-sm text-red-500 p-3 border border-red-200 rounded-md">
                      No tables available for {formData.partySize} people at {formData.reservationTime}
                    </div>
                  ) : (
                    <Select value={formData.tableType} onValueChange={(value) => handleInputChange('tableType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a table" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTables.map((table) => (
                          <SelectItem key={table.id} value={table.id}>
                            Table {table.number} - {table.type} ({table.capacity} seats)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="occasion">Occasion</Label>
                  <Select value={formData.occasion} onValueChange={(value) => handleInputChange('occasion', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select occasion" />
                    </SelectTrigger>
                    <SelectContent>
                      {occasions.map((occasion) => (
                        <SelectItem key={occasion} value={occasion}>
                          {occasion}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isVIP"
                  checked={formData.isVIP}
                  onChange={(e) => handleInputChange('isVIP', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isVIP">VIP Customer (Priority seating)</Label>
              </div>
            </div>

            <Separator />

            {/* Special Requests */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <MapPin className="w-4 h-4" />
                <h3 className="font-medium">Special Requests</h3>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="specialRequests">Special Requests & Notes</Label>
                <Textarea
                  id="specialRequests"
                  value={formData.specialRequests}
                  onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                  placeholder="Any special requests, dietary restrictions, or notes for the staff..."
                  rows={3}
                  className="w-full"
                />
              </div>
            </div>

            {/* Reservation Summary */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Date:</span>
                  <span className="font-medium">{formData.reservationDate || 'Not selected'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Time:</span>
                  <span className="font-medium">
                    {formData.reservationTime ? 
                      availableTimeSlots.find(slot => slot.value === formData.reservationTime)?.label || formData.reservationTime
                      : 'Not selected'
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Party Size:</span>
                  <span className="font-medium">{formData.partySize ? `${formData.partySize} people` : 'Not selected'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Table:</span>
                  <span className="font-medium">
                    {formData.tableType ? 
                      availableTables.find(table => table.id === formData.tableType)?.type || 'Selected'
                      : 'Not selected'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>

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
              className="px-8 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:opacity-90 transition-opacity duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Booking...' : 'Book Table'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
