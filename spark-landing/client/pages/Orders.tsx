import { useState, useRef, useEffect } from 'react';
// DashboardLayout removed - already wrapped by App.tsx routing
import AddOrderModal from '@/components/modals/AddOrderModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Plus, 
  Search, 
  Download, 
  RefreshCcw, 
  ShoppingCart,
  Clock,
  User,
  MapPin,
  Phone,
  Edit,
  Trash2,
  Check,
  X,
  AlertCircle,
  Timer,
  ChefHat,
  DollarSign,
  Bell
} from 'lucide-react';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
  status: 'pending' | 'preparing' | 'ready';
}

interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  table: number | null;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'paid' | 'cancelled';
  createdAt: Date;
  estimatedTime: number;
  staff: string;
  paymentMethod?: string;
  notes?: string;
}

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-001',
    customer: {
      name: 'John Smith',
      phone: '(555) 123-4567',
      email: 'john@email.com'
    },
    table: 5,
    items: [
      { id: '1', name: 'Grilled Salmon', quantity: 1, price: 28.99, status: 'ready' },
      { id: '2', name: 'Caesar Salad', quantity: 1, price: 14.99, status: 'ready' }
    ],
    subtotal: 43.98,
    tax: 3.52,
    total: 47.50,
    status: 'ready',
    createdAt: new Date(Date.now() - 25 * 60000), // 25 minutes ago
    estimatedTime: 30,
    staff: 'Alice Johnson',
    notes: 'Extra lemon on the side'
  },
  {
    id: '2',
    orderNumber: 'ORD-002',
    customer: {
      name: 'Sarah Wilson',
      phone: '(555) 987-6543'
    },
    table: 12,
    items: [
      { id: '3', name: 'Ribeye Steak', quantity: 1, price: 42.99, status: 'preparing' },
      { id: '4', name: 'Craft Beer', quantity: 2, price: 8.99, status: 'ready' }
    ],
    subtotal: 60.97,
    tax: 4.88,
    total: 65.85,
    status: 'preparing',
    createdAt: new Date(Date.now() - 15 * 60000), // 15 minutes ago
    estimatedTime: 25,
    staff: 'Bob Martinez'
  },
  {
    id: '3',
    orderNumber: 'ORD-003',
    customer: {
      name: 'Mike Davis',
      phone: '(555) 456-7890'
    },
    table: 3,
    items: [
      { id: '5', name: 'Quinoa Buddha Bowl', quantity: 2, price: 19.99, status: 'pending' },
      { id: '6', name: 'Fresh Juice', quantity: 2, price: 6.99, status: 'pending' }
    ],
    subtotal: 53.96,
    tax: 4.32,
    total: 58.28,
    status: 'confirmed',
    createdAt: new Date(Date.now() - 5 * 60000), // 5 minutes ago
    estimatedTime: 20,
    staff: 'Carol Lee'
  },
  {
    id: '4',
    orderNumber: 'ORD-004',
    customer: {
      name: 'Emma Johnson',
      phone: '(555) 321-0987'
    },
    table: null, // takeout
    items: [
      { id: '7', name: 'Chocolate Cake', quantity: 1, price: 12.99, status: 'ready' }
    ],
    subtotal: 12.99,
    tax: 1.04,
    total: 14.03,
    status: 'paid',
    createdAt: new Date(Date.now() - 45 * 60000), // 45 minutes ago
    estimatedTime: 15,
    staff: 'David Chen',
    paymentMethod: 'Credit Card'
  }
];

const statusConfig = {
  pending: { color: 'bg-gray-100 text-gray-800', icon: Clock },
  confirmed: { color: 'bg-blue-100 text-blue-800', icon: Check },
  preparing: { color: 'bg-yellow-100 text-yellow-800', icon: ChefHat },
  ready: { color: 'bg-green-100 text-green-800', icon: Check },
  served: { color: 'bg-purple-100 text-purple-800', icon: Check },
  paid: { color: 'bg-emerald-100 text-emerald-800', icon: Check },
  cancelled: { color: 'bg-red-100 text-red-800', icon: X }
};

export default function Orders() {
  // Mock menu items for adding to orders
  const mockMenuItems = [
    { id: 'item1', name: 'Margherita Pizza', price: 18.99, category: 'Pizza' },
    { id: 'item2', name: 'Pepperoni Pizza', price: 20.99, category: 'Pizza' },
    { id: 'item3', name: 'Caesar Salad', price: 12.99, category: 'Salads' },
    { id: 'item4', name: 'Garlic Bread', price: 6.99, category: 'Sides' },
    { id: 'item5', name: 'Chicken Wings', price: 15.99, category: 'Appetizers' },
    { id: 'item6', name: 'Pasta Carbonara', price: 16.99, category: 'Pasta' },
    { id: 'item7', name: 'Tiramisu', price: 8.99, category: 'Desserts' },
    { id: 'item8', name: 'Soft Drink', price: 3.99, category: 'Beverages' }
  ];

  const [isAddOrderModalOpen, setIsAddOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const isProcessingRef = useRef(false);

  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);

  // Mock notifications data for orders
  const mockOrderNotifications = [
    {
      id: '1',
      type: 'new_order',
      title: 'New Order Received! 🚀',
      message: 'Order #ORD-001 for Table 5 has been placed. Total: $47.50',
      time: '2 minutes ago',
      isRead: false,
      priority: 'high',
      orderId: '1'
    },
    {
      id: '2',
      type: 'order_ready',
      title: 'Order Ready for Pickup! ✅',
      message: 'Order #ORD-002 is ready to be served to Table 12',
      time: '5 minutes ago',
      isRead: false,
      priority: 'medium',
      orderId: '2'
    },
    {
      id: '3',
      type: 'order_delayed',
      title: 'Order Delayed ⚠️',
      message: 'Order #ORD-003 is running behind schedule. Consider updating customer.',
      time: '15 minutes ago',
      isRead: true,
      priority: 'high',
      orderId: '3'
    },
    {
      id: '4',
      type: 'payment_received',
      title: 'Payment Received! 💰',
      message: 'Order #ORD-001 has been paid via credit card. Total: $47.50',
      time: '1 hour ago',
      isRead: true,
      priority: 'low',
      orderId: '1'
    },
    {
      id: '5',
      type: 'special_request',
      title: 'Special Request 📝',
      message: 'Order #ORD-002 has special dietary requirements. Check notes.',
      time: '2 hours ago',
      isRead: true,
      priority: 'medium',
      orderId: '2'
    }
  ];

  const unreadCount = mockOrderNotifications.filter(n => !n.isRead).length;

  // Scroll behavior for floating notification bell
  const bellRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Find the scrollable content container from DashboardLayout
      const contentContainer = document.querySelector('[class*="overflow-y-auto"]');
      if (contentContainer) {
        const currentScrollY = contentContainer.scrollTop || 0;
        console.log('Scroll detected on content container:', currentScrollY);
        setScrollY(currentScrollY);
      } else {
        // Fallback to window scroll
        const currentScrollY = window.scrollY || 
                              document.documentElement.scrollTop || 
                              document.body.scrollTop || 0;
        console.log('Scroll detected on window:', currentScrollY);
        setScrollY(currentScrollY);
      }
    };

    // Find the scrollable content container
    const contentContainer = document.querySelector('[class*="overflow-y-auto"]');
    
    if (contentContainer) {
      // Add scroll listener to the content container
      contentContainer.addEventListener('scroll', handleScroll, { passive: true });
      console.log('Scroll listener attached to content container');
    } else {
      // Fallback to window scroll
      window.addEventListener('scroll', handleScroll, { passive: true });
      console.log('Scroll listener attached to window');
    }
    
    // Initial call to set position
    handleScroll();
    
    return () => {
      if (contentContainer) {
        contentContainer.removeEventListener('scroll', handleScroll);
      } else {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    served: orders.filter(o => o.status === 'served').length,
    paid: orders.filter(o => o.status === 'paid').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.phone.includes(searchQuery);
    
    return matchesStatus && matchesSearch;
  });

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  // Order workflow functions
  const confirmOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'confirmed');
  };

  const startPreparing = (orderId: string) => {
    updateOrderStatus(orderId, 'preparing');
  };

  const markReady = (orderId: string) => {
    updateOrderStatus(orderId, 'ready');
  };

  const markServed = (orderId: string) => {
    updateOrderStatus(orderId, 'served');
  };

  const cancelOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'cancelled');
  };

  const startEditingOrder = (order: Order) => {
    setEditingOrder({ ...order });
    setIsEditMode(true);
    setSelectedOrder(null);
  };

  const saveOrderChanges = () => {
    if (editingOrder) {
      setOrders(orders.map(order => 
        order.id === editingOrder.id ? editingOrder : order
      ));
      setIsEditMode(false);
      setEditingOrder(null);
    }
  };

  const cancelEditing = () => {
    setIsEditMode(false);
    setEditingOrder(null);
  };

  const updateOrderItemQuantity = (itemId: string, newQuantity: number) => {
    if (editingOrder && newQuantity > 0) {
      setEditingOrder({
        ...editingOrder,
        items: editingOrder.items.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      });
    }
  };

  const removeOrderItem = (itemId: string) => {
    if (editingOrder) {
      setEditingOrder({
        ...editingOrder,
        items: editingOrder.items.filter(item => item.id !== itemId)
      });
    }
  };

  const showCancelConfirmation = (order: Order) => {
    setOrderToCancel(order);
    setIsCancelConfirmOpen(true);
  };

  const confirmCancelOrder = () => {
    if (orderToCancel) {
      cancelOrder(orderToCancel.id);
      setIsCancelConfirmOpen(false);
      setOrderToCancel(null);
      // Close modals if they're open
      if (selectedOrder?.id === orderToCancel.id) {
        setSelectedOrder(null);
      }
      if (editingOrder?.id === orderToCancel.id) {
        setIsEditMode(false);
        setEditingOrder(null);
      }
    }
  };

  const addItemToOrder = (item: { id: string; name: string; price: number; notes?: string }) => {
    console.log('addItemToOrder called for:', item.name);
    
    if (!editingOrder) {
      console.log('No editing order found');
      return;
    }
    
    if (isProcessingRef.current) {
      console.log('Already processing, ignoring click');
      return;
    }
    
    console.log('Setting processing flag to true');
    isProcessingRef.current = true;
    setIsAddingItem(true);
    
    const existingItem = editingOrder.items.find(i => i.id === item.id);
    
    if (existingItem) {
      console.log('Updating existing item quantity');
      setEditingOrder(prev => ({
        ...prev!,
        items: prev!.items.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }));
    } else {
      console.log('Adding new item');
      const newItem = {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        status: 'pending' as const,
        notes: item.notes || ''
      };
      setEditingOrder(prev => ({
        ...prev!,
        items: [...prev!.items, newItem]
      }));
    }
    
    console.log('Closing modal and resetting state');
    setIsAddItemModalOpen(false);
    setIsAddingItem(false);
    isProcessingRef.current = false;
  };

  // Check if order can transition to next status
  const canConfirm = (order: Order) => order.status === 'pending';
  const canStartPreparing = (order: Order) => order.status === 'confirmed';
  const canMarkReady = (order: Order) => order.status === 'preparing';
  const canMarkServed = (order: Order) => order.status === 'ready';
  const canEdit = (order: Order) => !['cancelled', 'paid'].includes(order.status);
  const canCancel = (order: Order) => !['cancelled', 'paid', 'served'].includes(order.status);

  const getElapsedTime = (createdAt: Date) => {
    const elapsed = Math.floor((Date.now() - createdAt.getTime()) / 1000 / 60);
    return elapsed;
  };

  const isOverdue = (order: Order) => {
    return getElapsedTime(order.createdAt) > order.estimatedTime;
  };



  return (
    <>
      <div className="space-y-6 min-h-screen">
        {/* Page Header */}
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🚀 Command Centre
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            From "New" to "Served" — keep the line moving.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search orders..."
                className="pl-10 w-80"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

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
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCcw className="w-4 h-4" />
            </Button>
            <Button 
              className="btn-aurora"
              onClick={() => setIsAddOrderModalOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Order
            </Button>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {Object.entries(statusCounts).map(([status, count]) => (
            <Button
              key={status}
              variant={selectedStatus === status ? 'default' : 'outline'}
              size="sm"
              className={selectedStatus === status ? 'aurora-gradient text-white' : ''}
              onClick={() => setSelectedStatus(status)}
            >
              {status === 'all' ? 'All Orders' : status.charAt(0).toUpperCase() + status.slice(1)}
              <Badge variant="secondary" className="ml-2">
                {count}
              </Badge>
            </Button>
          ))}
        </div>



        {/* Orders List */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Orders ({filteredOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No orders found</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? 'Try adjusting your search terms.' : 'No orders match your current filters.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const StatusIcon = statusConfig[order.status].icon;
                  const elapsed = getElapsedTime(order.createdAt);
                  const overdue = isOverdue(order);
                  
                  return (
                    <div
                      key={order.id}
                      className={`p-4 rounded-lg border transition-colors hover:bg-muted/50 cursor-pointer ${
                        overdue ? 'border-red-200 bg-red-50/50' : 'border-border'
                      }`}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <StatusIcon className="w-4 h-4" />
                            <span className="font-semibold">{order.orderNumber}</span>
                            {overdue && (
                              <Badge className="bg-red-100 text-red-800">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Overdue
                              </Badge>
                            )}
                          </div>
                          <Badge className={statusConfig[order.status].color}>
                            {order.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-semibold">${order.total.toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">
                              {elapsed}m / {order.estimatedTime}m
                            </p>
                          </div>

                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{order.customer.name}</p>
                            <p className="text-muted-foreground">{order.customer.phone}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{order.table ? `Table ${order.table}` : 'Takeout'}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <ChefHat className="w-4 h-4 text-muted-foreground" />
                          <span>{order.staff}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm text-muted-foreground">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''}: {' '}
                          {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                        </p>
                      </div>

                      {/* Order Workflow Actions */}
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex flex-wrap gap-2">
                          {/* Workflow Buttons */}
                          {canConfirm(order) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                confirmOrder(order.id);
                              }}
                              className="border-purple-200 text-gray-700 hover:bg-purple-50"
                            >
                              Confirm
                            </Button>
                          )}
                          
                          {canStartPreparing(order) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                startPreparing(order.id);
                              }}
                              className="border-purple-200 text-gray-700 hover:bg-purple-50"
                            >
                              Start Preparing
                            </Button>
                          )}
                          
                          {canMarkReady(order) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                markReady(order.id);
                              }}
                              className="border-purple-200 text-gray-700 hover:bg-purple-50"
                            >
                              Mark Ready
                            </Button>
                          )}
                          
                          {canMarkServed(order) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                markServed(order.id);
                              }}
                              className="border-purple-200 text-gray-700 hover:bg-purple-50"
                            >
                              Mark Served
                            </Button>
                          )}

                          {/* Action Buttons */}
                          {canEdit(order) && (
                                                        <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                startEditingOrder(order);
                              }}
                              className="border-purple-200 text-gray-700 hover:bg-purple-50 ml-4"
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              Edit Order
                            </Button>
                          )}
                          
                          {canCancel(order) && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                showCancelConfirmation(order);
                              }}
                              className="ml-2"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Cancel Order
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Details Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-8 h-8 aurora-gradient rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-4 h-4 text-white" />
              </div>
              Order Details - {selectedOrder?.orderNumber}
            </DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Header */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Customer
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p className="font-medium">{selectedOrder.customer.name}</p>
                      <p className="text-muted-foreground">{selectedOrder.customer.phone}</p>
                      {selectedOrder.customer.email && (
                        <p className="text-muted-foreground">{selectedOrder.customer.email}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Location & Staff
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p>{selectedOrder.table ? `Table ${selectedOrder.table}` : 'Takeout'}</p>
                      <p className="text-muted-foreground">Staff: {selectedOrder.staff}</p>
                      <p className="text-muted-foreground">
                        {selectedOrder.createdAt.toLocaleTimeString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Timer className="w-4 h-4" />
                      Timing
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p>Estimated: {selectedOrder.estimatedTime} min</p>
                      <p>Elapsed: {getElapsedTime(selectedOrder.createdAt)} min</p>
                      <Badge className={statusConfig[selectedOrder.status].color}>
                        {selectedOrder.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <span className="font-medium">{item.quantity}x {item.name}</span>
                            <Badge className={statusConfig[item.status].color}>
                              {item.status}
                            </Badge>
                          </div>
                          {item.notes && (
                            <p className="text-sm text-muted-foreground mt-1">{item.notes}</p>
                          )}
                        </div>
                        <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${selectedOrder.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>${selectedOrder.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total:</span>
                      <span>${selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex justify-between">
                <div className="flex gap-2">
                  {canConfirm(selectedOrder) && (
                  <Button 
                    variant="outline"
                    onClick={() => updateOrderStatus(selectedOrder.id, 'confirmed')}
                  >
                    Confirm
                  </Button>
                  )}
                  {canStartPreparing(selectedOrder) && (
                  <Button 
                    variant="outline"
                    onClick={() => updateOrderStatus(selectedOrder.id, 'preparing')}
                  >
                    Start Preparing
                  </Button>
                  )}
                  {canMarkReady(selectedOrder) && (
                  <Button 
                    variant="outline"
                    onClick={() => updateOrderStatus(selectedOrder.id, 'ready')}
                  >
                    Mark Ready
                  </Button>
                  )}
                  {canMarkServed(selectedOrder) && (
                  <Button 
                    variant="outline"
                    onClick={() => updateOrderStatus(selectedOrder.id, 'served')}
                  >
                    Mark Served
                  </Button>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => setSelectedOrder(null)}
                  >
                    Close
                  </Button>
                  {canCancel(selectedOrder) && (
                    <Button 
                      variant="destructive"
                      onClick={() => {
                        showCancelConfirmation(selectedOrder);
                      }}
                    >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Cancel Order
                  </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Order Modal */}
      <AddOrderModal 
        isOpen={isAddOrderModalOpen}
        onClose={() => setIsAddOrderModalOpen(false)}
      />

      {/* Cancel Order Confirmation Modal */}
      <Dialog open={isCancelConfirmOpen} onOpenChange={setIsCancelConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-white" />
              </div>
              Cancel Order
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-gray-700">
              Are you sure you want to cancel order <span className="font-semibold">{orderToCancel?.orderNumber}</span>?
            </p>
            <p className="text-sm text-gray-500">
              This action cannot be undone. The order will be marked as cancelled.
            </p>
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setIsCancelConfirmOpen(false)}>
              Keep Order
            </Button>
            <Button variant="destructive" onClick={confirmCancelOrder}>
              Yes, Cancel Order
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Item to Order Modal */}
      <Dialog open={isAddItemModalOpen} onOpenChange={setIsAddItemModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Plus className="w-4 h-4 text-white" />
              </div>
              Add Item to Order
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {mockMenuItems.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-500">{item.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${item.price.toFixed(2)}</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (!isProcessingRef.current) {
                            addItemToOrder(item);
                          }
                        }}
                        disabled={isAddingItem}
                      >
                        {isAddingItem ? (
                          <>
                            <div className="w-3 h-3 mr-1 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                            Adding...
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3 mr-1" />
                            Add
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <Button variant="outline" onClick={() => setIsAddItemModalOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Order Modal */}
      <Dialog open={isEditMode} onOpenChange={setIsEditMode}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <Edit className="w-4 h-4 text-white" />
              </div>
              Edit Order - {editingOrder?.orderNumber}
            </DialogTitle>
          </DialogHeader>
          
          {editingOrder && (
            <div className="space-y-6">
              {/* Order Header */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Customer
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p className="font-medium">{editingOrder.customer.name}</p>
                      <p className="text-muted-foreground">{editingOrder.customer.phone}</p>
                      {editingOrder.customer.email && (
                        <p className="text-muted-foreground">{editingOrder.customer.email}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Location & Staff
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p>{editingOrder.table ? `Table ${editingOrder.table}` : 'Takeout'}</p>
                      <p className="text-muted-foreground">Staff: {editingOrder.staff}</p>
                      <p className="text-muted-foreground">
                        {editingOrder.createdAt.toLocaleTimeString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Timer className="w-4 h-4" />
                      Timing
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p>Estimated: {editingOrder.estimatedTime} min</p>
                      <p>Elapsed: {getElapsedTime(editingOrder.createdAt)} min</p>
                      <Badge className={statusConfig[editingOrder.status].color}>
                        {editingOrder.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Editable Order Items */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Order Items</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Click on quantities to edit or use the remove button to delete items
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsAddItemModalOpen(true)}
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Item
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {editingOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <span className="font-medium">{item.name}</span>
                            <Badge className={statusConfig[item.status].color}>
                              {item.status}
                            </Badge>
                          </div>
                          {item.notes && (
                            <p className="text-sm text-muted-foreground mt-1">{item.notes}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateOrderItemQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-8 h-8 p-0"
                            >
                              -
                            </Button>
                            <span className="font-medium min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateOrderItemQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 p-0"
                            >
                              +
                            </Button>
                          </div>
                          <span className="font-semibold min-w-[4rem] text-right">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeOrderItem(item.id)}
                            className="w-8 h-8 p-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${editingOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>${(editingOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.1).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total:</span>
                      <span>${(editingOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 1.1).toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={cancelEditing}>
                  Cancel
                </Button>
                <Button onClick={saveOrderChanges}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Notifications Modal */}
      <Dialog open={isNotificationsModalOpen} onOpenChange={setIsNotificationsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Orders Notifications Center
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-red-500 text-white">
                  {unreadCount} new
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {mockOrderNotifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No notifications yet</p>
                <p className="text-sm">You'll see important order updates here</p>
              </div>
            ) : (
              mockOrderNotifications.map((notification) => {
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
                        {priorityIcons[notification.priority as keyof typeof priorityIcons]}
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
                          {notification.orderId && (
                            <Badge variant="secondary" className="text-xs">
                              Order #{notification.orderId}
                            </Badge>
                          )}
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

      {/* Additional content to enable scrolling */}
      <div className="mt-16 space-y-8">
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">Order Management Tips</h3>
          <p className="text-sm text-muted-foreground">Scroll down to see more helpful information</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }, (_, i) => (
            <Card key={i} className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 text-lg">📋</span>
                </div>
                <h4 className="font-medium">Order Tip {i + 1}</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                This is additional content to make the page scrollable so the floating notification bell can demonstrate its scroll behavior.
              </p>
            </Card>
          ))}
        </div>
        
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">End of Orders page - Scroll up to see orders</p>
        </div>
      </div>

      {/* Floating Notification Button */}
      <div 
        ref={bellRef}
        className="fixed bottom-6 right-6 z-50 transition-transform duration-300 ease-out"
        style={{ 
          transform: `translateY(${Math.min(scrollY * 0.3, 100)}px)` 
        }}
        title={`Scroll Y: ${scrollY}, Transform: ${Math.min(scrollY * 0.3, 100)}px`}
      >
        {/* Debug indicator */}
        <div className="absolute -top-8 left-0 bg-red-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          Scroll: {scrollY}px
        </div>
        <Button
          onClick={() => setIsNotificationsModalOpen(true)}
          className="relative h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
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
