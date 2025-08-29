import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ShoppingCart, Plus, Minus, X, ChevronDown, ChevronUp, ArrowLeft, Check } from 'lucide-react';

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

type Step = 'create' | 'confirm';

export default function AddOrderModal({ isOpen, onClose, onAdd }: AddOrderModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>('create');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+1-US');
  const [selectedTable, setSelectedTable] = useState('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);

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

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Limit to 10 digits for US/CA format
    const limited = digits.slice(0, 10);
    
    // Format as XXX-XXX-XXXX
    if (limited.length >= 6) {
      return `${limited.slice(0, 3)}-${limited.slice(3, 6)}-${limited.slice(6)}`;
    } else if (limited.length >= 3) {
      return `${limited.slice(0, 3)}-${limited.slice(3)}`;
    }
    return limited;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setCustomerPhone(formatted);
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
    // Move to confirmation step
    setCurrentStep('confirm');
  };

  const handleConfirmOrder = () => {
    const orderData = {
      customerName,
      customerEmail,
      customerPhone: countryCodes.find(c => c.value === countryCode)?.code + ' ' + customerPhone,
      selectedTable,
      orderItems,
      total
    };
    
    console.log(orderData);
    
    // Call the onAdd callback if provided
    if (onAdd) {
      onAdd(orderData);
    }
    
    // Show success message briefly then close
    setTimeout(() => {
      handleCancel();
    }, 1000);
  };

  const handleBackToCreate = () => {
    setCurrentStep('create');
  };

  const handleCancel = () => {
    setCustomerName('');
    setCustomerEmail('');
    setCustomerPhone('');
    setCountryCode('+1-US');
    setSelectedTable('');
    setOrderItems([]);
    setSelectedMenuItem('');
    setIsCartOpen(false);
    setCurrentStep('create');
    onClose();
  };

  const getSelectedCountryCode = () => {
    return countryCodes.find(c => c.value === countryCode)?.code || '+1';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm md:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-0 overflow-hidden max-h-[90vh] modal-centered-content">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 pb-4 border-b border-gray-100 dark:border-gray-800">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#5B47FF] to-[#7B6CFF] rounded-xl flex items-center justify-center shadow-md">
                  {currentStep === 'confirm' ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <ShoppingCart className="w-5 h-5 text-white" />
                  )}
                </div>
                <div>
                  <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                    {currentStep === 'create' ? 'Add New Order' : 'Confirm Order'}
                  </DialogTitle>
                  <DialogDescription className="text-gray-600 dark:text-gray-400 text-sm">
                    {currentStep === 'create' 
                      ? 'Create a new order for a customer with menu items and table assignment.'
                      : 'Review and confirm the order details before submission.'
                    }
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6 max-h-[60vh]">
            {currentStep === 'create' ? (
              <form onSubmit={handleCreateOrder} className="space-y-6">
                {/* Customer Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Customer Name
                    </Label>
                    <Input
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter customer name"
                      className="w-full p-3 border-2 border-[#7B6CFF]/30 dark:border-[#7B6CFF]/20 rounded-xl focus:border-[#5B47FF] transition-colors duration-200 bg-gray-50 dark:bg-gray-800/50"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Email Address (Optional)
                    </Label>
                    <Input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="Enter email address"
                      className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-[#5B47FF] transition-colors duration-200 bg-gray-50 dark:bg-gray-800/50"
                    />
                  </div>
                </div>

                {/* Phone Number with Country Code */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Phone Number
                  </Label>
                  <div className="flex gap-2">
                    <Select value={countryCode} onValueChange={setCountryCode}>
                      <SelectTrigger className="w-32 p-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-[#5B47FF] transition-colors duration-200 bg-gray-50 dark:bg-gray-800/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {countryCodes.map((country) => (
                          <SelectItem key={country.value} value={country.value}>
                            <div className="flex items-center gap-2">
                              <span>{country.flag}</span>
                              <span>{country.code}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      value={customerPhone}
                      onChange={handlePhoneChange}
                      placeholder="XXX-XXX-XXXX"
                      className="flex-1 p-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-[#5B47FF] transition-colors duration-200 bg-gray-50 dark:bg-gray-800/50"
                      maxLength={12}
                    />
                  </div>
                </div>

                {/* Table Selection */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Table
                  </Label>
                  <Select value={selectedTable} onValueChange={setSelectedTable} required>
                    <SelectTrigger className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-[#5B47FF] transition-colors duration-200 bg-gray-50 dark:bg-gray-800/50">
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
                </div>

                {/* Menu Items Selection with Thumbnails */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                    Add Menu Items
                  </Label>
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-4 max-h-[40vh] overflow-y-auto pr-2">
                    {menuItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-200 cursor-pointer"
                        onClick={() => {
                          setSelectedMenuItem(item.id);
                          setTimeout(() => addMenuItem(), 100);
                        }}
                      >
                        <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs text-gray-500">IMG</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 dark:text-white truncate">{item.name}</div>
                          <div className="text-[#5B47FF] dark:text-[#7B6CFF] font-medium">${item.price}</div>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          className="bg-gradient-to-r from-[#5B47FF] to-[#7B6CFF] hover:opacity-90 text-white rounded-lg px-3 py-2 flex-shrink-0"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Collapsible Order Summary Bar */}
                <Collapsible open={isCartOpen} onOpenChange={setIsCartOpen}>
                  <CollapsibleTrigger asChild>
                    <div className="w-full bg-gradient-to-r from-[#5B47FF] to-[#7B6CFF] rounded-xl p-4 cursor-pointer hover:opacity-90 transition-opacity duration-200">
                      <div className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-3">
                          <ShoppingCart className="w-5 h-5" />
                          <span className="font-semibold">Order Summary</span>
                          {orderItems.length > 0 && (
                            <Badge variant="secondary" className="bg-white/20 text-white">
                              {totalItems} item{totalItems !== 1 ? 's' : ''}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          {orderItems.length > 0 && (
                            <span className="font-semibold">${total.toFixed(2)}</span>
                          )}
                          {isCartOpen ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </div>
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="mt-4">
                    <div className="bg-gradient-to-br from-[#5B47FF]/5 to-[#7B6CFF]/5 dark:from-[#5B47FF]/10 dark:to-[#7B6CFF]/10 rounded-xl border border-[#7B6CFF]/30 dark:border-[#7B6CFF]/20 p-4">
                      {orderItems.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                          <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-30" />
                          <p className="font-medium">No items added yet</p>
                          <p className="text-sm">Select items from the menu</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="max-h-64 overflow-y-auto space-y-2">
                            {orderItems.map((item) => (
                              <div key={item.id} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                                  <span className="text-xs text-gray-500">IMG</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-gray-900 dark:text-white text-sm truncate">{item.name}</div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">${item.price.toFixed(2)} each</div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateQuantity(item.id, -1)}
                                    className="h-7 w-7 p-0 rounded"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </Button>
                                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateQuantity(item.id, 1)}
                                    className="h-7 w-7 p-0 rounded"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                </div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white min-w-[60px] text-right">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeItem(item.id)}
                                  className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                          
                          <div className="border-t border-[#7B6CFF]/30 dark:border-[#7B6CFF]/20 pt-3 mt-3">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-gray-900 dark:text-white">Total:</span>
                              <span className="text-xl font-bold text-[#5B47FF] dark:text-[#7B6CFF]">${total.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Action Buttons - Inside Form */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleCancel}
                    className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="px-8 py-2 bg-gradient-to-r from-[#5B47FF] to-[#7B6CFF] text-white rounded-xl hover:opacity-90 transition-opacity duration-200 shadow-lg"
                    disabled={orderItems.length === 0}
                  >
                    Review Order
                  </Button>
                </div>
              </form>
            ) : (
              /* Confirmation Screen */
              <div className="space-y-6">
                {/* Order Summary */}
                <div className="bg-gradient-to-r from-[#5B47FF]/5 to-[#7B6CFF]/5 dark:from-[#5B47FF]/10 dark:to-[#7B6CFF]/10 rounded-xl p-6 border border-[#7B6CFF]/30 dark:border-[#7B6CFF]/20">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h3>
                  
                  {/* Customer Details */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Customer:</span>
                      <p className="font-medium text-gray-900 dark:text-white">{customerName}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Table:</span>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedTable}</p>
                    </div>
                    {customerPhone && (
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Phone:</span>
                        <p className="font-medium text-gray-900 dark:text-white">{getSelectedCountryCode()}{customerPhone}</p>
                      </div>
                    )}
                    {customerEmail && (
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Email:</span>
                        <p className="font-medium text-gray-900 dark:text-white">{customerEmail}</p>
                      </div>
                    )}
                  </div>

                  {/* Order Items */}
                  <div className="border-t border-[#7B6CFF]/30 dark:border-[#7B6CFF]/20 pt-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Items Ordered:</h4>
                    <div className="space-y-2">
                      {orderItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between bg-white dark:bg-gray-800/50 rounded-lg p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                              <span className="text-xs text-gray-500">IMG</span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity}</div>
                            </div>
                          </div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-[#7B6CFF]/30 dark:border-[#7B6CFF]/20">
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">Total:</span>
                      <span className="text-2xl font-bold text-[#5B47FF] dark:text-[#7B6CFF]">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBackToCreate}
                    className="px-6 py-2 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Edit
                  </Button>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleCancel}
                      className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleConfirmOrder}
                      className="px-8 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:opacity-90 transition-opacity duration-200 shadow-lg"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Confirm Order
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
