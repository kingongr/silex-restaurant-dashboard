import React, { useState, useEffect } from 'react';
import { getModalClasses, MODAL_CONFIGS } from '../../utils/modalSizes';
import { DashboardDialog, DashboardDialogContent, DashboardDialogHeader, DashboardDialogTitle, DashboardDialogDescription } from '../ui/dashboard-dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import {
  ShoppingCart,
  Calendar,
  Clock,
  Users,
  MapPin,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Star,
  ChefHat,
  User,
  Phone,
  Mail
} from 'lucide-react';
import ViewReservationDetailsModal from './ViewReservationDetailsModal';
import AddReservationConfirmationModal from './AddReservationConfirmationModal';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
  specialInstructions?: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface LinkedReservation {
  id: string;
  customerName: string;
  date: string;
  time: string;
  partySize: number;
  table?: string;
  status: string;
  specialRequests?: string;
}

interface ViewOrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  onReservationLinked?: (reservationId: string) => void;
}

interface OrderData {
  id: string;
  orderNumber: string;
  status: string;
  customer: Customer;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
  specialRequests?: string;
  createdAt: string;
  estimatedPrepTime: number;
}

export default function ViewOrderDetailsModal({
  isOpen,
  onClose,
  orderId,
  onReservationLinked
}: ViewOrderDetailsModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [linkedReservation, setLinkedReservation] = useState<LinkedReservation | null>(null);
  const [isViewReservationModalOpen, setIsViewReservationModalOpen] = useState(false);
  const [isAddReservationModalOpen, setIsAddReservationModalOpen] = useState(false);

  // Mock order data - replace with actual API call
  useEffect(() => {
    if (isOpen && orderId) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        const mockOrder = {
          id: orderId,
          orderNumber: 'ORD-2024-001',
          status: 'confirmed',
          customer: {
            id: '1',
            name: 'John Smith',
            email: 'john.smith@email.com',
            phone: '+1 (555) 123-4567'
          },
          items: [
            {
              id: '1',
              name: 'Grilled Salmon',
              quantity: 2,
              price: 28.99,
              image: '/placeholder-food.jpg',
              specialInstructions: 'Medium rare, no sauce on side'
            },
            {
              id: '2',
              name: 'Caesar Salad',
              quantity: 1,
              price: 12.99,
              image: '/placeholder-salad.jpg'
            },
            {
              id: '3',
              name: 'Chocolate Cake',
              quantity: 1,
              price: 8.99,
              image: '/placeholder-dessert.jpg'
            }
          ],
          subtotal: 79.96,
          tax: 7.20,
          tip: 15.99,
          total: 103.15,
          specialRequests: 'Birthday celebration - please bring cake with candle',
          createdAt: '2024-01-15T19:30:00Z',
          estimatedPrepTime: 25
        };

        // Mock linked reservation (50% chance of having one)
        const mockReservation = Math.random() > 0.5 ? {
          id: 'res-001',
          customerName: 'John Smith',
          date: '2024-01-15',
          time: '20:00',
          partySize: 4,
          table: 'Table 12',
          status: 'confirmed',
          specialRequests: 'Window seat preferred'
        } : null;

        setOrderData(mockOrder);
        setLinkedReservation(mockReservation);
        setIsLoading(false);
      }, 1000);
    }
  }, [isOpen, orderId]);

  const handleViewReservation = () => {
    setIsViewReservationModalOpen(true);
  };

  const handleAddReservation = () => {
    setIsAddReservationModalOpen(true);
  };

  const handleReservationLinked = (reservationId: string) => {
    // Refresh order data to show linked reservation
    setLinkedReservation({
      id: reservationId,
      customerName: orderData.customer.name,
      date: '2024-01-15', // Would come from the linked reservation
      time: '20:00',
      partySize: 4,
      table: 'Table 12',
      status: 'confirmed'
    });
    onReservationLinked?.(reservationId);
  };

  if (isLoading) {
    return (
      <DashboardDialog open={isOpen} onOpenChange={onClose}>
        <DashboardDialogContent className="max-w-3xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden max-h-[85vh] overflow-y-auto">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white/30 to-indigo-50/50 dark:from-blue-950/20 dark:via-gray-900/30 dark:to-indigo-950/20 pointer-events-none" />
          <div className="relative flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5B47FF]"></div>
            <span className="ml-2">Loading order details...</span>
          </div>
        </DashboardDialogContent>
      </DashboardDialog>
    );
  }

  if (!orderData) {
    return (
      <DashboardDialog open={isOpen} onOpenChange={onClose}>
        <DashboardDialogContent className="max-w-3xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden max-h-[85vh] overflow-y-auto">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white/30 to-indigo-50/50 dark:from-blue-950/20 dark:via-gray-900/30 dark:to-indigo-950/20 pointer-events-none" />
          <div className="relative text-center p-8">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium">Order Not Found</h3>
            <p className="text-gray-600 dark:text-gray-400">Unable to load order details.</p>
          </div>
        </DashboardDialogContent>
      </DashboardDialog>
    );
  }

  return (
    <>
      <DashboardDialog open={isOpen} onOpenChange={onClose}>
        <DashboardDialogContent className="max-w-3xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden max-h-[85vh] overflow-y-auto">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white/30 to-indigo-50/50 dark:from-blue-950/20 dark:via-gray-900/30 dark:to-indigo-950/20 pointer-events-none" />

          <div className="relative p-5 lg:p-6">
            <DashboardDialogHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <DashboardDialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                  Order #{orderData.orderNumber}
                </DashboardDialogTitle>
                <DashboardDialogDescription className="text-gray-600 dark:text-gray-400 mt-1">
                  Order placed on {new Date(orderData.createdAt).toLocaleDateString()}
                </DashboardDialogDescription>
              </div>

              {/* Status and Linked Badge */}
              <div className="flex items-center gap-2">
                <Badge
                  variant={orderData.status === 'confirmed' ? 'default' : 'secondary'}
                  className={
                    orderData.status === 'confirmed'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                  }
                >
                  {orderData.status}
                </Badge>

                {linkedReservation && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#7B6CFF] to-[#5B47FF] text-white text-sm font-medium">
                    <ShoppingCart className="w-4 h-4" />
                    <span>Order + Reservation</span>
                  </div>
                )}
              </div>
            </div>
          </DashboardDialogHeader>

          <div className="space-y-6 max-h-[60vh] overflow-y-auto">
            {/* Customer Information */}
            <Card className="bg-gray-50/50 dark:bg-gray-800/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-[#5B47FF]" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">{orderData.customer.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{orderData.customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{orderData.customer.phone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-[#5B47FF]" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderData.items.map((item: OrderItem) => (
                    <div key={item.id} className="flex items-start gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                        <ChefHat className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{item.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Quantity: {item.quantity} × ${item.price.toFixed(2)}
                            </p>
                            {item.specialInstructions && (
                              <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                                Note: {item.specialInstructions}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900 dark:text-white">
                              ${(item.quantity * item.price).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <Separator className="my-4" />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${orderData.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${orderData.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tip</span>
                    <span>${orderData.tip.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${orderData.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Special Requests */}
            {orderData.specialRequests && (
              <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <CardContent className="p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 dark:text-blue-100">Special Requests</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        {orderData.specialRequests}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Linked Reservation Section */}
            {linkedReservation ? (
              <Card className="bg-gradient-to-r from-[#5B47FF]/5 to-[#7B6CFF]/5 border-[#5B47FF]/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#5B47FF]" />
                    Linked Reservation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{new Date(linkedReservation.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{linkedReservation.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{linkedReservation.partySize} people</span>
                    </div>
                    {linkedReservation.table && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{linkedReservation.table}</span>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={handleViewReservation}
                    className="w-full bg-gradient-to-r from-[#5B47FF] to-[#7B6CFF] text-white hover:opacity-90"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Full Reservation
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gray-50 dark:bg-gray-800/50 border-dashed">
                <CardContent className="p-6 text-center">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">No Linked Reservation</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Link this order to a reservation for better coordination
                  </p>
                  <Button
                    onClick={handleAddReservation}
                    variant="outline"
                    className="border-[#5B47FF] text-[#5B47FF] hover:bg-[#5B47FF] hover:text-white"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Link to Reservation
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#5B47FF]" />
                  Order Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Order Placed</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(orderData.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Order Confirmed</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Estimated prep time: {orderData.estimatedPrepTime} minutes
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
          </div>
        </DashboardDialogContent>
      </DashboardDialog>

      {/* Linked Modals */}
      <ViewReservationDetailsModal
        isOpen={isViewReservationModalOpen}
        onClose={() => setIsViewReservationModalOpen(false)}
        reservationId={linkedReservation?.id || ''}
        linkedOrderId={orderId}
      />

      <AddReservationConfirmationModal
        isOpen={isAddReservationModalOpen}
        onClose={() => setIsAddReservationModalOpen(false)}
        linkedOrderId={orderId}
        prefilledCustomer={orderData.customer}
        onReservationCreated={handleReservationLinked}
      />
    </>
  );
}
