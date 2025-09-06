import React, { useState, useEffect } from 'react';
import { DashboardDialog, DashboardDialogContent, DashboardDialogHeader, DashboardDialogTitle, DashboardDialogDescription } from '../ui/dashboard-dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import {
  Calendar,
  ShoppingCart,
  Clock,
  Users,
  MapPin,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Star,
  User,
  Phone,
  Mail,
  ChefHat,
  Sparkles
} from 'lucide-react';
import ViewOrderDetailsModal from './ViewOrderDetailsModal';
import PreOrderConfirmationModal from './PreOrderConfirmationModal';

interface LinkedOrder {
  id: string;
  orderNumber: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: string;
  specialRequests?: string;
  createdAt: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface ViewReservationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservationId: string;
  linkedOrderId?: string;
  onOrderLinked?: (orderId: string) => void;
}

export default function ViewReservationDetailsModal({
  isOpen,
  onClose,
  reservationId,
  linkedOrderId,
  onOrderLinked
}: ViewReservationDetailsModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [reservationData, setReservationData] = useState<any>(null);
  const [linkedOrder, setLinkedOrder] = useState<LinkedOrder | null>(null);
  const [isViewOrderModalOpen, setIsViewOrderModalOpen] = useState(false);
  const [isAddOrderModalOpen, setIsAddOrderModalOpen] = useState(false);

  // Mock reservation data - replace with actual API call
  useEffect(() => {
    if (isOpen && reservationId) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        const mockReservation = {
          id: reservationId,
          reservationNumber: 'RES-2024-001',
          status: 'confirmed',
          customer: {
            id: '1',
            name: 'Sarah Johnson',
            email: 'sarah.johnson@email.com',
            phone: '+1 (555) 987-6543'
          },
          date: '2024-01-20',
          time: '19:30',
          partySize: 4,
          table: 'Table 8',
          duration: 120, // minutes
          specialRequests: 'Window seat, birthday celebration',
          createdAt: '2024-01-18T14:30:00Z'
        };

        // Mock linked order - use provided linkedOrderId or create random one
        let mockOrder = null;
        if (linkedOrderId || Math.random() > 0.4) { // 60% chance of having a linked order
          mockOrder = {
            id: linkedOrderId || 'order-001',
            orderNumber: 'ORD-2024-001',
            status: 'confirmed',
            items: [
              {
                id: '1',
                name: 'Grilled Salmon',
                quantity: 2,
                price: 28.99
              },
              {
                id: '2',
                name: 'Caesar Salad',
                quantity: 1,
                price: 12.99
              },
              {
                id: '3',
                name: 'Chocolate Cake',
                quantity: 1,
                price: 8.99
              }
            ],
            total: 79.96,
            specialRequests: 'Birthday celebration - please bring cake with candle',
            createdAt: '2024-01-18T15:00:00Z'
          };
        }

        setReservationData(mockReservation);
        setLinkedOrder(mockOrder);
        setIsLoading(false);
      }, 1000);
    }
  }, [isOpen, reservationId, linkedOrderId]);

  const handleViewOrder = () => {
    setIsViewOrderModalOpen(true);
  };

  const handleAddOrder = () => {
    setIsAddOrderModalOpen(true);
  };

  const handleOrderLinked = (orderId: string) => {
    // Refresh reservation data to show linked order
    setLinkedOrder({
      id: orderId,
      orderNumber: 'ORD-2024-NEW',
      status: 'confirmed',
      items: [],
      total: 0,
      createdAt: new Date().toISOString()
    });
    onOrderLinked?.(orderId);
  };

  if (isLoading) {
    return (
      <DashboardDialog open={isOpen} onOpenChange={onClose}>
        <DashboardDialogContent className="max-w-3xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden max-h-[85vh] overflow-y-auto">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white/30 to-purple-50/50 dark:from-indigo-950/20 dark:via-gray-900/30 dark:to-purple-950/20 pointer-events-none" />

          <div className="relative flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading reservation details...</span>
          </div>
        </DashboardDialogContent>
      </DashboardDialog>
    );
  }

  if (!reservationData) {
    return (
      <DashboardDialog open={isOpen} onOpenChange={onClose}>
        <DashboardDialogContent className="max-w-3xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden max-h-[85vh] overflow-y-auto">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 via-white/30 to-pink-50/50 dark:from-red-950/20 dark:via-gray-900/30 dark:to-pink-950/20 pointer-events-none" />

          <div className="relative text-center p-8">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Reservation Not Found</h3>
            <p className="text-gray-600 dark:text-gray-400">Unable to load reservation details.</p>
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
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white/30 to-purple-50/50 dark:from-indigo-950/20 dark:via-gray-900/30 dark:to-purple-950/20 pointer-events-none" />

          <div className="relative p-5 lg:p-6">
            {/* Enhanced Header */}
            <DashboardDialogHeader className="mb-6 lg:mb-7">
              <div className="flex items-center gap-3 mb-2">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>
                <div>
                  <DashboardDialogTitle className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                    Reservation #{reservationData.reservationNumber}
                  </DashboardDialogTitle>
                  <DashboardDialogDescription className="text-gray-600 dark:text-gray-400 mt-0.5 text-sm">
                    Reservation created on {new Date(reservationData.createdAt).toLocaleDateString()}
                  </DashboardDialogDescription>
                </div>
              </div>

              {/* Status and Linked Badge */}
              <div className="flex items-center gap-2">
                <Badge
                  variant={reservationData.status === 'confirmed' ? 'default' : 'secondary'}
                  className={
                    reservationData.status === 'confirmed'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                  }
                >
                  {reservationData.status}
                </Badge>

                {linkedOrder && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-medium shadow-lg shadow-emerald-500/25">
                    <Calendar className="w-4 h-4" />
                    <span>Reservation + Pre-order</span>
                  </div>
                )}
              </div>
            </DashboardDialogHeader>

            <div className="space-y-6">
              {/* Customer Information */}
              <div className="group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Customer Information</h3>
                </div>

                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">{reservationData.customer.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{reservationData.customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{reservationData.customer.phone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
              </div>

              {/* Reservation Details */}
              <div className="group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Reservation Details</h3>
                </div>

                <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                  <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Date</p>
                        <p className="font-medium">{new Date(reservationData.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Time</p>
                        <p className="font-medium">{reservationData.time} ({reservationData.duration} min)</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Party Size</p>
                        <p className="font-medium">{reservationData.partySize} people</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Table</p>
                        <p className="font-medium">{reservationData.table}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                {reservationData.specialRequests && (
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900 dark:text-blue-100">Special Requests</h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                          {reservationData.specialRequests}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
              </div>

              {/* Linked Order Section */}
              {linkedOrder ? (
                <div className="group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                      <ShoppingCart className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pre-order Details</h3>
                  </div>

                  <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                    <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Order #{linkedOrder.orderNumber}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Placed on {new Date(linkedOrder.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                      >
                        {linkedOrder.status}
                      </Badge>
                    </div>

                    {/* Order Items Summary */}
                    {linkedOrder.items.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">Order Items</h4>
                        <div className="space-y-1">
                          {linkedOrder.items.slice(0, 3).map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{item.quantity}× {item.name}</span>
                              <span>${(item.quantity * item.price).toFixed(2)}</span>
                            </div>
                          ))}
                          {linkedOrder.items.length > 3 && (
                            <p className="text-sm text-gray-500">
                              +{linkedOrder.items.length - 3} more items
                            </p>
                          )}
                        </div>
                        <Separator />
                        <div className="flex justify-between font-medium">
                          <span>Total</span>
                          <span>${linkedOrder.total.toFixed(2)}</span>
                        </div>
                      </div>
                    )}

                    {/* Special Requests */}
                    {linkedOrder.specialRequests && (
                      <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                        <p className="text-sm text-orange-700 dark:text-orange-300">
                          <strong>Note:</strong> {linkedOrder.specialRequests}
                        </p>
                      </div>
                    )}

                    <Button
                      onClick={handleViewOrder}
                      className="w-full bg-gradient-to-r from-[#5B47FF] to-[#7B6CFF] text-white hover:opacity-90"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Full Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gray-50 dark:bg-gray-800/50 border-dashed">
                <CardContent className="p-6 text-center">
                  <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">No Pre-order Linked</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Add a pre-order to prepare food for this reservation
                  </p>
                  <Button
                    onClick={handleAddOrder}
                    variant="outline"
                    className="border-[#5B47FF] text-[#5B47FF] hover:bg-[#5B47FF] hover:text-white"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add Pre-order
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Reservation Timeline */}
            <div className="group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/25">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Reservation Timeline</h3>
              </div>

              <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Reservation Created</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(reservationData.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Reservation Confirmed</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Table {reservationData.table} assigned
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-indigo-500 flex items-center justify-center">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Reservation Date</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(reservationData.date).toLocaleDateString()} at {reservationData.time}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="px-6 py-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </DashboardDialogContent>
      </DashboardDialog>

      {/* Linked Modals */}
      <ViewOrderDetailsModal
        isOpen={isViewOrderModalOpen}
        onClose={() => setIsViewOrderModalOpen(false)}
        orderId={linkedOrder?.id || ''}
        onReservationLinked={onOrderLinked}
      />

      <PreOrderConfirmationModal
        isOpen={isAddOrderModalOpen}
        onClose={() => setIsAddOrderModalOpen(false)}
        linkedReservationId={reservationId}
        prefilledCustomer={reservationData?.customer}
        reservationDate={reservationData?.date}
        reservationTime={reservationData?.time}
        onOrderCreated={handleOrderLinked}
      />
    </>
  );
}
