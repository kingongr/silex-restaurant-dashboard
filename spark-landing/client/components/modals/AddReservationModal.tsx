import { useState } from 'react';
import { getModalClasses, MODAL_CONFIGS } from '../../utils/modalSizes';
import { 
  validateRequired, 
  getRequiredError, 
  validateEmail, 
  getEmailError,
  validatePhoneNumber,
  getPhoneError,
  validateFutureDate,
  getFutureDateError,
  validateBusinessHours,
  getBusinessHoursError,
  validatePartySize,
  getPartySizeError
} from '../../utils/validation';
import { useToast } from '../../hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  User,
  Users,
  Phone,
  Mail,
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  ArrowRight,
  Check,
  Heart,
  Gift,
  Utensils,
  Star
} from 'lucide-react';

interface AddReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const timeSlots = [
  '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', 
  '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM'
];

const partySizes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const specialOccasions = [
  { id: 'birthday', label: 'Birthday', icon: Gift },
  { id: 'anniversary', label: 'Anniversary', icon: Heart },
  { id: 'business', label: 'Business Dinner', icon: Users },
  { id: 'date', label: 'Date Night', icon: Star },
];

export function AddReservationModal({ isOpen, onClose }: AddReservationModalProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [customerType, setCustomerType] = useState<'new' | 'returning' | null>(null);
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [reservationData, setReservationData] = useState({
    date: '',
    time: '',
    partySize: 2,
    specialOccasion: '',
    specialRequests: '',
    accessibility: false,
    preOrder: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalSteps = 4;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setCustomerType(null);
    setCustomerData({ name: '', phone: '', email: '' });
    setReservationData({
      date: '',
      time: '',
      partySize: 2,
      specialOccasion: '',
      specialRequests: '',
      accessibility: false,
      preOrder: false
    });
    setErrors({});
    onClose();
  };

  const handleCreateReservation = () => {
    // Validate final step
    if (!validateStep(currentStep)) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before creating the reservation.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create reservation data
      const reservationDataFinal = {
        customer: customerData,
        reservation: reservationData,
        createdAt: new Date().toISOString()
      };


      // Show success toast
      toast({
        title: "Reservation Created Successfully!",
        description: `Reservation for ${customerData.name} on ${reservationData.date} at ${reservationData.time} has been created.`,
        variant: "default",
      });

      // Close modal after showing toast
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (error) {
      
      toast({
        title: "Error",
        description: "Failed to create reservation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case 1:
        if (!customerType) {
          newErrors.customerType = 'Please select a customer type';
        }
        break;
        
      case 2:
        if (customerType === 'new') {
          if (!validateRequired(customerData.name)) {
            newErrors.customerName = getRequiredError(customerData.name, 'Customer name');
          } else if (!validateName(customerData.name)) {
            newErrors.customerName = getNameError(customerData.name);
          }
          
          if (!validateRequired(customerData.phone)) {
            newErrors.customerPhone = getRequiredError(customerData.phone, 'Phone number');
          } else if (!validatePhoneNumber(customerData.phone)) {
            newErrors.customerPhone = getPhoneError(customerData.phone);
          }
          
          if (customerData.email && !validateEmail(customerData.email)) {
            newErrors.customerEmail = getEmailError(customerData.email);
          }
        }
        break;
        
      case 3:
        if (!validateRequired(reservationData.date)) {
          newErrors.reservationDate = getRequiredError(reservationData.date, 'Reservation date');
        } else if (!validateFutureDate(reservationData.date)) {
          newErrors.reservationDate = getFutureDateError(reservationData.date);
        }
        
        if (!validateRequired(reservationData.time)) {
          newErrors.reservationTime = getRequiredError(reservationData.time, 'Reservation time');
        } else if (!validateBusinessHours(reservationData.time)) {
          newErrors.reservationTime = getBusinessHoursError(reservationData.time);
        }
        
        if (!validatePartySize(reservationData.partySize, 1, 20)) {
          newErrors.partySize = getPartySizeError(reservationData.partySize, 1, 20);
        }
        break;
        
      case 4:
        // Final validation - all required fields should be valid
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const canProceed = () => {
    // Validate current step before allowing to proceed
    if (!validateStep(currentStep)) {
      return false;
    }
    
    switch (currentStep) {
      case 1: return customerType !== null;
      case 2: return customerType === 'returning' || (customerData.name && customerData.phone);
      case 3: return reservationData.date && reservationData.time;
      case 4: return true;
      default: return false;
    }
  };

  // Generate available dates (next 30 days)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
              <DialogContent className="max-w-3xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden max-h-[85vh] overflow-y-auto">
        <div className="p-6 sm:p-8">
          <DialogHeader className="mb-6 sm:mb-8">
            <DialogTitle className="flex items-center gap-3">
              <div className="w-8 h-8 aurora-gradient rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              Add New Reservation - Step {currentStep} of {totalSteps}
            </DialogTitle>
          </DialogHeader>

        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2 mb-6">
          <div 
            className="aurora-gradient h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        {/* Step 1: Customer Selection */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-heading-3 font-semibold mb-4">Customer Information</h3>
              {errors.customerType && (
                <p className="text-sm text-red-500 mb-4">{errors.customerType}</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card 
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    customerType === 'new' ? 'ring-2 ring-aurora-500 aurora-gradient-subtle' : ''
                  }`}
                  onClick={() => setCustomerType('new')}
                >
                  <CardContent className="p-6 text-center">
                    <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h4 className="text-lg font-semibold mb-2">New Customer</h4>
                    <p className="text-muted-foreground">Create a new customer profile</p>
                  </CardContent>
                </Card>
                
                <Card 
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    customerType === 'returning' ? 'ring-2 ring-aurora-500 aurora-gradient-subtle' : ''
                  }`}
                  onClick={() => setCustomerType('returning')}
                >
                  <CardContent className="p-6 text-center">
                    <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h4 className="text-lg font-semibold mb-2">Returning Customer</h4>
                    <p className="text-muted-foreground">Search existing customer database</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Customer Details */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-heading-3 font-semibold">
              {customerType === 'new' ? 'New Customer Details' : 'Find Existing Customer'}
            </h3>
            
            {customerType === 'new' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      className={`pl-10 ${errors.customerName ? 'border-red-500 focus:border-red-500' : ''}`}
                      placeholder="Enter customer name"
                      value={customerData.name}
                      onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
                    />
                  </div>
                  {errors.customerName && (
                    <p className="text-sm text-red-500 mt-1">{errors.customerName}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      className={`pl-10 ${errors.customerPhone ? 'border-red-500 focus:border-red-500' : ''}`}
                      placeholder="(555) 123-4567"
                      value={customerData.phone}
                      onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
                    />
                  </div>
                  {errors.customerPhone && (
                    <p className="text-sm text-red-500 mt-1">{errors.customerPhone}</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      className={`pl-10 ${errors.customerEmail ? 'border-red-500 focus:border-red-500' : ''}`}
                      placeholder="customer@example.com"
                      value={customerData.email}
                      onChange={(e) => setCustomerData({...customerData, email: e.target.value})}
                    />
                  </div>
                  {errors.customerEmail && (
                    <p className="text-sm text-red-500 mt-1">{errors.customerEmail}</p>
                  )}
                </div>
              </div>
            )}

            {customerType === 'returning' && (
              <div>
                <Label htmlFor="search">Search Customer</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="search"
                    className="pl-10"
                    placeholder="Search by name, phone, or email..."
                  />
                </div>
                
                {/* Mock search results */}
                <div className="mt-4 space-y-2">
                  <Card className="cursor-pointer hover:shadow-md transition-all">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium">Sarah Johnson</p>
                        <p className="text-sm text-muted-foreground">(555) 987-6543 • sarah@email.com</p>
                      </div>
                      <Badge variant="secondary">VIP Customer</Badge>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Reservation Details */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-heading-3 font-semibold">Reservation Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date & Time Selection */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="date">Reservation Date *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="date"
                      type="date"
                      className={`pl-10 ${errors.reservationDate ? 'border-red-500 focus:border-red-500' : ''}`}
                      min={new Date().toISOString().split('T')[0]}
                      value={reservationData.date}
                      onChange={(e) => setReservationData({...reservationData, date: e.target.value})}
                    />
                  </div>
                  {errors.reservationDate && (
                    <p className="text-sm text-red-500 mt-1">{errors.reservationDate}</p>
                  )}
                </div>

                <div>
                  <Label>Party Size *</Label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {partySizes.map((size) => (
                      <Button
                        key={size}
                        variant={reservationData.partySize === size ? 'default' : 'outline'}
                        size="sm"
                        className={reservationData.partySize === size ? 'aurora-gradient text-white' : ''}
                        onClick={() => setReservationData({...reservationData, partySize: size})}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                  {errors.partySize && (
                    <p className="text-sm text-red-500 mt-1">{errors.partySize}</p>
                  )}
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <Label>Available Time Slots *</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 max-h-48 overflow-y-auto">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={reservationData.time === time ? 'default' : 'outline'}
                      size="sm"
                      className={reservationData.time === time ? 'aurora-gradient text-white' : ''}
                      onClick={() => setReservationData({...reservationData, time})}
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      {time}
                    </Button>
                  ))}
                </div>
                {errors.reservationTime && (
                  <p className="text-sm text-red-500 mt-1">{errors.reservationTime}</p>
                )}
              </div>
            </div>

            {/* Special Occasion */}
            <div>
              <Label>Special Occasion (Optional)</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                {specialOccasions.map((occasion) => {
                  const Icon = occasion.icon;
                  return (
                    <Card
                      key={occasion.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        reservationData.specialOccasion === occasion.id ? 'ring-2 ring-aurora-500 aurora-gradient-subtle' : ''
                      }`}
                      onClick={() => setReservationData({
                        ...reservationData, 
                        specialOccasion: reservationData.specialOccasion === occasion.id ? '' : occasion.id
                      })}
                    >
                      <CardContent className="p-3 text-center">
                        <Icon className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
                        <p className="text-xs font-medium">{occasion.label}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <Label htmlFor="requests">Special Requests</Label>
              <Textarea
                id="requests"
                placeholder="Any dietary restrictions, accessibility needs, or special arrangements..."
                className="mt-2"
                value={reservationData.specialRequests}
                onChange={(e) => setReservationData({...reservationData, specialRequests: e.target.value})}
              />
            </div>
          </div>
        )}

        {/* Step 4: Additional Services & Confirmation */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h3 className="text-heading-3 font-semibold">Additional Services & Confirmation</h3>
            
            {/* Additional Services */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="cursor-pointer hover:shadow-md transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Utensils className="w-6 h-6 text-muted-foreground" />
                    <div className="flex-1">
                      <h4 className="font-semibold">Pre-Order Menu</h4>
                      <p className="text-sm text-muted-foreground">Order food in advance</p>
                    </div>
                    <Button
                      variant={reservationData.preOrder ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setReservationData({...reservationData, preOrder: !reservationData.preOrder})}
                    >
                      {reservationData.preOrder ? 'Added' : 'Add'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-muted-foreground" />
                    <div className="flex-1">
                      <h4 className="font-semibold">Accessibility</h4>
                      <p className="text-sm text-muted-foreground">Special seating requirements</p>
                    </div>
                    <Button
                      variant={reservationData.accessibility ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setReservationData({...reservationData, accessibility: !reservationData.accessibility})}
                    >
                      {reservationData.accessibility ? 'Added' : 'Add'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Reservation Summary */}
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-4">Reservation Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p><span className="text-muted-foreground">Customer:</span> {customerData.name || 'Sarah Johnson'}</p>
                    <p><span className="text-muted-foreground">Phone:</span> {customerData.phone || '(555) 987-6543'}</p>
                    <p><span className="text-muted-foreground">Email:</span> {customerData.email || 'sarah@email.com'}</p>
                  </div>
                  <div className="space-y-2">
                    <p><span className="text-muted-foreground">Date:</span> {reservationData.date || 'Not selected'}</p>
                    <p><span className="text-muted-foreground">Time:</span> {reservationData.time || 'Not selected'}</p>
                    <p><span className="text-muted-foreground">Party Size:</span> {reservationData.partySize} guests</p>
                    {reservationData.specialOccasion && (
                      <p><span className="text-muted-foreground">Occasion:</span> {
                        specialOccasions.find(o => o.id === reservationData.specialOccasion)?.label
                      }</p>
                    )}
                  </div>
                </div>
                {reservationData.specialRequests && (
                  <div className="mt-4 pt-4 border-t">
                    <p><span className="text-muted-foreground">Special Requests:</span></p>
                    <p className="mt-1">{reservationData.specialRequests}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <Button 
            variant="outline" 
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            {currentStep === totalSteps ? (
              <Button className="btn-aurora" onClick={handleCreateReservation}>
                <Check className="w-4 h-4 mr-2" />
                Create Reservation
              </Button>
            ) : (
              <Button 
                className="btn-aurora"
                onClick={nextStep}
                disabled={!canProceed()}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
