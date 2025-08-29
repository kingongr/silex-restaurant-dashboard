// DashboardLayout removed - already wrapped by App.tsx routing
import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useScrollY } from '@/hooks/useScrollY';
import { Plus, Search, Filter, Users, MapPin, Settings, Edit, X, ChevronDown, ChevronUp, Bell } from 'lucide-react';
import AddTableModal from '@/components/modals/AddTableModal';

export default function Tables() {
  const [isAddTableModalOpen, setIsAddTableModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [isTableDetailsModalOpen, setIsTableDetailsModalOpen] = useState(false);
  const [isEditTableModalOpen, setIsEditTableModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [tableToDelete, setTableToDelete] = useState<any>(null);
  const [isFloorPlanCollapsed, setIsFloorPlanCollapsed] = useState(true); // Start collapsed
  
  // Scroll behavior for floating notification bell
  const bellRef = useRef<HTMLDivElement>(null);
  const scrollY = useScrollY();

  // Mock notifications data for table management
  const mockTableNotifications = [
    {
      id: '1',
      type: 'table_occupied',
      title: 'Table 3 Occupied! 🍽️',
      message: 'Table 3 has been occupied by Sarah Johnson. Reservation time: 7:30 PM.',
      time: '15 minutes ago',
      isRead: false,
      priority: 'medium'
    },
    {
      id: '2',
      type: 'table_cleaning',
      title: 'Table 4 Cleaning Complete! ✨',
      message: 'Table 4 has been cleaned and is now available for new customers.',
      time: '5 minutes ago',
      isRead: false,
      priority: 'high'
    },
    {
      id: '3',
      type: 'reservation_reminder',
      title: 'Upcoming Reservation! ⏰',
      message: 'Table 5 has a reservation in 30 minutes. Please ensure it\'s ready.',
      time: '1 hour ago',
      isRead: true,
      priority: 'medium'
    },
    {
      id: '4',
      type: 'table_maintenance',
      title: 'Table Maintenance Alert! 🔧',
      message: 'Table 2 requires maintenance. Please schedule a technician.',
      time: '2 hours ago',
      isRead: true,
      priority: 'low'
    }
  ];

  const unreadCount = mockTableNotifications.filter(n => !n.isRead).length;

  // Mock table data
  const mockTables = [
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

  const handleTableClick = (table: any) => {
    setSelectedTable(table);
    setIsTableDetailsModalOpen(true);
  };

  const handleEditTable = (table: any) => {
    setSelectedTable(table);
    setIsEditTableModalOpen(true);
    setIsTableDetailsModalOpen(false);
  };

  const handleDeleteTable = (table: any) => {
    setTableToDelete(table);
    setIsDeleteConfirmOpen(true);
    setIsTableDetailsModalOpen(false);
  };

  const confirmDeleteTable = () => {
    if (tableToDelete) {
      console.log('Deleting table:', tableToDelete.number);
      // In a real app, this would call an API
      setIsDeleteConfirmOpen(false);
      setTableToDelete(null);
    }
  };

  const handleStatusChange = (table: any, newStatus: string) => {
    // Update the table status in the mock data
    const updatedTables = mockTables.map(t => 
      t.id === table.id ? { ...t, status: newStatus } : t
    );
    
    // Update the selected table state to reflect the change
    setSelectedTable(prev => prev ? { ...prev, status: newStatus } : null);
    
    // In a real app, this would call an API to update the database
    console.log(`Table ${table.number} status changed from ${table.status} to ${newStatus}`);
    
    // Show success feedback (in a real app, this would be a toast notification)
    // For now, we'll just log it
    console.log(`✅ Table ${table.number} is now ${newStatus}`);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🎯 Table Tactician
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Assign, swap, and split like a pro.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search tables..."
                className="pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-aurora-500 focus:border-transparent"
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
            
            <Button variant="outline" size="sm">
              <MapPin className="w-4 h-4 mr-2" />
              Floor Plan
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
            <Button 
              className="btn-aurora"
              onClick={() => setIsAddTableModalOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Table
            </Button>
          </div>
        </div>

        {/* Table Status Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-body-small text-muted-foreground">Available</p>
                  <p className="text-heading-3 font-bold">6 tables</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div>
                  <p className="text-body-small text-muted-foreground">Occupied</p>
                  <p className="text-heading-3 font-bold">12 tables</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div>
                  <p className="text-body-small text-muted-foreground">Reserved</p>
                  <p className="text-heading-3 font-bold">3 tables</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <div>
                  <p className="text-body-small text-muted-foreground">Cleaning</p>
                  <p className="text-heading-3 font-bold">2 tables</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Restaurant Floor Plan */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Restaurant Floor Plan
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsFloorPlanCollapsed(!isFloorPlanCollapsed)}
              >
                {isFloorPlanCollapsed ? (
                  <>
                    <ChevronDown className="w-4 h-4 mr-1" />
                    Show Floor Plan
                  </>
                ) : (
                  <>
                    <ChevronUp className="w-4 h-4 mr-1" />
                    Hide Floor Plan
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          {!isFloorPlanCollapsed && (
            <CardContent>
              <div className="bg-muted/20 rounded-lg p-8 min-h-96 relative">
                {/* Floor Plan Grid */}
                <div className="grid grid-cols-6 gap-8 h-full">
                  {Array.from({ length: 18 }, (_, i) => {
                    const tableNumber = i + 1;
                    const statuses = ['available', 'occupied', 'reserved', 'cleaning'];
                    const status = statuses[Math.floor(Math.random() * statuses.length)];
                    const capacity = [2, 4, 6, 8][Math.floor(Math.random() * 4)];
                    
                    const getStatusColor = (status: string) => {
                      switch (status) {
                        case 'available': return 'bg-green-500';
                        case 'occupied': return 'bg-red-500';
                        case 'reserved': return 'bg-yellow-500';
                        case 'cleaning': return 'bg-gray-500';
                        default: return 'bg-gray-300';
                      }
                    };
                    
                    return (
                      <div
                        key={tableNumber}
                        className={`
                          relative w-16 h-16 rounded-full border-4 border-white shadow-lg cursor-pointer
                          hover:scale-110 transition-transform duration-200 flex items-center justify-center
                          ${getStatusColor(status)}
                        `}
                        title={`Table ${tableNumber} - ${status} - ${capacity} seats`}
                      >
                        <span className="text-white font-bold text-sm">{tableNumber}</span>
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                          <Badge variant="secondary" className="text-xs">
                            {capacity}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Areas Labels */}
                <div className="absolute top-4 left-4">
                  <Badge variant="outline">Main Dining</Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge variant="outline">Bar Area</Badge>
                </div>
                <div className="absolute bottom-4 right-4">
                  <Badge variant="outline">Patio</Badge>
                </div>
              </div>
              
              {/* Legend */}
              <div className="flex items-center gap-6 mt-6 pt-6 border-t border-border">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-body-small">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="text-body-small">Occupied</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <span className="text-body-small">Reserved</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                  <span className="text-body-small">Cleaning</span>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Table List */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Table Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTables.map((table) => (
                <div 
                  key={table.id} 
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleTableClick(table)}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        table.status === 'available' ? 'bg-green-500' :
                        table.status === 'occupied' ? 'bg-red-500' :
                        table.status === 'reserved' ? 'bg-yellow-500' :
                        'bg-gray-500'
                      }`}></div>
                      <div>
                        <span className="text-lg font-semibold text-gray-900">Table {table.number}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {table.type}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {table.location}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{table.capacity} seats</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {table.customer && (
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{table.customer}</p>
                        <p className="text-sm text-gray-600">{table.time}</p>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Badge className={
                        table.status === 'available' ? 'bg-green-100 text-green-800 border-green-200' :
                        table.status === 'occupied' ? 'bg-red-100 text-red-800 border-red-200' :
                        table.status === 'reserved' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                        'bg-gray-100 text-gray-800 border-gray-200'
                      }>
                        {table.status}
                      </Badge>
                      {table.features.length > 0 && (
                        <div className="flex gap-1">
                          {table.features.slice(0, 2).map((feature, index) => (
                            <div key={index} className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          ))}
                          {table.features.length > 2 && (
                            <span className="text-xs text-gray-500">+{table.features.length - 2}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Add Table Modal */}
      <AddTableModal 
        isOpen={isAddTableModalOpen} 
        onClose={() => setIsAddTableModalOpen(false)} 
      />

      {/* Table Details Modal */}
      <Dialog open={isTableDetailsModalOpen} onOpenChange={setIsTableDetailsModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader className="pb-4">
            <DialogTitle className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              Table {selectedTable?.number} Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedTable && (
            <div className="space-y-4">
              {/* Table Header - Better spacing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Card className="border-2 border-gray-100">
                  <CardContent className="p-3">
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-gray-800">
                      <Users className="w-4 h-4 text-blue-600" />
                      Table Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Number:</span>
                        <span className="font-medium">Table {selectedTable.number}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium">{selectedTable.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Capacity:</span>
                        <span className="font-medium">{selectedTable.capacity} seats</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium">{selectedTable.location}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-2 border-gray-100">
                  <CardContent className="p-3">
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-gray-800">
                      <MapPin className="w-4 h-4 text-green-600" />
                      Current Status
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <Badge className={
                          selectedTable.status === 'available' ? 'bg-green-100 text-green-800 border-green-200' :
                          selectedTable.status === 'occupied' ? 'bg-red-100 text-red-800 border-red-200' :
                          selectedTable.status === 'reserved' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                          'bg-gray-100 text-gray-800 border-gray-200'
                        }>
                          {selectedTable.status}
                        </Badge>
                      </div>
                      {selectedTable.customer && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Customer:</span>
                            <span className="font-medium">{selectedTable.customer}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Time:</span>
                            <span className="font-medium">{selectedTable.time}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Features and Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Card className="border-2 border-gray-100">
                  <CardContent className="p-3">
                    <h4 className="font-semibold mb-3 text-gray-800">Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTable.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-2 border-gray-100">
                  <CardContent className="p-3">
                    <h4 className="font-semibold mb-3 text-gray-800">Notes</h4>
                    <div className="min-h-[2.5rem] flex items-center">
                      <p className="text-sm text-gray-700">
                        {selectedTable.notes || 'No special notes'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Status Management */}
              <Card className="border-2 border-gray-100">
                <CardContent className="p-3">
                  <h4 className="font-semibold mb-3 text-gray-800">Quick Status Change</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <Button
                      variant={selectedTable.status === 'available' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleStatusChange(selectedTable, 'available')}
                      className={`h-10 ${
                        selectedTable.status === 'available' 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'hover:bg-green-50'
                      }`}
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Available
                    </Button>
                    
                    <Button
                      variant={selectedTable.status === 'occupied' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleStatusChange(selectedTable, 'occupied')}
                      className={`h-10 ${
                        selectedTable.status === 'occupied' 
                          ? 'bg-red-600 hover:bg-red-700' 
                          : 'hover:bg-red-50'
                      }`}
                    >
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                      Occupied
                    </Button>
                    
                    <Button
                      variant={selectedTable.status === 'reserved' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleStatusChange(selectedTable, 'reserved')}
                      className={`h-10 ${
                        selectedTable.status === 'reserved' 
                          ? 'bg-yellow-600 hover:bg-yellow-700' 
                          : 'hover:bg-yellow-50'
                      }`}
                    >
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                      Reserved
                    </Button>
                    
                    <Button
                      variant={selectedTable.status === 'cleaning' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleStatusChange(selectedTable, 'cleaning')}
                      className={`h-10 ${
                        selectedTable.status === 'cleaning' 
                          ? 'bg-gray-600 hover:bg-gray-700' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
                      Cleaning
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Click any status button to instantly update the table status
                  </p>
                </CardContent>
              </Card>

              {/* Actions - Better spacing and alignment */}
              <div className="flex justify-end gap-3 pt-2 border-t border-gray-200">
                <Button 
                  variant="outline" 
                  onClick={() => setIsTableDetailsModalOpen(false)}
                  className="px-6"
                >
                  Close
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleEditTable(selectedTable)}
                  className="px-6"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => handleDeleteTable(selectedTable)}
                  className="px-6"
                >
                  <X className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                <X className="w-4 h-4 text-white" />
              </div>
              Delete Table
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete <strong>Table {tableToDelete?.number}</strong>? 
              This action cannot be undone.
            </p>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={confirmDeleteTable}
            >
              Delete Table
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notifications Modal */}
      <Dialog open={isNotificationsModalOpen} onOpenChange={setIsNotificationsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Table Management Notifications
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-red-500 text-white">
                  {unreadCount} new
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {mockTableNotifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No notifications yet</p>
                <p className="text-sm">You'll see important table updates here</p>
              </div>
            ) : (
              mockTableNotifications.map((notification) => {
                const priorityColors = {
                  high: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700',
                  medium: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700',
                  low: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                };
                
                const priorityIcons = {
                  high: '🔴',
                  medium: '🟡',
                  low: '🔵'
                };
                
                return (
                  <div 
                    key={notification.id}
                    className={`p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer ${
                      !notification.isRead ? priorityColors[notification.priority as keyof typeof priorityColors] : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1 text-lg">
                        {priorityIcons[notification.priority as keyof typeof priorityColors]}
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
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {notification.priority} priority
                          </Badge>
                        </div>
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
          className="relative h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
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
