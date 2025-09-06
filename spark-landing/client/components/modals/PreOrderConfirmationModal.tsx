import React, { useState, useEffect } from 'react';
import { getModalClasses, MODAL_CONFIGS } from '../../utils/modalSizes';
import { parseTimeToMinutes, computeSuggestedPrepStart, formatMinutesToTime } from '../../utils/time';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Separator } from '../ui/separator';
import {
  ShoppingCart,
  Calendar,
  Clock,
  Users,
  MapPin,
  Plus,
  Minus,
  ChefHat,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Star,
  User,
  Phone,
  Mail,
  Timer
} from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  prepTime: number; // in minutes
  popular?: boolean;
}

interface OrderItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

interface PreOrderConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  linkedReservationId: string;
  prefilledCustomer: Customer;
  reservationDate: string;
  reservationTime: string;
  onOrderCreated: (orderId: string) => void;
}

// Mock menu data - replace with actual API call
const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Grilled Salmon',
    description: 'Fresh Atlantic salmon with lemon herb butter',
    price: 28.99,
    category: 'Main Courses',
    prepTime: 20,
    popular: true
  },
  {
    id: '2',
    name: 'Ribeye Steak',
    description: '12oz prime ribeye with garlic mashed potatoes',
    price: 42.99,
    category: 'Main Courses',
    prepTime: 25,
    popular: true
  },
  {
    id: '3',
    name: 'Caesar Salad',
    description: 'Crisp romaine with parmesan and croutons',
    price: 12.99,
    category: 'Appetizers',
    prepTime: 10,
    popular: true
  },
  {
    id: '4',
    name: 'Chocolate Cake',
    description: 'Rich chocolate cake with vanilla frosting',
    price: 8.99,
    category: 'Desserts',
    prepTime: 5,
    popular: true
  },
  {
    id: '5',
    name: 'Pasta Carbonara',
    description: 'Creamy pasta with pancetta and parmesan',
    price: 22.99,
    category: 'Main Courses',
    prepTime: 18
  },
  {
    id: '6',
    name: 'Bruschetta',
    description: 'Toasted bread with fresh tomatoes and basil',
    price: 9.99,
    category: 'Appetizers',
    prepTime: 8
  }
];

export default function PreOrderConfirmationModal({
  isOpen,
  onClose,
  linkedReservationId,
  prefilledCustomer,
  reservationDate,
  reservationTime,
  onOrderCreated
}: PreOrderConfirmationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [specialRequests, setSpecialRequests] = useState('');
  const [estimatedPrepTime, setEstimatedPrepTime] = useState(0);

  // Initialize with popular items suggestion
  useEffect(() => {
    if (isOpen) {
      const popularItems = mockMenuItems.filter(item => item.popular);
      const initialItems: OrderItem[] = popularItems.slice(0, 2).map(item => ({
        id: `${item.id}-${Date.now()}`,
        menuItem: item,
        quantity: 1
      }));
      setOrderItems(initialItems);
      calculatePrepTime(initialItems);
    }
  }, [isOpen]);

  const calculatePrepTime = (items: OrderItem[]) => {
    if (items.length === 0) {
      setEstimatedPrepTime(0);
      return;
    }

    const maxPrepTime = Math.max(...items.map(item => item.menuItem.prepTime));
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    // Add buffer time based on number of items
    const bufferTime = Math.ceil(totalItems / 3) * 5; // 5 minutes buffer per 3 items
    setEstimatedPrepTime(maxPrepTime + bufferTime);
  };

  const addMenuItem = (menuItem: MenuItem) => {
    const existingItem = orderItems.find(item => item.menuItem.id === menuItem.id);

    if (existingItem) {
      updateQuantity(existingItem.id, existingItem.quantity + 1);
    } else {
      const newItem: OrderItem = {
        id: `${menuItem.id}-${Date.now()}`,
        menuItem,
        quantity: 1
      };
      const newItems = [...orderItems, newItem];
      setOrderItems(newItems);
      calculatePrepTime(newItems);
    }
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }

    const newItems = orderItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setOrderItems(newItems);
    calculatePrepTime(newItems);
  };

  const removeItem = (itemId: string) => {
    const newItems = orderItems.filter(item => item.id !== itemId);
    setOrderItems(newItems);
    calculatePrepTime(newItems);
  };

  const getTotalAmount = () => {
    return orderItems.reduce((total, item) =>
      total + (item.menuItem.price * item.quantity), 0
    );
  };

  const getReservationTimeInMinutes = () => {
    const minutes = parseTimeToMinutes(reservationTime);
    return minutes !== null ? minutes : 0;
  };

  const getSuggestedPrepTime = () => {
    return computeSuggestedPrepStart(reservationTime, 30, 0);
  };

  const formatTime = (minutes: number) => {
    return formatMinutesToTime(minutes);
  };

  const handleCreateOrder = async () => {
    if (orderItems.length === 0) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const orderId = `ORD-${Date.now()}`;
      onOrderCreated(orderId);
      onClose();

      // Reset form
      setOrderItems([]);
      setSpecialRequests('');
    } catch (error) {
      // TODO: Implement proper error handling with user feedback
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedPrepTime = getSuggestedPrepTime();
  const canMeetPrepTime = estimatedPrepTime <= (getReservationTimeInMinutes() - suggestedPrepTime);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden max-h-[85vh] overflow-y-auto">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white/30 to-indigo-50/50 dark:from-blue-950/20 dark:via-gray-900/30 dark:to-indigo-950/20 pointer-events-none" />
        
        <div className="relative p-5 lg:p-6">
          <DialogHeader className="mb-6 lg:mb-7">
            <div className="flex items-center gap-3 mb-2">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Star className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <div>
                <DialogTitle className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                  Add Pre-order for Reservation
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400 mt-0.5 text-sm">
                  Adding pre-order for <strong>{prefilledCustomer.name}</strong> - {new Date(reservationDate).toLocaleDateString()} at {reservationTime}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
          {/* Reservation Context */}
          <Card className="bg-gradient-to-r from-[#5B47FF]/5 to-[#7B6CFF]/5 border-[#5B47FF]/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#5B47FF]" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Linked Reservation Details
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(reservationDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric'
                    })} at {reservationTime}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card className="bg-gray-50/50 dark:bg-gray-800/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-[#5B47FF]" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">{prefilledCustomer.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{prefilledCustomer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{prefilledCustomer.phone}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Order Builder */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-[#5B47FF]" />
                Quick Order Builder
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Popular Items */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">Popular Items</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {mockMenuItems.filter(item => item.popular).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                        <p className="text-sm font-medium text-[#5B47FF]">${item.price.toFixed(2)}</p>
                      </div>
                      <Button
                        onClick={() => addMenuItem(item)}
                        size="sm"
                        className="bg-[#5B47FF] hover:bg-[#4A47E0] text-white"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Order */}
          {orderItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-[#5B47FF]" />
                  Current Order ({orderItems.length} items)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{item.menuItem.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">${item.menuItem.price.toFixed(2)} each</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            variant="outline"
                            size="sm"
                            className="w-8 h-8 p-0"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            variant="outline"
                            size="sm"
                            className="w-8 h-8 p-0"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>

                        <div className="text-right min-w-[80px]">
                          <p className="font-medium text-gray-900 dark:text-white">
                            ${(item.menuItem.price * item.quantity).toFixed(2)}
                          </p>
                        </div>

                        <Button
                          onClick={() => removeItem(item.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Separator />

                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900 dark:text-white">Total</span>
                    <span className="text-xl font-bold text-[#5B47FF]">${getTotalAmount().toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Prep Time Information */}
          {orderItems.length > 0 && (
            <Card className={canMeetPrepTime ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {canMeetPrepTime ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">Prep Time Estimate</h4>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm">
                        <strong>Estimated prep time:</strong> {estimatedPrepTime} minutes
                      </p>
                      <p className="text-sm">
                        <strong>Suggested start time:</strong> {formatTime(suggestedPrepTime)} ({Math.max(0, getReservationTimeInMinutes() - suggestedPrepTime)} minutes before reservation)
                      </p>
                      {canMeetPrepTime ? (
                        <p className="text-sm text-green-700 dark:text-green-300">
                          ✓ Order can be prepared in time for the reservation
                        </p>
                      ) : (
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                          ⚠ Consider adjusting order or start time for timely preparation
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Special Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-[#5B47FF]" />
                Special Requests (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Any special dietary requirements, allergies, or preparation instructions..."
                className="min-h-[80px]"
              />
            </CardContent>
          </Card>

          {/* Empty State */}
          {orderItems.length === 0 && (
            <Card className="bg-gray-50 dark:bg-gray-800/50 border-dashed">
              <CardContent className="p-8 text-center">
                <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">No Items Added</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Add some popular items above or browse the full menu to get started
                </p>
                <Button
                  onClick={() => document.querySelector('[data-menu-section]')?.scrollIntoView({ behavior: 'smooth' })}
                  variant="outline"
                  className="border-[#5B47FF] text-[#5B47FF] hover:bg-[#5B47FF] hover:text-white"
                >
                  Browse Full Menu
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

          {/* Action Buttons */}
          <div className="relative mt-6">
            <div className="flex items-center justify-between pt-6">
              <Button
                variant="ghost"
                onClick={onClose}
                className="px-6 py-3 h-auto text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 font-medium"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateOrder}
                disabled={orderItems.length === 0 || isLoading}
                className="px-8 py-3 h-auto bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:via-indigo-600 hover:to-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transform hover:scale-[1.02] font-semibold relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Order...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Create Pre-order
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
