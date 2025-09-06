import React, { useState } from 'react';
import { getModalClasses, MODAL_CONFIGS } from '../../utils/modalSizes';
import {
  validateRequired,
  getRequiredError,
  validateEmail,
  getEmailError,
  validatePhoneNumber,
  getPhoneError,
  formatPhoneNumber,
  getPhoneMaxLength,
  getPhoneMetadata
} from '../../utils/validation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ShoppingCart, Plus, Minus, X, ChevronDown, ChevronUp, ArrowLeft, Check, Calendar, Sparkles, User, Phone, MapPin, Utensils } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import AddReservationConfirmationModal from './AddReservationConfirmationModal';

interface AddOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (orderData: any) => void;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

type Step = 'create' | 'confirm' | 'reservation';

export default function AddOrderModal({ isOpen, onClose, onAdd }: AddOrderModalProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<Step>('create');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerPhoneDigits, setCustomerPhoneDigits] = useState('');
  const [countryCode, setCountryCode] = useState('+1-US');
  const [selectedTable, setSelectedTable] = useState('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string>('');

  const countryCodes = [
    { code: '+1', country: 'US', flag: '🇺🇸', value: '+1-US' },
    { code: '+1', country: 'CA', flag: '🇨🇦', value: '+1-CA' },
    { code: '+44', country: 'UK', flag: '🇬🇧', value: '+44-UK' },
    { code: '+33', country: 'FR', flag: '🇫🇷', value: '+33-FR' },
    { code: '+49', country: 'DE', flag: '🇩🇪', value: '+49-DE' },
    { code: '+81', country: 'JP', flag: '🇯🇵', value: '+81-JP' },
  ];

  const tables = [
    'Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5', 'Table 6',
    'Table 7', 'Table 8', 'Table 9', 'Table 10', 'Table 11', 'Table 12'
  ];

  const menuItems = [
    { id: '1', name: 'Classic Burger', price: 12.99, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop&crop=center' },
    { id: '2', name: 'Caesar Salad', price: 9.99, image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=100&h=100&fit=crop&crop=center' },
    { id: '3', name: 'Grilled Chicken', price: 16.99, image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=100&h=100&fit=crop&crop=center' },
    { id: '4', name: 'Pasta Carbonara', price: 14.99, image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=100&h=100&fit=crop&crop=center' },
    { id: '5', name: 'Fish & Chips', price: 18.99, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=100&h=100&fit=crop&crop=center' },
    { id: '6', name: 'Margherita Pizza', price: 13.99, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=100&h=100&fit=crop&crop=center' }
  ];

  // Get phone metadata for current country
  const getCurrentPhoneMetadata = () => {
    return getPhoneMetadata(countryCode);
  };

  // Handle country code change - reformat phone number
  const handleCountryCodeChange = (newCountryCode: string) => {
    setCountryCode(newCountryCode);

    // If we have raw digits, reformat them for the new country
    if (customerPhoneDigits) {
      const newFormatted = formatPhoneNumber(customerPhoneDigits, newCountryCode);
      setCustomerPhone(newFormatted);

      // Adjust digits if the new country has different digit count
      const newMetadata = getPhoneMetadata(newCountryCode);
      const adjustedDigits = customerPhoneDigits.slice(0, newMetadata.digitCount);
      setCustomerPhoneDigits(adjustedDigits);

      // Reformat with adjusted digits
      if (adjustedDigits !== customerPhoneDigits) {
        const adjustedFormatted = formatPhoneNumber(adjustedDigits, newCountryCode);
        setCustomerPhone(adjustedFormatted);
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Validate required fields
    if (!validateRequired(customerName)) {
      newErrors.customerName = getRequiredError(customerName, 'Customer name');
    }
    
    if (!validateRequired(customerPhone)) {
      newErrors.customerPhone = getRequiredError(customerPhone, 'Phone number');
    } else if (!validatePhoneNumber(customerPhone, countryCode)) {
      newErrors.customerPhone = getPhoneError(customerPhone, countryCode);
    }
    
    if (customerEmail && !validateEmail(customerEmail)) {
      newErrors.customerEmail = getEmailError(customerEmail);
    }
    
    if (!validateRequired(selectedTable)) {
      newErrors.selectedTable = getRequiredError(selectedTable, 'Table selection');
    }
    
    if (orderItems.length === 0) {
      newErrors.orderItems = 'Please add at least one menu item to the order';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const digits = inputValue.replace(/\D/g, '');

    // Get current country's metadata
    const metadata = getCurrentPhoneMetadata();

    // Limit digits to country's maximum
    const limitedDigits = digits.slice(0, metadata.digitCount);

    // Format the digits according to country pattern
    const formatted = formatPhoneNumber(inputValue, countryCode);

    // Update both formatted display and raw digits
    setCustomerPhone(formatted);
    setCustomerPhoneDigits(limitedDigits);
  };

  const addMenuItem = () => {
    if (!selectedMenuItem) return;
    
    const menuItem = menuItems.find(item => item.id === selectedMenuItem);
    if (!menuItem) return;

    const existingItem = orderItems.find(item => item.id === selectedMenuItem);
    if (existingItem) {
      setOrderItems(orderItems.map(item => 
        item.id === selectedMenuItem 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setOrderItems([...orderItems, {
        id: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: 1,
        image: menuItem.image
      }]);
    }
    setSelectedMenuItem('');
    
    // Auto-open cart when first item is added
    if (orderItems.length === 0) {
      setIsCartOpen(true);
    }
  };

  const updateQuantity = (id: string, change: number) => {
    setOrderItems(orderItems.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(0, item.quantity + change);
        return newQuantity === 0 ? null : { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(Boolean) as OrderItem[]);
  };

  const removeItem = (id: string) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
  };

  const total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before proceeding
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before proceeding.",
        variant: "destructive",
      });
      return;
    }
    
    // Move to confirmation step
    setCurrentStep('confirm');
  };

  const handleConfirmOrder = () => {
    const orderData = {
      customerName,
      customerEmail,
      customerPhone: countryCodes.find(c => c.value === countryCode)?.code + ' ' + customerPhone,
      customerPhoneDigits, // Include raw digits for backend processing
      selectedTable,
      orderItems,
      total
    };
    
    // Generate a mock order ID
    const orderId = `ORD-${Date.now()}`;
    setCreatedOrderId(orderId);

    // Call the onAdd callback if provided
    if (onAdd) {
      onAdd(orderData);
    }
    
    // Show success toast
    toast({
      title: "Order Created Successfully!",
      description: `Order for ${customerName} has been created and assigned to ${selectedTable}.`,
      variant: "default",
    });
    
    // Move to reservation step
    setCurrentStep('reservation');
  };

  const handleBackToCreate = () => {
    setCurrentStep('create');
  };

  const handleCancel = () => {
    setCustomerName('');
    setCustomerEmail('');
    setCustomerPhone('');
    setCustomerPhoneDigits('');
    setCountryCode('+1-US');
    setSelectedTable('');
    setOrderItems([]);
    setSelectedMenuItem('');
    setIsCartOpen(false);
    setCurrentStep('create');
    setErrors({});
    setCreatedOrderId('');
    setIsReservationModalOpen(false);
    onClose();
  };

  const handleAddReservation = () => {
    setIsReservationModalOpen(true);
  };

  const handleReservationCreated = (reservationId: string) => {
    toast({
      title: "Reservation Linked Successfully!",
      description: `Reservation has been linked to order ${createdOrderId}.`,
      variant: "default",
    });
    setIsReservationModalOpen(false);
    handleCancel();
  };

  const handleSkipReservation = () => {
    handleCancel();
  };

  const getSelectedCountryCode = () => {
    return countryCodes.find(c => c.value === countryCode)?.code || '+1';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden max-h-[85vh] overflow-y-auto ml-[132px]">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-white/30 to-indigo-50/50 dark:from-purple-950/20 dark:via-gray-900/30 dark:to-indigo-950/20 pointer-events-none" />

        <div className="relative p-5 lg:p-6">
          {/* Enhanced Header */}
          <DialogHeader className="mb-6 lg:mb-7">
            <div className="flex items-center gap-3 mb-2">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                  {currentStep === 'confirm' ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : currentStep === 'reservation' ? (
                    <Calendar className="w-5 h-5 text-white" />
                  ) : (
                    <ShoppingCart className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <div>
                <DialogTitle className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                  {currentStep === 'create' ? 'Add New Order' : currentStep === 'confirm' ? 'Confirm Order' : 'Order Complete'}
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400 mt-0.5 text-sm">
                  {currentStep === 'create'
                    ? 'Create a new order for a customer with menu items and table assignment'
                    : currentStep === 'confirm'
                      ? 'Review and confirm the order details before submission'
                      : 'Order created successfully! Link to a reservation if needed'
                  }
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {currentStep === 'create' ? (
              <form onSubmit={handleCreateOrder}>
                {/* Customer Information Section */}
                <div className="group">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Customer Information</h3>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="customerName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Customer Name *
                      </Label>
                      <Input
                        id="customerName"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Enter customer name"
                        className={`w-full h-11 bg-white/90 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 ${
                          errors.customerName ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                        }`}
                        required
                      />
                      {errors.customerName && (
                        <p className="text-sm text-red-500 mt-1">{errors.customerName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customerEmail" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email Address
                      </Label>
                      <Input
                        id="customerEmail"
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="Enter email address"
                        className={`w-full h-11 bg-white/90 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 ${
                          errors.customerEmail ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                        }`}
                      />
                      {errors.customerEmail && (
                        <p className="text-sm text-red-500 mt-1">{errors.customerEmail}</p>
                      )}
                    </div>
                  </div>

                  {/* Phone Number Section */}
                  <div className="space-y-2">
                    <Label htmlFor="customerPhone" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Phone Number *
                    </Label>
                    <div className="flex gap-3">
                      <Select value={countryCode} onValueChange={handleCountryCodeChange}>
                        <SelectTrigger className="w-32 h-11 bg-white/90 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {countryCodes.map((country) => (
                            <SelectItem key={country.value} value={country.value}>
                              <div className="flex items-center gap-3">
                                <span className="text-lg">{country.flag}</span>
                                <span className="font-medium">{country.code}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        id="customerPhone"
                        value={customerPhone}
                        onChange={handlePhoneChange}
                        placeholder={getCurrentPhoneMetadata().placeholder}
                        className={`flex-1 h-11 bg-white/90 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 ${
                          errors.customerPhone ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                        }`}
                        maxLength={getPhoneMaxLength(countryCode)}
                      />
                    </div>
                    {errors.customerPhone && (
                      <p className="text-sm text-red-500 mt-1">{errors.customerPhone}</p>
                    )}
                  </div>

                  {/* Table Selection Section */}
                  <div className="space-y-2">
                    <Label htmlFor="selectedTable" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Table *
                    </Label>
                    <Select value={selectedTable} onValueChange={setSelectedTable} required>
                      <SelectTrigger className={`w-full h-11 bg-white/90 dark:bg-gray-800/60 border rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 ${
                        errors.selectedTable
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        <SelectValue placeholder="Select a table" />
                      </SelectTrigger>
                      <SelectContent>
                        {tables.map((table) => (
                          <SelectItem key={table} value={table}>
                            {table}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.selectedTable && (
                      <p className="text-sm text-red-500 mt-1">{errors.selectedTable}</p>
                    )}
                  </div>
                </div>

                {/* Menu Items Selection Section */}
                <div className="group">
                  <div className="flex items-center gap-2 mb-4">
                    <Utensils className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Menu Selection</h3>
                  </div>

                  {errors.orderItems && (
                    <p className="text-sm text-red-500 mb-4">{errors.orderItems}</p>
                  )}
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-6 max-h-[50vh] overflow-y-auto pr-2">
                    {menuItems.map((item) => (
                      <div
                        key={item.id}
                        className="group flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white/90 dark:bg-gray-800/60 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                        onClick={() => {
                          setSelectedMenuItem(item.id);
                          setTimeout(() => addMenuItem(), 100);
                        }}
                      >
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">IMG</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 dark:text-white truncate text-sm">{item.name}</div>
                          <div className="text-purple-600 dark:text-purple-400 font-semibold">${item.price.toFixed(2)}</div>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-lg p-2 flex-shrink-0 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-200 group-hover:scale-105"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Collapsible Order Summary Bar */}
                <Collapsible open={isCartOpen} onOpenChange={setIsCartOpen}>
                  <CollapsibleTrigger asChild>
                    <div className="w-full bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 rounded-xl p-5 cursor-pointer hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200 group">
                      <div className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                            <ShoppingCart className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-lg">Order Summary</span>
                          {orderItems.length > 0 && (
                            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                              {totalItems} item{totalItems !== 1 ? 's' : ''}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          {orderItems.length > 0 && (
                            <span className="font-bold text-xl">${total.toFixed(2)}</span>
                          )}
                          {isCartOpen ? (
                            <ChevronUp className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          ) : (
                            <ChevronDown className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          )}
                        </div>
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="mt-6">
                    <div className="bg-gradient-to-br from-purple-50/50 via-indigo-50/30 to-blue-50/50 dark:from-purple-950/20 dark:via-indigo-950/10 dark:to-blue-950/20 rounded-xl border-2 border-purple-200/50 dark:border-purple-700/30 p-6 shadow-sm">
                      {orderItems.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShoppingCart className="w-8 h-8 opacity-40" />
                          </div>
                          <p className="font-semibold text-lg mb-2">No items added yet</p>
                          <p className="text-sm">Select items from the menu above</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="max-h-80 overflow-y-auto space-y-3">
                            {orderItems.map((item) => (
                              <div key={item.id} className="flex items-center gap-4 p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
                                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center flex-shrink-0">
                                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">IMG</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-semibold text-gray-900 dark:text-white truncate mb-1">{item.name}</div>
                                  <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">${item.price.toFixed(2)} each</div>
                                </div>
                                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 rounded-lg p-1">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => updateQuantity(item.id, -1)}
                                    className="h-8 w-8 p-0 rounded-lg hover:bg-white dark:hover:bg-gray-600"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </Button>
                                  <span className="w-10 text-center text-sm font-bold">{item.quantity}</span>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => updateQuantity(item.id, 1)}
                                    className="h-8 w-8 p-0 rounded-lg hover:bg-white dark:hover:bg-gray-600"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </Button>
                                </div>
                                <div className="text-lg font-bold text-gray-900 dark:text-white min-w-[70px] text-right">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeItem(item.id)}
                                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>

                          <div className="border-t-2 border-purple-200 dark:border-purple-700 pt-4 mt-6">
                            <div className="flex justify-between items-center">
                              <span className="text-lg font-bold text-gray-900 dark:text-white">Total:</span>
                              <span className="text-3xl font-black text-purple-600 dark:text-purple-400">${total.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Action Buttons - Inside Form */}
                <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleCancel}
                    className="px-8 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 rounded-xl font-semibold"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 hover:from-purple-600 hover:via-indigo-600 hover:to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200 shadow-lg shadow-purple-500/25 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={orderItems.length === 0}
                  >
                    <Check className="w-5 h-5 mr-2" />
                    Review Order
                  </Button>
                </div>
              </form>
            ) : currentStep === 'confirm' ? (
              /* Confirmation Screen */
              <div className="space-y-8">
                {/* Order Summary Section */}
                <div className="group">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Order Summary</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Review all order details before confirming</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-teal-50/50 dark:from-green-950/20 dark:via-emerald-950/10 dark:to-teal-950/20 rounded-xl p-8 border-2 border-green-200/50 dark:border-green-700/30 shadow-sm">
                    {/* Customer Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                      <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4 border border-green-200 dark:border-green-700">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="w-4 h-4 text-green-600 dark:text-green-400" />
                          <span className="text-sm font-semibold text-green-700 dark:text-green-300">Customer</span>
                        </div>
                        <p className="font-bold text-gray-900 dark:text-white text-lg">{customerName}</p>
                      </div>
                      <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4 border border-green-200 dark:border-green-700">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-4 h-4 text-green-600 dark:text-green-400" />
                          <span className="text-sm font-semibold text-green-700 dark:text-green-300">Table</span>
                        </div>
                        <p className="font-bold text-gray-900 dark:text-white text-lg">{selectedTable}</p>
                      </div>
                      {customerPhone && (
                        <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4 border border-green-200 dark:border-green-700">
                          <div className="flex items-center gap-2 mb-2">
                            <Phone className="w-4 h-4 text-green-600 dark:text-green-400" />
                            <span className="text-sm font-semibold text-green-700 dark:text-green-300">Phone</span>
                          </div>
          <p className="font-bold text-gray-900 dark:text-white">
            {getSelectedCountryCode()} {customerPhone}
          </p>
                        </div>
                      )}
                      {customerEmail && (
                        <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4 border border-green-200 dark:border-green-700">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-semibold text-green-700 dark:text-green-300">Email</span>
                          </div>
                          <p className="font-bold text-gray-900 dark:text-white">{customerEmail}</p>
                        </div>
                      )}
                    </div>

                    {/* Order Items */}
                    <div className="border-t-2 border-green-200 dark:border-green-700 pt-6">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-lg flex items-center gap-2">
                        <Utensils className="w-5 h-5 text-green-600 dark:text-green-400" />
                        Items Ordered
                      </h4>
                      <div className="space-y-3">
                        {orderItems.map((item) => (
                          <div key={item.id} className="flex items-center justify-between bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">IMG</span>
                              </div>
                              <div>
                                <div className="font-bold text-gray-900 dark:text-white">{item.name}</div>
                                <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">Qty: {item.quantity} × ${item.price.toFixed(2)}</div>
                              </div>
                            </div>
                            <div className="font-bold text-gray-900 dark:text-white text-lg">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center mt-6 pt-4 border-t-2 border-green-200 dark:border-green-700 bg-green-50/50 dark:bg-green-950/20 rounded-lg p-4">
                        <span className="text-xl font-bold text-gray-900 dark:text-white">Total:</span>
                        <span className="text-4xl font-black text-green-600 dark:text-green-400">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBackToCreate}
                    className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 rounded-xl font-semibold"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Edit
                  </Button>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleCancel}
                      className="px-8 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 rounded-xl font-semibold"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleConfirmOrder}
                      className="px-8 py-3 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all duration-200 shadow-lg shadow-green-500/25 font-semibold"
                    >
                      <Check className="w-5 h-5 mr-2" />
                      Confirm Order
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              /* Reservation Step */
              <div className="space-y-8">
                {/* Success Message */}
                <div className="group">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Order Created Successfully!</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Order #{createdOrderId} has been created and is ready for service</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-teal-50/50 dark:from-green-950/20 dark:via-emerald-950/10 dark:to-teal-950/20 rounded-xl p-8 border-2 border-green-200/50 dark:border-green-700/30 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                        <Check className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-green-800 dark:text-green-200 mb-1">Order #{createdOrderId}</h4>
                        <p className="text-green-700 dark:text-green-300 font-medium">Created for {customerName} at {selectedTable}</p>
                        <p className="text-green-600 dark:text-green-400 text-sm mt-1">Total: ${total.toFixed(2)} • {totalItems} item{totalItems !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Link to Reservation */}
                <div className="group">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Create Reservation</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Link this order to a reservation for better customer experience</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50/50 via-indigo-50/30 to-blue-50/50 dark:from-purple-950/20 dark:via-indigo-950/10 dark:to-blue-950/20 rounded-xl p-8 border-2 border-purple-200/50 dark:border-purple-700/30 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                      <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">Customer</span>
                        </div>
                        <p className="font-bold text-gray-900 dark:text-white">{customerName}</p>
                      </div>
                      <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">Table</span>
                        </div>
                        <p className="font-bold text-gray-900 dark:text-white">{selectedTable}</p>
                      </div>
                      <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">Order Total</span>
                        </div>
                        <p className="font-bold text-gray-900 dark:text-white text-lg">${total.toFixed(2)}</p>
                      </div>
                      <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                        <div className="flex items-center gap-2 mb-2">
                          <Utensils className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">Items</span>
                        </div>
                        <p className="font-bold text-gray-900 dark:text-white">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Create a reservation to ensure the table is held for your customer
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSkipReservation}
                    className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 rounded-xl font-semibold"
                  >
                    Skip for Now
                  </Button>
                  <Button
                    onClick={handleAddReservation}
                    className="px-8 py-3 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 hover:from-purple-600 hover:via-indigo-600 hover:to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200 shadow-lg shadow-purple-500/25 font-semibold"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Create Reservation
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>

      {/* Add Reservation Confirmation Modal */}
      <AddReservationConfirmationModal
        isOpen={isReservationModalOpen}
        onClose={() => setIsReservationModalOpen(false)}
        linkedOrderId={createdOrderId}
        prefilledCustomer={{
          id: 'temp-customer',
          name: customerName,
          email: customerEmail,
          phone: customerPhoneDigits // Use raw digits for backend processing
        }}
        onReservationCreated={handleReservationCreated}
      />
    </Dialog>
  );
}
