import React, { useState, useEffect } from 'react';
import { getModalClasses, MODAL_CONFIGS } from '../../utils/modalSizes';
import { parseTimeToMinutes, formatMinutesToTime } from '../../utils/time';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import {
  Calendar,
  ShoppingCart,
  Clock,
  Users,
  MapPin,
  ChefHat,
  CheckCircle,
  AlertCircle,
  User,
  Phone,
  Mail,
  Lightbulb
} from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  prepTime?: number;
}

interface OrderData {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  total: number;
  estimatedPrepTime: number;
  specialRequests?: string;
}

interface Table {
  id: string;
  name: string;
  capacity: number;
  available: boolean;
}

interface TimeSlot {
  time: string;
  available: boolean;
  recommended?: boolean;
}

interface AddReservationConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  linkedOrderId: string;
  prefilledCustomer: Customer;
  onReservationCreated: (reservationId: string) => void;
}

// Mock data - replace with actual API calls
const mockTables: Table[] = [
  { id: '1', name: 'Table 1', capacity: 2, available: true },
  { id: '2', name: 'Table 2', capacity: 4, available: true },
  { id: '3', name: 'Table 3', capacity: 4, available: false },
  { id: '4', name: 'Table 4', capacity: 6, available: true },
  { id: '5', name: 'Table 5', capacity: 8, available: true },
  { id: '6', name: 'Table 6', capacity: 2, available: true }
];

const mockTimeSlots: TimeSlot[] = [
  { time: '17:00', available: true },
  { time: '17:30', available: true },
  { time: '18:00', available: false },
  { time: '18:30', available: true },
  { time: '19:00', available: true, recommended: true },
  { time: '19:30', available: true },
  { time: '20:00', available: false },
  { time: '20:30', available: true },
  { time: '21:00', available: true }
];

export default function AddReservationConfirmationModal({
  isOpen,
  onClose,
  linkedOrderId,
  prefilledCustomer,
  onReservationCreated
}: AddReservationConfirmationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTable, setSelectedTable] = useState('');
  const [partySize, setPartySize] = useState(4);
  const [specialRequests, setSpecialRequests] = useState('');
  const [availableTables, setAvailableTables] = useState<Table[]>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);

  // Mock order data - replace with actual API call
  useEffect(() => {
    if (isOpen && linkedOrderId) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        const mockOrder = {
          id: linkedOrderId,
          orderNumber: 'ORD-2024-001',
          items: [
            { id: '1', name: 'Grilled Salmon', quantity: 2, price: 28.99, prepTime: 20 },
            { id: '2', name: 'Caesar Salad', quantity: 1, price: 12.99, prepTime: 10 },
            { id: '3', name: 'Chocolate Cake', quantity: 1, price: 8.99, prepTime: 5 }
          ],
          total: 79.96,
          estimatedPrepTime: 25,
          specialRequests: 'Birthday celebration - please bring cake with candle'
        };

        setOrderData(mockOrder);

        // Set default date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setSelectedDate(tomorrow.toISOString().split('T')[0]);

        // Calculate suggested party size based on order
        const totalItems = mockOrder.items.reduce((sum: number, item: OrderItem) => sum + item.quantity, 0);
        const suggestedPartySize = Math.max(2, Math.min(8, totalItems));
        setPartySize(suggestedPartySize);

        setIsLoading(false);
      }, 1000);
    }
  }, [isOpen, linkedOrderId]);

  // Update available tables and times when date/party size changes
  useEffect(() => {
    if (selectedDate && partySize) {
      // Filter tables by capacity and availability
      const suitableTables = mockTables.filter(table =>
        table.capacity >= partySize && table.available
      );
      setAvailableTables(suitableTables);

      // Set available time slots
      setAvailableTimeSlots(mockTimeSlots);

      // Auto-select first available table if none selected
      if (!selectedTable && suitableTables.length > 0) {
        setSelectedTable(suitableTables[0].id);
      }
    }
  }, [selectedDate, partySize, selectedTable]);

  const getSuggestedTimeSlot = () => {
    if (!orderData?.estimatedPrepTime) return null;

    // Suggest time slot that allows enough prep time
    const prepTime = orderData.estimatedPrepTime;
    const recommendedSlot = availableTimeSlots.find(slot => {
      const slotMinutes = parseTimeToMinutes(slot.time);
      // Suggest slot that gives at least prep time + 30 minutes buffer
      return slot.available && slotMinutes !== null && slotMinutes >= (prepTime + 30);
    });

    return recommendedSlot || availableTimeSlots.find(slot => slot.available);
  };

  const getTableCapacityInfo = (tableId: string) => {
    const table = mockTables.find(t => t.id === tableId);
    return table;
  };

  const getOrderPrepTime = () => {
    if (!orderData?.estimatedPrepTime) return 0;
    return orderData.estimatedPrepTime;
  };

  const getSuggestedArrivalTime = () => {
    if (!selectedTime || !orderData?.estimatedPrepTime) return null;

    const reservationMinutes = parseTimeToMinutes(selectedTime);
    if (reservationMinutes === null) return null;

    const prepTime = orderData.estimatedPrepTime;

    // Suggest arrival time that allows for prep
    const suggestedArrival = Math.max(0, reservationMinutes - prepTime - 15); // 15 min buffer
    return formatMinutesToTime(suggestedArrival);
  };

  const handleCreateReservation = async () => {
    if (!selectedDate || !selectedTime || !selectedTable) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const reservationId = `RES-${Date.now()}`;
      onReservationCreated(reservationId);
      onClose();

      // Reset form
      setSelectedDate('');
      setSelectedTime('');
      setSelectedTable('');
      setPartySize(4);
      setSpecialRequests('');
    } catch (error) {
      // TODO: Implement proper error handling with user feedback
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedTimeSlot = getSuggestedTimeSlot();
  const suggestedArrivalTime = getSuggestedArrivalTime();
  const selectedTableInfo = getTableCapacityInfo(selectedTable);

  if (isLoading && !orderData) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden max-h-[85vh] overflow-y-auto ml-[132px]">
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5B47FF]"></div>
            <span className="ml-2">Loading order details...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden max-h-[85vh] overflow-y-auto ml-[132px]">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            Add Reservation for Order
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Adding reservation for <strong>{prefilledCustomer.name}</strong> - Order #{orderData?.orderNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Order Context */}
          <Card className="bg-gradient-to-r from-[#5B47FF]/5 to-[#7B6CFF]/5 border-[#5B47FF]/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5 text-[#5B47FF]" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    Linked Order Details
                  </p>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Order #{orderData?.orderNumber} • ${orderData?.total.toFixed(2)} • {orderData?.items.length} items
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Est. prep time: {getOrderPrepTime()} minutes
                    </p>
                  </div>
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

          {/* Reservation Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#5B47FF]" />
                Reservation Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Date Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Reservation Date
                  </Label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Party Size
                  </Label>
                  <Select value={partySize.toString()} onValueChange={(value) => setPartySize(Number(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 people</SelectItem>
                      <SelectItem value="3">3 people</SelectItem>
                      <SelectItem value="4">4 people</SelectItem>
                      <SelectItem value="5">5 people</SelectItem>
                      <SelectItem value="6">6 people</SelectItem>
                      <SelectItem value="7">7 people</SelectItem>
                      <SelectItem value="8">8 people</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Time Selection */}
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Reservation Time
                </Label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {availableTimeSlots.map((slot) => (
                    <Button
                      key={slot.time}
                      variant={selectedTime === slot.time ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTime(slot.time)}
                      disabled={!slot.available}
                      className={`relative ${
                        selectedTime === slot.time
                          ? 'bg-[#5B47FF] text-white'
                          : slot.recommended
                            ? 'border-[#5B47FF] text-[#5B47FF] hover:bg-[#5B47FF] hover:text-white'
                            : ''
                      }`}
                    >
                      {slot.time}
                      {slot.recommended && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#5B47FF] rounded-full"></div>
                      )}
                    </Button>
                  ))}
                </div>
                {suggestedTimeSlot && (
                  <p className="text-xs text-[#5B47FF] mt-2 flex items-center gap-1">
                    <Lightbulb className="w-3 h-3" />
                    Recommended: {suggestedTimeSlot.time} (allows sufficient prep time)
                  </p>
                )}
              </div>

              {/* Table Selection */}
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Table Selection
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableTables.map((table) => (
                    <Button
                      key={table.id}
                      variant={selectedTable === table.id ? "default" : "outline"}
                      onClick={() => setSelectedTable(table.id)}
                      className={`justify-start ${
                        selectedTable === table.id
                          ? 'bg-[#5B47FF] text-white'
                          : ''
                      }`}
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      {table.name} ({table.capacity} seats)
                    </Button>
                  ))}
                </div>
                {availableTables.length === 0 && (
                  <p className="text-sm text-orange-600 dark:text-orange-400 mt-2">
                    No tables available for {partySize} people on this date
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Smart Suggestions */}
          {(selectedTime || selectedTable) && (
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">Smart Suggestions</h4>
                    <div className="mt-2 space-y-2">
                      {selectedTime && suggestedArrivalTime && (
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          <strong>Suggested arrival time:</strong> {suggestedArrivalTime}
                          (allows {getOrderPrepTime()} min prep time + 15 min buffer)
                        </p>
                      )}
                      {selectedTableInfo && (
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          <strong>Table capacity:</strong> {selectedTableInfo.capacity} seats
                          {selectedTableInfo.capacity > partySize && ` (${selectedTableInfo.capacity - partySize} extra seats)`}
                        </p>
                      )}
                      {orderData?.specialRequests && (
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          <strong>Order notes:</strong> {orderData.specialRequests}
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
                placeholder="Any special seating preferences, dietary accommodations, or celebration notes..."
                className="min-h-[80px]"
              />
              {orderData?.specialRequests && (
                <p className="text-xs text-gray-500 mt-2">
                  Note: Order has special requests that will be communicated to the kitchen
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateReservation}
            disabled={!selectedDate || !selectedTime || !selectedTable || isLoading}
            className="bg-gradient-to-r from-[#5B47FF] to-[#7B6CFF] text-white hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Reservation...
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4 mr-2" />
                Create Reservation
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
