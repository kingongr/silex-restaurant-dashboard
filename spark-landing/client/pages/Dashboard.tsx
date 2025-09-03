import { useState } from 'react';
// DashboardLayout removed - already wrapped by App.tsx routing
import { KPICard } from '@/components/dashboard/KPICard';
import AddOrderModal from '@/components/modals/AddOrderModal';
import { AddReservationModal } from '@/components/modals/AddReservationModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Calendar,
  Plus,
  ArrowUpRight,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';

// Mock data for demonstration
const recentOrders = [
  {
    id: 'ORD-001',
    customer: 'John Smith',
    items: 3,
    total: '$42.50',
    status: 'completed',
    time: '2 minutes ago'
  },
  {
    id: 'ORD-002',
    customer: 'Sarah Johnson',
    items: 2,
    total: '$28.75',
    status: 'pending',
    time: '5 minutes ago'
  },
  {
    id: 'ORD-003',
    customer: 'Mike Davis',
    items: 4,
    total: '$65.20',
    status: 'in_progress',
    time: '8 minutes ago'
  },
  {
    id: 'ORD-004',
    customer: 'Emma Wilson',
    items: 1,
    total: '$15.99',
    status: 'cancelled',
    time: '12 minutes ago'
  },
  {
    id: 'ORD-005',
    customer: 'Robert Brown',
    items: 5,
    total: '$89.45',
    status: 'completed',
    time: '15 minutes ago'
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    case 'pending':
      return <Clock className="w-4 h-4 text-yellow-600" />;
    case 'in_progress':
      return <AlertCircle className="w-4 h-4 text-blue-600" />;
    case 'cancelled':
      return <XCircle className="w-4 h-4 text-red-600" />;
    default:
      return <Clock className="w-4 h-4 text-gray-600" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'in_progress':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

export default function Dashboard() {
  const [isAddOrderModalOpen, setIsAddOrderModalOpen] = useState(false);
  const [isAddReservationModalOpen, setIsAddReservationModalOpen] = useState(false);

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            👋 Welcome back, Chef!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your restaurant's pulse in real-time.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="text-heading-3 font-semibold mb-4">Quick Actions</div>
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Button
            className="btn-aurora"
            onClick={() => setIsAddOrderModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Order
          </Button>
          <Button
            className="btn-aurora"
            onClick={() => setIsAddReservationModalOpen(true)}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Add Reservation
          </Button>
          <Button className="btn-aurora">
            <Users className="w-4 h-4 mr-2" />
            View Tables
          </Button>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Daily Revenue"
            value="$2,847.32"
            change="+12.5% from yesterday"
            changeType="positive"
            icon={DollarSign}
          />
          <KPICard
            title="Orders Today"
            value="47"
            change="+8 from yesterday"
            changeType="positive"
            icon={ShoppingCart}
          />
          <KPICard
            title="Active Tables"
            value="12/18"
            change="67% occupancy"
            changeType="neutral"
            icon={Users}
          />
          <KPICard
            title="Pending Reservations"
            value="23"
            change="for tonight"
            changeType="neutral"
            icon={Calendar}
          />
        </div>

        {/* Charts Section */}
        <Card className="glass-card">
          <CardContent className="p-0">
            <div className="flex flex-col lg:flex-row gap-5 lg:gap-0">
              {/* Revenue Chart Column */}
              <div className="flex-1 p-6">
                <div className="flex items-center justify-between mb-6">
                  <CardTitle>Revenue Trends</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Today</Button>
                    <Button variant="outline" size="sm" className="aurora-gradient text-white border-0">Week</Button>
                    <Button variant="outline" size="sm">Month</Button>
                  </div>
                </div>
                <div className="h-64 aurora-gradient-subtle rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Revenue Chart Placeholder</p>
                </div>
              </div>

              {/* Order Status Chart Column */}
              <div className="flex-1 p-6 lg:border-l border-border">
                <CardTitle className="mb-6">Order Status Distribution</CardTitle>
                <div className="h-64 aurora-gradient-subtle rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Donut Chart Placeholder</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Orders
              <Button variant="ghost" size="sm" className="text-aurora-600 hover:text-aurora-700">
                View All
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(order.status)}
                    <div>
                      <p className="text-body font-medium text-foreground">
                        {order.id}
                      </p>
                      <p className="text-body-small text-muted-foreground">
                        {order.customer}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-body-small text-muted-foreground">
                        {order.items} items
                      </p>
                      <p className="text-body font-semibold text-foreground">
                        {order.total}
                      </p>
                    </div>

                    <Badge className={getStatusColor(order.status)}>
                      {order.status.replace('_', ' ')}
                    </Badge>

                    <p className="text-body-small text-muted-foreground w-20 text-right">
                      {order.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <AddOrderModal
        isOpen={isAddOrderModalOpen}
        onClose={() => setIsAddOrderModalOpen(false)}
      />
      <AddReservationModal
        isOpen={isAddReservationModalOpen}
        onClose={() => setIsAddReservationModalOpen(false)}
      />




    </>
  );
}
