import React, { useState, useEffect } from 'react';
import { getModalClasses, MODAL_CONFIGS } from '../../utils/modalSizes';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Calendar, Clock, Users, User, Phone, MapPin, Star, AlertCircle, ShoppingCart, Check, Mail } from 'lucide-react';
import { validateRequired, getRequiredError, validateEmail, getEmailError, validatePhoneNumber, getPhoneError } from '../../utils/validation';
import { useToast } from '../../hooks/use-toast';
import PreOrderConfirmationModal from './PreOrderConfirmationModal';

interface BookTableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'create' | 'preorder';

export default function BookTableModal({ isOpen, onClose }: BookTableModalProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<Step>('create');
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
  const [isPreOrderModalOpen, setIsPreOrderModalOpen] = useState(false);
  const [createdReservationId, setCreatedReservationId] = useState<string>('');

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
      // Generate a mock reservation ID
      const reservationId = `RES-${Date.now()}`;
      setCreatedReservationId(reservationId);
      
      // Show success toast
      toast({
        title: "Table Booked Successfully!",
        description: `Reservation for ${formData.customerName} on ${formData.reservationDate} at ${formData.reservationTime} has been confirmed.`,
        variant: "default",
      });
      
      // Move to pre-order step
      setCurrentStep('preorder');
    } catch (error) {
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

  const handleAddPreOrder = () => {
    setIsPreOrderModalOpen(true);
  };

  const handlePreOrderCreated = (orderId: string) => {
    toast({
      title: "Pre-order Linked Successfully!",
      description: `Pre-order has been linked to reservation ${createdReservationId}.`,
      variant: "default",
    });
    setIsPreOrderModalOpen(false);
    handleCancel();
  };

  const handleSkipPreOrder = () => {
    handleCancel();
  };

  const handleCancel = () => {
    setFormData({
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
    setPhoneError('');
    setEmailError('');
    setAvailableTables([]);
    setErrors({});
    setCurrentStep('create');
    setCreatedReservationId('');
    setIsPreOrderModalOpen(false);
    onClose();
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="max-w-3xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden max-h-[85vh] overflow-y-auto mx-4 sm:mx-6 lg:mx-auto">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-white/30 to-pink-50/50 dark:from-purple-950/20 dark:via-gray-900/30 dark:to-pink-950/20 pointer-events-none" />

        <div className="relative p-5 lg:p-6">
          <DialogHeader className="mb-6 lg:mb-7">
            <div className="flex items-center gap-3 mb-2">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Star className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <div>
                <DialogTitle className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                  Book Table
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400 mt-0.5 text-sm">
                  Make a reservation for your customers
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {currentStep === 'create' ? (
              <>
                {/* Customer Information */}
                <Card className="bg-gray-50/50 dark:bg-gray-800/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      Customer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="customerName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Customer Name *
                        </Label>
                        <Input
                          id="customerName"
                          value={formData.customerName}
                          onChange={(e) => handleInputChange('customerName', e.target.value)}
                          placeholder="Enter customer name"
                          className={`w-full h-11 bg-white/90 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 ${
                            errors.customerName ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                          }`}
                        />
                        {errors.customerName && (
                          <p className="text-sm text-red-500 mt-1">{errors.customerName}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="customerPhone" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Phone Number *
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <Input
                            id="customerPhone"
                            value={formData.customerPhone}
                            onChange={(e) => handlePhoneChange(e.target.value)}
                            placeholder="(555) 123-4567"
                            className={`pl-10 h-11 bg-white/90 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 ${
                              phoneError || errors.customerPhone ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                            }`}
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
                      <Label htmlFor="customerEmail" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email Address
                      </Label>
                      <Input
                        id="customerEmail"
                        type="email"
                        value={formData.customerEmail}
                        onChange={(e) => handleEmailChange(e.target.value)}
                        placeholder="customer@example.com"
                        className={`w-full h-11 bg-white/90 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 ${
                          emailError || errors.customerEmail ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                        }`}
                      />
                      {(emailError || errors.customerEmail) && (
                        <div className="flex items-center gap-1 text-sm text-red-500">
                          <AlertCircle className="w-4 h-4" />
                          {errors.customerEmail || emailError}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Reservation Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      Reservation Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Date and Party Size */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          Reservation Date *
                        </Label>
                        <Input
                          type="date"
                          min={today}
                          value={formData.reservationDate}
                          onChange={(e) => handleInputChange('reservationDate', e.target.value)}
                          className={`w-full ${
                            errors.reservationDate ? 'border-red-500 focus:border-red-500' : ''
                          }`}
                        />
                        {errors.reservationDate && (
                          <p className="text-sm text-red-500 mt-1">{errors.reservationDate}</p>
                        )}
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          Party Size *
                        </Label>
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

                    {/* Time Selection */}
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Reservation Time *
                      </Label>
                      {!formData.reservationDate || !formData.partySize ? (
                        <div className="text-sm text-gray-500 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
                          Select date and party size to see available times
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                          {availableTimeSlots.map((slot) => (
                            <Button
                              key={slot.value}
                              variant={formData.reservationTime === slot.value ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleInputChange('reservationTime', slot.value)}
                              className={`relative ${
                                formData.reservationTime === slot.value
                                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                                  : 'hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300'
                              }`}
                            >
                              {slot.label}
                            </Button>
                          ))}
                        </div>
                      )}
                      {errors.reservationTime && (
                        <p className="text-sm text-red-500 mt-1">{errors.reservationTime}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Table Preferences - Only show if multiple tables available */}
                {formData.reservationDate && formData.reservationTime && formData.partySize && availableTables.length > 1 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Star className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        Table Preferences
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Table Selection */}
                      <div>
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          Table Selection
                        </Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {availableTables.map((table) => (
                            <Button
                              key={table.id}
                              variant={formData.tableType === table.id ? "default" : "outline"}
                              onClick={() => handleInputChange('tableType', table.id)}
                              className={`justify-start ${
                                formData.tableType === table.id
                                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                                  : 'hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300'
                              }`}
                            >
                              <MapPin className="w-4 h-4 mr-2" />
                              Table {table.number} - {table.type} ({table.capacity} seats)
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Occasion */}
                      <div>
                        <Label htmlFor="occasion" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          Occasion
                        </Label>
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
                    </CardContent>
                  </Card>
                )}

                {/* Auto-select single table and show occasion only */}
                {formData.reservationDate && formData.reservationTime && formData.partySize && availableTables.length === 1 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Star className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        Reservation Preferences
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Single Table Notice */}
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800 dark:text-green-200">
                            Table {availableTables[0]?.number} - {availableTables[0]?.type} ({availableTables[0]?.capacity} seats) has been automatically selected
                          </span>
                        </div>
                      </div>

                      {/* Occasion */}
                      <div>
                        <Label htmlFor="occasion" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          Occasion
                        </Label>
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
                    </CardContent>
                  </Card>
                )}

                {/* Special Requests */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      Special Requests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label htmlFor="specialRequests" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Special Requests & Notes
                      </Label>
                      <Textarea
                        id="specialRequests"
                        value={formData.specialRequests}
                        onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                        placeholder="Any special requests, dietary restrictions, or notes for the staff..."
                        rows={3}
                        className="w-full bg-white/90 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Reservation Summary */}
                <Card className="bg-gradient-to-r from-purple-50/50 via-white/30 to-pink-50/50 dark:from-purple-950/20 dark:via-gray-900/30 dark:to-pink-950/20 border-purple-200/50 dark:border-purple-700/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Check className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      Reservation Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Date:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{formData.reservationDate || 'Not selected'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Time:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formData.reservationTime ? 
                            availableTimeSlots.find(slot => slot.value === formData.reservationTime)?.label || formData.reservationTime
                            : 'Not selected'
                          }
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Party Size:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{formData.partySize ? `${formData.partySize} people` : 'Not selected'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Table:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formData.tableType ? 
                            availableTables.find(table => table.id === formData.tableType)?.type || 'Selected'
                            : 'Not selected'
                          }
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              /* Pre-order Step */
              <div className="space-y-6">
                {/* Success Message */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">Reservation Created Successfully!</h3>
                      <p className="text-green-600 dark:text-green-400">Reservation #{createdReservationId} has been created for {formData.customerName}</p>
                    </div>
                  </div>
                </div>

                {/* Link to Pre-order */}
                <div className="bg-gradient-to-r from-[#5B47FF]/5 to-[#7B6CFF]/5 dark:from-[#5B47FF]/10 dark:to-[#7B6CFF]/10 rounded-xl p-6 border border-[#7B6CFF]/30 dark:border-[#7B6CFF]/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#5B47FF] to-[#7B6CFF] rounded-xl flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add Pre-order</h3>
                      <p className="text-gray-600 dark:text-gray-400">Would you like to create a pre-order for this reservation?</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Customer:</span>
                          <p className="font-medium text-gray-900 dark:text-white">{formData.customerName}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Date:</span>
                          <p className="font-medium text-gray-900 dark:text-white">{formData.reservationDate}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Time:</span>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {formData.reservationTime ? 
                              availableTimeSlots.find(slot => slot.value === formData.reservationTime)?.label || formData.reservationTime
                              : 'Not selected'
                            }
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Party Size:</span>
                          <p className="font-medium text-gray-900 dark:text-white">{formData.partySize} people</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSkipPreOrder}
                    className="px-6 py-2 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                  >
                    Skip for Now
                  </Button>
                  <Button
                    onClick={handleAddPreOrder}
                    className="px-8 py-2 bg-gradient-to-r from-[#5B47FF] to-[#7B6CFF] text-white rounded-xl hover:opacity-90 transition-opacity duration-200 shadow-lg"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Create Pre-order
                  </Button>
                </div>
              </div>
            )}
          </div>

          {currentStep === 'create' && (
            <div className="relative mt-6">
              <div className="flex items-center justify-between pt-6">
                <Button
                  variant="ghost" 
                  onClick={handleCancel}
                  className="px-6 py-3 h-auto text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 font-medium"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSubmitting}
                  className="px-8 py-3 h-auto bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transform hover:scale-[1.02] font-semibold relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Booking...' : 'Book Table'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>

      {/* Pre-order Confirmation Modal */}
      <PreOrderConfirmationModal
        isOpen={isPreOrderModalOpen}
        onClose={() => setIsPreOrderModalOpen(false)}
        linkedReservationId={createdReservationId}
        prefilledCustomer={{
          id: 'temp-customer',
          name: formData.customerName,
          email: formData.customerEmail,
          phone: formData.customerPhone
        }}
        reservationDate={formData.reservationDate}
        reservationTime={formData.reservationTime}
        onOrderCreated={handlePreOrderCreated}
      />
    </Dialog>
  );
}
