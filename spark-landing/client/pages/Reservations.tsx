// DashboardLayout removed - already wrapped by App.tsx routing
import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../hooks/use-toast';
import { useScrollY } from '../hooks/useScrollY';
import { 
  Search, 
  Filter, 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  BookOpen,
  Clock,
  Users,
  Phone,
  Mail,
  MapPin,
  Edit,
  Trash2,
  Plus,
  X,
  Bell,
  MessageSquare,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import BookTableModal from '../components/modals/BookTableModal';

interface Table {
  id: number;
  number: number;
  capacity: number;
  status: string;
  customer: string | null;
  time: string | null;
  type: string;
  location: string;
  isActive: boolean;
  features: string[];
  notes: string;
}

interface Reservation {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  partySize: number;
  tableId: number | null;
  tableType: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  specialRequests?: string;
  createdAt: string;
}

export default function Reservations() {
  const { toast } = useToast();
  
  // State management
  const [isCalendarCollapsed, setIsCalendarCollapsed] = useState(true); // Start collapsed
  const [isBookTableModalOpen, setIsBookTableModalOpen] = useState(false);
  const [isReservationDetailModalOpen, setIsReservationDetailModalOpen] = useState(false);
  const [isEditReservationModalOpen, setIsEditReservationModalOpen] = useState(false);
  const [isCancelReservationModalOpen, setIsCancelReservationModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date(2024, 7, 26)); // August 26, 2024
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 7, 1)); // August 1, 2024

  // Scroll behavior for floating notification bell
  const bellRef = useRef<HTMLDivElement>(null);
  const scrollY = useScrollY();

  // Mock notifications data
  const mockNotifications = [
    {
      id: '1',
      type: 'reservation_confirmed',
      title: 'Reservation Confirmed! 🎉',
      message: 'Your table for 4 people on August 26th at 7:00 PM has been confirmed.',
      time: '2 hours ago',
      isRead: false,
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      id: '2',
      type: 'table_ready',
      title: 'Table Ready! 🍽️',
      message: 'Your table is now ready. Please proceed to the host stand.',
      time: '5 minutes ago',
      isRead: false,
      icon: CheckCircle,
      color: 'text-blue-600'
    },
    {
      id: '3',
      type: 'special_offer',
      title: 'Special Offer! 💝',
      message: 'Happy Birthday! Enjoy 20% off your meal today.',
      time: '1 day ago',
      isRead: true,
      icon: MessageSquare,
      color: 'text-purple-600'
    },
    {
      id: '4',
      type: 'reminder',
      title: 'Upcoming Reservation ⏰',
      message: 'Reminder: Your reservation is tomorrow at 7:00 PM.',
      time: '2 days ago',
      isRead: true,
      icon: AlertCircle,
      color: 'text-orange-600'
    }
  ];

  const unreadCount = mockNotifications.filter(n => !n.isRead).length;

  // Function to show toast notifications
  const showNotificationToast = (type: 'success' | 'info' | 'warning' | 'error') => {
    const notifications = {
      success: {
        title: 'Reservation Confirmed! 🎉',
        description: 'Your table has been successfully booked for tomorrow at 7:00 PM.',
      },
      info: {
        title: 'Table Update 📍',
        description: 'Your table has been moved to a better location with a garden view.',
      },
      warning: {
        title: 'Reservation Reminder ⏰',
        description: 'Don\'t forget your reservation tomorrow at 7:00 PM!',
      },
      error: {
        title: 'Booking Issue ❌',
        description: 'There was an issue with your booking. Please contact support.',
      }
    };

    const notification = notifications[type];
    toast({
      title: notification.title,
      description: notification.description,
      duration: 5000,
    });
  };

  // Mock table data (same as in Tables.tsx)
  const mockTables: Table[] = [
    {
      id: 1,
      number: 1,
      capacity: 4,
      status: 'occupied',
      customer: 'John Smith',
      time: '45 min',
      type: 'Standard Table',
      location: 'Main Dining Room',
      isActive: true,
      features: ['WiFi', 'Charging'],
      notes: 'Window seat, great view'
    },
    {
      id: 2,
      number: 2,
      capacity: 2,
      status: 'available',
      customer: null,
      time: null,
      type: 'High Top',
      location: 'Bar Area',
      isActive: true,
      features: ['WiFi'],
      notes: 'Perfect for quick drinks'
    },
    {
      id: 3,
      number: 3,
      capacity: 6,
      status: 'reserved',
      customer: 'Sarah Johnson',
      time: '7:30 PM',
      type: 'Booth',
      location: 'Main Dining Room',
      isActive: true,
      features: ['Accessible', 'Charging'],
      notes: 'Family-friendly booth'
    },
    {
      id: 4,
      number: 4,
      capacity: 4,
      status: 'cleaning',
      customer: null,
      time: '5 min',
      type: 'Standard Table',
      location: 'Garden/Patio',
      isActive: true,
      features: ['Outdoor', 'View'],
      notes: 'Garden view, weather dependent'
    },
    {
      id: 5,
      number: 5,
      capacity: 8,
      status: 'available',
      customer: null,
      time: null,
      type: 'Chef\'s Table',
      location: 'Private Room 1',
      isActive: true,
      features: ['VIP', 'Premium View'],
      notes: 'Exclusive dining experience'
    },
    {
      id: 6,
      number: 6,
      capacity: 2,
      status: 'occupied',
      customer: 'Mike Davis',
      time: '20 min',
      type: 'Bar Seating',
      location: 'Bar Area',
      isActive: true,
      features: ['WiFi'],
      notes: 'Counter seating'
    }
  ];

  // Mock reservations data with table IDs
  const mockReservations: Reservation[] = [
    {
      id: '1',
      customerName: 'John Smith',
      email: 'john.smith@email.com',
      phone: '(555) 123-4567',
      date: '2024-08-26',
      time: '7:00 PM',
      partySize: 4,
      tableId: 1,
      tableType: 'Standard Table',
      status: 'confirmed',
      specialRequests: 'Window seat preferred',
      createdAt: '2024-08-20T10:00:00Z'
    },
    {
      id: '2',
      customerName: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '(555) 234-5678',
      date: '2024-08-26',
      time: '7:30 PM',
      partySize: 2,
      tableId: 2,
      tableType: 'High Top',
      status: 'pending',
      specialRequests: 'Quiet area if possible',
      createdAt: '2024-08-21T14:30:00Z'
    },
    {
      id: '3',
      customerName: 'Mike Davis',
      email: 'mike.davis@email.com',
      phone: '(555) 345-6789',
      date: '2024-08-26',
      time: '8:00 PM',
      partySize: 6,
      tableId: 3,
      tableType: 'Booth',
      status: 'confirmed',
      specialRequests: 'Birthday celebration',
      createdAt: '2024-08-22T09:15:00Z'
    },
    {
      id: '4',
      customerName: 'Emily Wilson',
      email: 'emily.w@email.com',
      phone: '(555) 456-7890',
      date: '2024-08-27',
      time: '6:30 PM',
      partySize: 3,
      tableId: 4,
      tableType: 'Standard Table',
      status: 'confirmed',
      createdAt: '2024-08-23T11:45:00Z'
    },
    {
      id: '5',
      customerName: 'David Brown',
      email: 'david.brown@email.com',
      phone: '(555) 567-8901',
      date: '2024-08-28',
      time: '8:30 PM',
      partySize: 5,
      tableId: 5,
      tableType: 'Chef\'s Table',
      status: 'pending',
      createdAt: '2024-08-24T16:20:00Z'
    }
  ];

  // Get available tables for a specific time and party size
  const getAvailableTables = (time: string, partySize: number) => {
    return mockTables.filter(table => 
      table.isActive && 
      table.capacity >= partySize && 
      (table.status === 'available' || table.status === 'cleaning')
    );
  };

  // Get table by ID
  const getTableById = (tableId: number) => {
    return mockTables.find(table => table.id === tableId);
  };

  // Filter reservations by selected date
  const getReservationsForDate = (dateString: string) => {
    return mockReservations.filter(r => r.date === dateString);
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const totalDays = 42; // 6 weeks * 7 days
    
    for (let i = 0; i < totalDays; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateString = currentDate.toISOString().split('T')[0];
      const reservations = getReservationsForDate(dateString);
      
      days.push({
        date: currentDate,
        dateString,
        isCurrentMonth: currentDate.getMonth() === month,
        isToday: dateString === new Date().toISOString().split('T')[0],
        isSelected: dateString === selectedDate.toISOString().split('T')[0],
        hasReservations: reservations.length > 0,
        reservationCount: reservations.length
      });
    }
    
    return days;
  };

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    if (date.getMonth() !== currentMonth.getMonth()) {
      setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    }
  };

  // Handle reservation actions
  const handleReservationClick = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsReservationDetailModalOpen(true);
  };

  const handleEditReservation = () => {
    setIsReservationDetailModalOpen(false);
    setIsEditReservationModalOpen(true);
  };

  const handleCancelReservation = () => {
    setIsReservationDetailModalOpen(false);
    setIsCancelReservationModalOpen(true);
  };

  const confirmCancelReservation = () => {
    // In a real app, this would update the database
    console.log('Cancelling reservation:', selectedReservation?.id);
    setIsCancelReservationModalOpen(false);
    setSelectedReservation(null);
  };

  // Get month name and year
  const getMonthYear = () => {
    return currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Get selected date reservations
  const selectedDateReservations = getReservationsForDate(selectedDate.toISOString().split('T')[0]);

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            📅 Booking Bay
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Lock the table, skip the wait.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search reservations..."
                className="pl-10 pr-4 py-2 w-64"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Notifications Button */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsNotificationsModalOpen(true)}
              className="relative"
            >
              <Bell className="w-4 h-4 mr-2" />
              Notifications
              {unreadCount > 0 && (
                <Badge className="ml-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0">
                  {unreadCount}
                </Badge>
              )}
            </Button>
            
            <Button 
              className="btn-aurora"
              onClick={() => setIsBookTableModalOpen(true)}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Book Table
            </Button>
          </div>
        </div>

        {/* Calendar Section */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                {getMonthYear()}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={goToToday}>
                  Today
                </Button>
                <Button variant="outline" size="sm" onClick={goToNextMonth}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsCalendarCollapsed(!isCalendarCollapsed)}
                  className="ml-2"
                >
                  {isCalendarCollapsed ? (
                    <>
                      <ChevronDown className="w-4 h-4 mr-1" />
                      Show Calendar
                    </>
                  ) : (
                    <>
                      <ChevronUp className="w-4 h-4 mr-1" />
                      Hide Calendar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          
          {!isCalendarCollapsed && (
            <CardContent>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
                
                {generateCalendarDays().map((day, index) => (
                  <div
                    key={index}
                    onClick={() => handleDateSelect(day.date)}
                    className={`p-2 h-16 border border-border rounded-lg relative cursor-pointer hover:bg-muted/50 transition-colors ${
                      !day.isCurrentMonth ? 'text-muted-foreground bg-muted/20' : ''
                    } ${
                      day.isSelected ? 'ring-2 ring-[#5B47FF] bg-[#5B47FF]/10' : ''
                    } ${
                      day.isToday ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700' : ''
                    }`}
                  >
                    {day.isCurrentMonth && (
                      <>
                        <span className={`text-sm font-medium ${
                          day.isToday ? 'text-blue-600 dark:text-blue-400' : ''
                        }`}>
                          {day.date.getDate()}
                        </span>
                        {day.hasReservations && (
                          <div className="absolute bottom-1 left-1 right-1">
                            <div className="flex gap-1 justify-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              {day.reservationCount > 1 && (
                                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Legend */}
              <div className="flex items-center gap-6 pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-muted-foreground">Confirmed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-muted-foreground">Pending</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-muted-foreground">Cancelled</span>
                </div>
              </div>
            </CardContent>
          )}
        </Card>



        {/* Selected Date Reservations */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Reservations for {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
              <Badge variant="secondary" className="ml-2">
                {selectedDateReservations.length} reservation{selectedDateReservations.length !== 1 ? 's' : ''}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateReservations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No reservations for this date</p>
                <p className="text-sm">Click "Book Table" to add a new reservation</p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedDateReservations.map((reservation) => {
                  const table = getTableById(reservation.tableId!);
                  return (
                    <div 
                      key={reservation.id} 
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => handleReservationClick(reservation)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <Clock className="w-5 h-5 text-muted-foreground mb-1" />
                          <p className="text-sm font-semibold">{reservation.time}</p>
                        </div>
                        <div>
                          <p className="font-medium">{reservation.customerName}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              Party of {reservation.partySize}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {table ? `Table ${table.number} (${table.type})` : reservation.tableType}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={
                          reservation.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                            : reservation.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        }>
                          {reservation.status}
                        </Badge>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Book Table Modal */}
      <BookTableModal 
        isOpen={isBookTableModalOpen} 
        onClose={() => setIsBookTableModalOpen(false)} 
      />

      {/* Reservation Detail Modal */}
      <Dialog open={isReservationDetailModalOpen} onOpenChange={setIsReservationDetailModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Reservation Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedReservation && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Customer Name</Label>
                  <p className="text-lg font-semibold">{selectedReservation.customerName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Party Size</Label>
                  <p className="text-lg font-semibold">{selectedReservation.partySize} people</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                  <p className="text-lg">{selectedReservation.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                  <p className="text-lg">{selectedReservation.phone}</p>
                </div>
              </div>

              {/* Reservation Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Date</Label>
                  <p className="text-lg">{new Date(selectedReservation.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Time</Label>
                  <p className="text-lg">{selectedReservation.time}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Table</Label>
                  <p className="text-lg">
                    {selectedReservation.tableId ? 
                      (() => {
                        const table = getTableById(selectedReservation.tableId!);
                        return table ? `Table ${table.number} - ${table.type} (${table.location})` : 'No table assigned';
                      })() 
                      : 'No table assigned'
                    }
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <Badge className={
                    selectedReservation.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800' 
                      : selectedReservation.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }>
                    {selectedReservation.status}
                  </Badge>
                </div>
              </div>

              {selectedReservation.specialRequests && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Special Requests</Label>
                  <p className="text-lg">{selectedReservation.specialRequests}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t">
                <Button 
                  onClick={handleEditReservation}
                  className="flex-1"
                  variant="outline"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Reservation
                </Button>
                <Button 
                  onClick={handleCancelReservation}
                  className="flex-1"
                  variant="destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Cancel Reservation
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Reservation Modal */}
      <Dialog open={isEditReservationModalOpen} onOpenChange={setIsEditReservationModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Edit Reservation
            </DialogTitle>
          </DialogHeader>
          
          {selectedReservation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-customer">Customer Name</Label>
                  <Input id="edit-customer" defaultValue={selectedReservation.customerName} />
                </div>
                <div>
                  <Label htmlFor="edit-party">Party Size</Label>
                  <Select defaultValue={selectedReservation.partySize.toString()}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(size => (
                        <SelectItem key={size} value={size.toString()}>
                          {size} {size === 1 ? 'person' : 'people'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-email">Email</Label>
                  <Input id="edit-email" type="email" defaultValue={selectedReservation.email} />
                </div>
                <div>
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input id="edit-phone" defaultValue={selectedReservation.phone} />
                </div>
                <div>
                  <Label htmlFor="edit-date">Date</Label>
                  <Input id="edit-date" type="date" defaultValue={selectedReservation.date} />
                </div>
                <div>
                  <Label htmlFor="edit-time">Time</Label>
                  <Select defaultValue={selectedReservation.time}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM'].map(time => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Table Selection */}
              <div>
                <Label htmlFor="edit-table">Table Assignment</Label>
                <Select defaultValue={selectedReservation.tableId?.toString() || ''}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a table" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No table assigned</SelectItem>
                    {getAvailableTables(selectedReservation.time, selectedReservation.partySize).map(table => (
                      <SelectItem key={table.id} value={table.id.toString()}>
                        Table {table.number} - {table.type} (Capacity: {table.capacity}, Location: {table.location})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-1">
                  Only showing tables that can accommodate your party size and are available at this time.
                </p>
              </div>

              <div>
                <Label htmlFor="edit-requests">Special Requests</Label>
                <Textarea 
                  id="edit-requests" 
                  defaultValue={selectedReservation.specialRequests || ''}
                  placeholder="Any special requests or notes..."
                />
              </div>

              <div className="flex items-center gap-3 pt-4 border-t">
                <Button 
                  onClick={() => setIsEditReservationModalOpen(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button className="flex-1">
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Reservation Confirmation Modal */}
      <Dialog open={isCancelReservationModalOpen} onOpenChange={setIsCancelReservationModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="w-5 h-5" />
              Cancel Reservation
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Are you sure you want to cancel the reservation for{' '}
              <span className="font-semibold">{selectedReservation?.customerName}</span> on{' '}
              <span className="font-semibold">
                {selectedReservation?.date && new Date(selectedReservation.date).toLocaleDateString()}
              </span>?
            </p>
            
            <p className="text-sm text-red-600 dark:text-red-400">
              This action cannot be undone.
            </p>

            <div className="flex items-center gap-3 pt-4">
              <Button 
                onClick={() => setIsCancelReservationModalOpen(false)}
                variant="outline"
                className="flex-1"
              >
                Keep Reservation
              </Button>
              <Button 
                onClick={confirmCancelReservation}
                variant="destructive"
                className="flex-1"
              >
                Cancel Reservation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notifications Modal */}
      <Dialog open={isNotificationsModalOpen} onOpenChange={setIsNotificationsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications Center
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-red-500 text-white">
                  {unreadCount} new
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {mockNotifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No notifications yet</p>
                <p className="text-sm">You'll see important updates here</p>
              </div>
            ) : (
              mockNotifications.map((notification) => {
                const IconComponent = notification.icon;
                return (
                  <div 
                    key={notification.id}
                    className={`p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer ${
                      !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 ${notification.color}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-foreground">
                            {notification.title}
                          </h4>
                          <span className="text-xs text-muted-foreground">
                            {notification.time}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                // Mark all as read logic would go here
                console.log('Mark all as read');
              }}
            >
              Mark all as read
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Floating Notification Button */}
      <div 
        ref={bellRef}
        className="fixed bottom-6 right-6 z-50"
        style={{
          transform: `translateY(${Math.min(scrollY * 0.25, 100)}px)`,
          transition: 'transform 0.1s ease-out'
        }}
        title={`Scroll Y: ${scrollY}, Transform: ${Math.min(scrollY * 0.25, 100)}px`}
      >
        {/* Debug indicator */}
        <div className="absolute -top-8 left-0 bg-red-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          Scroll: {scrollY}px
        </div>
        <Button
          onClick={() => setIsNotificationsModalOpen(true)}
          className="relative h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          <Bell className="w-6 h-6 text-white" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0 animate-pulse">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </div>
    </>
  );
}
