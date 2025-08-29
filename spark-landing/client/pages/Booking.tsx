import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Crown,
  MapPin,
  Calendar,
  Clock,
  Users,
  ChefHat,
  Plus,
  Minus,
  Check,
  Star,
  Leaf,
  AlertTriangle,
  Phone,
  Mail,
  User,
  Heart,
  Gift
} from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

interface BookingData {
  date: string;
  time: string;
  partySize: number;
  customer: {
    name: string;
    email: string;
    phone: string;
    specialRequests: string;
  };
  preOrder: CartItem[];
}

const timeSlots = [
  { time: '5:00 PM', available: 8, status: 'available' },
  { time: '5:30 PM', available: 5, status: 'limited' },
  { time: '6:00 PM', available: 3, status: 'limited' },
  { time: '6:30 PM', available: 7, status: 'available' },
  { time: '7:00 PM', available: 2, status: 'limited' },
  { time: '7:30 PM', available: 0, status: 'full' },
  { time: '8:00 PM', available: 4, status: 'limited' },
  { time: '8:30 PM', available: 6, status: 'available' },
  { time: '9:00 PM', available: 8, status: 'available' },
  { time: '9:30 PM', available: 9, status: 'available' }
];

const menuItems = [
  {
    id: '1',
    name: 'Grilled Atlantic Salmon',
    price: 28.99,
    category: 'Mains',
    description: 'Fresh Atlantic salmon with seasonal vegetables',
    prepTime: 20,
    rating: 4.8,
    dietary: ['Gluten-Free', 'High-Protein'],
    image: '/api/placeholder/300/200'
  },
  {
    id: '2',
    name: 'Classic Caesar Salad',
    price: 14.99,
    category: 'Appetizers',
    description: 'Crisp romaine, parmesan, croutons, Caesar dressing',
    prepTime: 10,
    rating: 4.6,
    dietary: ['Vegetarian'],
    image: '/api/placeholder/300/200'
  },
  {
    id: '3',
    name: 'Premium Ribeye Steak',
    price: 42.99,
    category: 'Mains',
    description: '12oz prime ribeye with garlic mashed potatoes',
    prepTime: 25,
    rating: 4.9,
    dietary: ['High-Protein', 'Keto-Friendly'],
    image: '/api/placeholder/300/200'
  },
  {
    id: '4',
    name: 'Chocolate Lava Cake',
    price: 12.99,
    category: 'Desserts',
    description: 'Warm chocolate cake with vanilla ice cream',
    prepTime: 15,
    rating: 4.7,
    dietary: ['Vegetarian'],
    image: '/api/placeholder/300/200'
  },
  {
    id: '5',
    name: 'Craft Beer Selection',
    price: 8.99,
    category: 'Beverages',
    description: 'Local craft beers - IPA, Lager, Stout',
    prepTime: 2,
    rating: 4.4,
    dietary: [],
    image: '/api/placeholder/300/200'
  },
  {
    id: '6',
    name: 'Quinoa Buddha Bowl',
    price: 19.99,
    category: 'Mains',
    description: 'Quinoa, roasted vegetables, avocado, tahini',
    prepTime: 18,
    rating: 4.5,
    dietary: ['Vegan', 'Gluten-Free'],
    image: '/api/placeholder/300/200'
  }
];

const categories = ['All', 'Appetizers', 'Mains', 'Desserts', 'Beverages'];
const partySizes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export default function Booking() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [bookingData, setBookingData] = useState<BookingData>({
    date: '',
    time: '',
    partySize: 2,
    customer: {
      name: '',
      email: '',
      phone: '',
      specialRequests: ''
    },
    preOrder: []
  });

  const filteredMenuItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const addToCart = (item: typeof menuItems[0]) => {
    const existingItem = bookingData.preOrder.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setBookingData({
        ...bookingData,
        preOrder: bookingData.preOrder.map(cartItem =>
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      });
    } else {
      setBookingData({
        ...bookingData,
        preOrder: [...bookingData.preOrder, {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          category: item.category
        }]
      });
    }
  };

  const updateCartQuantity = (itemId: string, change: number) => {
    setBookingData({
      ...bookingData,
      preOrder: bookingData.preOrder.map(item => {
        if (item.id === itemId) {
          const newQuantity = Math.max(0, item.quantity + change);
          return newQuantity === 0 ? null : { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(Boolean) as CartItem[]
    });
  };

  const getCartTotal = () => {
    return bookingData.preOrder.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTimeSlotStatus = (slot: typeof timeSlots[0]) => {
    if (slot.status === 'full') return 'bg-red-100 text-red-800';
    if (slot.status === 'limited') return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return bookingData.date && bookingData.time && bookingData.partySize;
    }
    if (currentStep === 2) {
      return true; // Pre-order is optional
    }
    if (currentStep === 3) {
      return bookingData.customer.name && bookingData.customer.email && bookingData.customer.phone;
    }
    return true;
  };

  // Generate available dates (next 30 days, excluding today)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 aurora-gradient rounded-xl shadow-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Silex Restaurant</h1>
                <p className="text-sm text-muted-foreground">Reserve & Pre-Order</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>123 Culinary Street, Downtown</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step <= currentStep 
                      ? 'aurora-gradient text-white' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {step < currentStep ? <Check className="w-5 h-5" /> : step}
                  </div>
                  {step < 4 && (
                    <div className={`w-16 h-1 mx-2 ${
                      step < currentStep ? 'aurora-gradient' : 'bg-muted'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4 space-x-16 text-sm text-muted-foreground">
              <span className={currentStep >= 1 ? 'text-foreground font-medium' : ''}>Reservation</span>
              <span className={currentStep >= 2 ? 'text-foreground font-medium' : ''}>Pre-Order</span>
              <span className={currentStep >= 3 ? 'text-foreground font-medium' : ''}>Details</span>
              <span className={currentStep >= 4 ? 'text-foreground font-medium' : ''}>Confirm</span>
            </div>
          </div>

          {/* Step 1: Reservation Details */}
          {currentStep === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Reservation Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="date">Select Date</Label>
                    <Input
                      id="date"
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={bookingData.date}
                      onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Party Size</Label>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {partySizes.map((size) => (
                        <Button
                          key={size}
                          variant={bookingData.partySize === size ? 'default' : 'outline'}
                          className={bookingData.partySize === size ? 'aurora-gradient text-white' : ''}
                          onClick={() => setBookingData({...bookingData, partySize: size})}
                        >
                          {size}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Available Times
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {timeSlots.map((slot) => (
                      <Button
                        key={slot.time}
                        variant={bookingData.time === slot.time ? 'default' : 'outline'}
                        className={`h-auto p-3 ${
                          bookingData.time === slot.time 
                            ? 'aurora-gradient text-white' 
                            : slot.status === 'full' 
                              ? 'opacity-50 cursor-not-allowed' 
                              : ''
                        }`}
                        disabled={slot.status === 'full'}
                        onClick={() => setBookingData({...bookingData, time: slot.time})}
                      >
                        <div className="text-center">
                          <div className="font-medium">{slot.time}</div>
                          <Badge className={getTimeSlotStatus(slot)}>
                            {slot.status === 'full' ? 'Full' : `${slot.available} tables`}
                          </Badge>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 2: Pre-Order Menu (Optional) */}
          {currentStep === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ChefHat className="w-5 h-5" />
                      Pre-Order Menu (Optional)
                    </CardTitle>
                    <p className="text-muted-foreground">
                      Order ahead to skip the wait and ensure your favorites are ready
                    </p>
                  </CardHeader>
                  <CardContent>
                    {/* Category Filters */}
                    <div className="flex gap-2 mb-6 flex-wrap">
                      {categories.map((category) => (
                        <Button
                          key={category}
                          variant={selectedCategory === category ? 'default' : 'outline'}
                          size="sm"
                          className={selectedCategory === category ? 'aurora-gradient text-white' : ''}
                          onClick={() => setSelectedCategory(category)}
                        >
                          {category}
                        </Button>
                      ))}
                    </div>

                    {/* Menu Items */}
                    <div className="grid gap-4">
                      {filteredMenuItems.map((item) => (
                        <Card key={item.id} className="hover:shadow-md transition-all">
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                                <span className="text-xs text-muted-foreground">IMG</span>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h3 className="font-semibold">{item.name}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                      {item.description}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-lg font-bold aurora-text">${item.price}</p>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                      <span>{item.rating}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <div className="flex gap-1">
                                    {item.dietary.slice(0, 2).map((diet) => (
                                      <Badge key={diet} className="bg-green-100 text-green-800">
                                        <Leaf className="w-3 h-3 mr-1" />
                                        {diet}
                                      </Badge>
                                    ))}
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                      <Clock className="w-3 h-3" />
                                      <span>{item.prepTime}m</span>
                                    </div>
                                  </div>
                                  
                                  <Button
                                    size="sm"
                                    className="btn-aurora"
                                    onClick={() => addToCart(item)}
                                  >
                                    <Plus className="w-3 h-3 mr-1" />
                                    Add
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Cart Sidebar */}
              <Card className="glass-card h-fit sticky top-24">
                <CardHeader>
                  <CardTitle>Pre-Order Cart</CardTitle>
                </CardHeader>
                <CardContent>
                  {bookingData.preOrder.length === 0 ? (
                    <div className="text-center py-8">
                      <ChefHat className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No items added yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {bookingData.preOrder.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">${item.price} each</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateCartQuantity(item.id, -1)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateCartQuantity(item.id, 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      <div className="border-t pt-3 mt-3">
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Total:</span>
                          <span className="aurora-text">${getCartTotal().toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: Customer Information */}
          {currentStep === 3 && (
            <Card className="glass-card max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Your full name"
                      value={bookingData.customer.name}
                      onChange={(e) => setBookingData({
                        ...bookingData,
                        customer: { ...bookingData.customer, name: e.target.value }
                      })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      placeholder="(555) 123-4567"
                      value={bookingData.customer.phone}
                      onChange={(e) => setBookingData({
                        ...bookingData,
                        customer: { ...bookingData.customer, phone: e.target.value }
                      })}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={bookingData.customer.email}
                    onChange={(e) => setBookingData({
                      ...bookingData,
                      customer: { ...bookingData.customer, email: e.target.value }
                    })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="requests">Special Requests</Label>
                  <Textarea
                    id="requests"
                    placeholder="Dietary restrictions, celebration details, accessibility needs..."
                    value={bookingData.customer.specialRequests}
                    onChange={(e) => setBookingData({
                      ...bookingData,
                      customer: { ...bookingData.customer, specialRequests: e.target.value }
                    })}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 4 && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <div className="w-20 h-20 aurora-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Reservation Confirmed!</h2>
                <p className="text-muted-foreground">Thank you for your reservation. We're excited to serve you!</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Reservation Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{new Date(bookingData.date).toLocaleDateString()}</p>
                        <p className="text-sm text-muted-foreground">Date</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{bookingData.time}</p>
                        <p className="text-sm text-muted-foreground">Time</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{bookingData.partySize} guests</p>
                        <p className="text-sm text-muted-foreground">Party size</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{bookingData.customer.name}</p>
                        <p className="text-sm text-muted-foreground">{bookingData.customer.phone}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {bookingData.preOrder.length > 0 && (
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle>Pre-Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        {bookingData.preOrder.map((item) => (
                          <div key={item.id} className="flex justify-between">
                            <span>{item.quantity}x {item.name}</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Total:</span>
                          <span className="aurora-text">${getCartTotal().toFixed(2)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <Card className="glass-card mt-6">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">Booking Confirmation: RES-{Date.now().toString().slice(-6)}</h3>
                  <p className="text-muted-foreground mb-4">
                    A confirmation email has been sent to {bookingData.customer.email}
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button variant="outline">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Restaurant
                    </Button>
                    <Button variant="outline">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Confirmation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation */}
          {currentStep < 4 && (
            <div className="flex justify-between mt-8">
              <Button 
                variant="outline" 
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              <Button 
                className="btn-aurora"
                onClick={nextStep}
                disabled={!canProceed()}
              >
                {currentStep === 3 ? 'Confirm Reservation' : 'Continue'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
