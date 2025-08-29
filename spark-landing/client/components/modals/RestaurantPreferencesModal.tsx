import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { 
  Store, 
  Clock, 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Plus, 
  Trash2, 
  Edit,
  Calendar,
  User,
  Copy,
  Send,
  RefreshCw,
  CheckCircle,
  Check,
  ChevronsUpDown,
  MessageSquare
} from 'lucide-react';
import AddStaffModal from './AddStaffModal';
import { Combobox } from '../ui/combobox';

interface RestaurantPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CUISINE_TYPES = [
  { value: 'contemporary-american', label: 'Contemporary American' },
  { value: 'italian', label: 'Italian' },
  { value: 'french', label: 'French' },
  { value: 'asian-fusion', label: 'Asian Fusion' },
  { value: 'mediterranean', label: 'Mediterranean' },
  { value: 'steakhouse', label: 'Steakhouse' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'chinese', label: 'Chinese' },
  { value: 'mexican', label: 'Mexican' },
  { value: 'indian', label: 'Indian' },
  { value: 'thai', label: 'Thai' },
  { value: 'vietnamese', label: 'Vietnamese' },
  { value: 'greek', label: 'Greek' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'turkish', label: 'Turkish' },
  { value: 'lebanese', label: 'Lebanese' },
  { value: 'korean', label: 'Korean' },
  { value: 'seafood', label: 'Seafood' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'farm-to-table', label: 'Farm-to-Table' },
  { value: 'fusion', label: 'Fusion' },
  { value: 'bbq', label: 'BBQ' },
  { value: 'comfort-food', label: 'Comfort Food' },
  { value: 'fine-dining', label: 'Fine Dining' },
  { value: 'casual-dining', label: 'Casual Dining' },
  { value: 'fast-casual', label: 'Fast Casual' },
  { value: 'bistro', label: 'Bistro' },
  { value: 'cafe', label: 'Cafe' },
  { value: 'gastropub', label: 'Gastropub' }
];

const PRICE_RANGES = [
  '$ (Under $15)',
  '$$ ($15-30)',
  '$$$ ($30-60)',
  '$$$$ (Over $60)'
];

export default function RestaurantPreferencesModal({ isOpen, onClose }: RestaurantPreferencesModalProps) {
  const [activeTab, setActiveTab] = useState('restaurant');
  const [inviteCode] = useState('SILEX2024');
  const [copiedInviteCode, setCopiedInviteCode] = useState(false);
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);

  // Restaurant Information State
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: 'Silex Restaurant',
    description: 'Fine dining experience with contemporary cuisine and exceptional service.',
    address: '123 Main Street, New York, NY 10001',
    phone: '+1 (555) 123-4567',
    email: 'info@silexrestaurant.com',
    website: 'www.silexrestaurant.com',
    cuisine: 'contemporary-american',
    capacity: '120',
    priceRange: '$$$ ($30-60)'
  });

  // Hours State
  const [hours, setHours] = useState({
    monday: { open: '11:00', close: '22:00', closed: false },
    tuesday: { open: '11:00', close: '22:00', closed: false },
    wednesday: { open: '11:00', close: '22:00', closed: false },
    thursday: { open: '11:00', close: '22:00', closed: false },
    friday: { open: '11:00', close: '23:00', closed: false },
    saturday: { open: '10:00', close: '23:00', closed: false },
    sunday: { open: '10:00', close: '21:00', closed: false }
  });

  const [holidays, setHolidays] = useState([
    { id: 1, name: 'Christmas Day', date: '2024-12-25', closed: true },
    { id: 2, name: 'New Year\'s Day', date: '2025-01-01', closed: true },
    { id: 3, name: 'Thanksgiving', date: '2024-11-28', closed: true }
  ]);

  // Staff State
  const [staff, setStaff] = useState([
    { id: 1, name: 'John Smith', role: 'Manager', email: 'john@silexrestaurant.com', phone: '+1 (555) 123-4567', isActive: true },
    { id: 2, name: 'Sarah Johnson', role: 'Head Chef', email: 'sarah@silexrestaurant.com', phone: '+1 (555) 123-4568', isActive: true },
    { id: 3, name: 'Mike Brown', role: 'Server', email: 'mike@silexrestaurant.com', phone: '+1 (555) 123-4569', isActive: true },
    { id: 4, name: 'Lisa Davis', role: 'Host', email: 'lisa@silexrestaurant.com', phone: '+1 (555) 123-4570', isActive: false }
  ]);

  const handleRestaurantInfoChange = (field: string, value: string) => {
    setRestaurantInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleCuisineChange = (value: string) => {
    setRestaurantInfo(prev => ({ ...prev, cuisine: value }));
  };

  const getCuisineLabel = (cuisineValue: string) => {
    const cuisine = CUISINE_TYPES.find(c => c.value === cuisineValue);
    return cuisine ? cuisine.label : cuisineValue;
  };

  const handleHoursChange = (day: string, field: string, value: string | boolean) => {
    setHours(prev => ({
      ...prev,
      [day]: { ...prev[day as keyof typeof prev], [field]: value }
    }));
  };

  const addHoliday = () => {
    const newHoliday = {
      id: Date.now(),
      name: '',
      date: '',
      closed: true
    };
    setHolidays([...holidays, newHoliday]);
  };

  const removeHoliday = (id: number) => {
    setHolidays(holidays.filter(h => h.id !== id));
  };

  const addStaff = () => {
    const newStaff = {
      id: Date.now(),
      name: '',
      role: '',
      email: '',
      phone: '',
      isActive: true
    };
    setStaff([...staff, newStaff]);
  };

  const removeStaff = (id: number) => {
    setStaff(staff.filter(s => s.id !== id));
  };

  const toggleStaffStatus = (id: number) => {
    setStaff(staff.map(s => 
      s.id === id ? { ...s, isActive: !s.isActive } : s
    ));
  };

  const handleAddStaff = (staffData: {
    name: string;
    role: string;
    email: string;
    phone: string;
    isActive: boolean;
  }) => {
    const newStaff = {
      id: Date.now(),
      ...staffData
    };
    setStaff([...staff, newStaff]);
  };

  const sendEmailInvite = (email: string, name: string) => {
    const subject = 'Join Silex Restaurant Team';
    const body = `Hi ${name},\n\nYou've been invited to join the Silex Restaurant team!\n\nUse this invite code: ${inviteCode}\n\nBest regards,\nSilex Restaurant Team`;
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  };

  const sendSMSInvite = (phone: string, name: string) => {
    const message = `Hi ${name}, you've been invited to join Silex Restaurant! Use invite code: ${inviteCode}`;
    const smsLink = `sms:${phone.replace(/\D/g, '')}?body=${encodeURIComponent(message)}`;
    window.open(smsLink);
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopiedInviteCode(true);
    setTimeout(() => setCopiedInviteCode(false), 2000);
  };

  const handleSave = () => {
    console.log('Saving restaurant preferences:', { restaurantInfo, hours, holidays, staff });
    onClose();
  };

  const dayNames = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl lg:max-w-[calc(4xl-20%)] bg-white dark:bg-[#1B2030] border-gray-200 dark:border-gray-800 rounded-2xl p-0 overflow-hidden max-h-[85vh] overflow-y-auto modal-centered-content">
        <div className="p-6 sm:p-8">
          <DialogHeader className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                  Restaurant Preferences
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400">
                  Manage your restaurant settings and information
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="restaurant">Restaurant Info</TabsTrigger>
              <TabsTrigger value="hours">Hours</TabsTrigger>
              <TabsTrigger value="staff">Staff</TabsTrigger>
            </TabsList>

            {/* Restaurant Info Tab */}
            <TabsContent value="restaurant" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Restaurant Name
                  </Label>
                  <Input
                    value={restaurantInfo.name}
                    onChange={(e) => handleRestaurantInfoChange('name', e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Cuisine Type
                  </Label>
                  <Combobox
                    options={CUISINE_TYPES}
                    value={restaurantInfo.cuisine}
                    onValueChange={handleCuisineChange}
                    placeholder="Select or enter cuisine type..."
                    searchPlaceholder="Search or enter cuisine type..."
                    emptyText="No cuisine types found."
                    customText="Use custom cuisine"
                    allowCustom={true}
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Description
                </Label>
                <Textarea
                  value={restaurantInfo.description}
                  onChange={(e) => handleRestaurantInfoChange('description', e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Address
                  </Label>
                  <Input
                    value={restaurantInfo.address}
                    onChange={(e) => handleRestaurantInfoChange('address', e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Phone
                  </Label>
                  <Input
                    value={restaurantInfo.phone}
                    onChange={(e) => handleRestaurantInfoChange('phone', e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Email
                  </Label>
                  <Input
                    value={restaurantInfo.email}
                    onChange={(e) => handleRestaurantInfoChange('email', e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Website
                  </Label>
                  <Input
                    value={restaurantInfo.website}
                    onChange={(e) => handleRestaurantInfoChange('website', e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Capacity
                  </Label>
                  <Input
                    value={restaurantInfo.capacity}
                    onChange={(e) => handleRestaurantInfoChange('capacity', e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Price Range
                  </Label>
                  <Select value={restaurantInfo.priceRange} onValueChange={(value) => handleRestaurantInfoChange('priceRange', value)}>
                    <SelectTrigger className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRICE_RANGES.map((range) => (
                        <SelectItem key={range} value={range}>{range}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            {/* Hours Tab */}
            <TabsContent value="hours" className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">Operating Hours</h4>
                
                {Object.entries(hours).map(([day, hoursData]) => (
                  <div key={day} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="w-24 font-medium text-gray-900 dark:text-white">
                      {dayNames[day as keyof typeof dayNames]}
                    </div>
                    
                    <Switch
                      checked={!hoursData.closed}
                      onCheckedChange={(checked) => handleHoursChange(day, 'closed', !checked)}
                    />
                    
                    {!hoursData.closed && (
                      <>
                        <Input
                          type="time"
                          value={hoursData.open}
                          onChange={(e) => handleHoursChange(day, 'open', e.target.value)}
                          className="w-32 p-2 border border-gray-300 dark:border-gray-600 rounded"
                        />
                        <span className="text-gray-500">to</span>
                        <Input
                          type="time"
                          value={hoursData.close}
                          onChange={(e) => handleHoursChange(day, 'close', e.target.value)}
                          className="w-32 p-2 border border-gray-300 dark:border-gray-600 rounded"
                        />
                      </>
                    )}
                    
                    {hoursData.closed && (
                      <span className="text-gray-500 italic">Closed</span>
                    )}
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Holidays & Special Dates</h4>
                  <Button onClick={addHoliday} size="sm" className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Holiday
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {holidays.map((holiday) => (
                    <div key={holiday.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <Input
                        value={holiday.name}
                        onChange={(e) => {
                          const updatedHolidays = holidays.map(h => 
                            h.id === holiday.id ? { ...h, name: e.target.value } : h
                          );
                          setHolidays(updatedHolidays);
                        }}
                        placeholder="Holiday name"
                        className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded"
                      />
                      <Input
                        type="date"
                        value={holiday.date}
                        onChange={(e) => {
                          const updatedHolidays = holidays.map(h => 
                            h.id === holiday.id ? { ...h, date: e.target.value } : h
                          );
                          setHolidays(updatedHolidays);
                        }}
                        className="w-40 p-2 border border-gray-300 dark:border-gray-600 rounded"
                      />
                      <Button
                        onClick={() => removeHoliday(holiday.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Staff Tab */}
            <TabsContent value="staff" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Staff Management</h4>
                  <Button onClick={() => setIsAddStaffModalOpen(true)} size="sm" className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Staff Member
                  </Button>
                </div>

                {/* Staff Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="text-sm text-muted-foreground">Active Staff</p>
                          <p className="text-2xl font-bold">{staff.filter(s => s.isActive).length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                        <div>
                          <p className="text-sm text-muted-foreground">Inactive Staff</p>
                          <p className="text-2xl font-bold">{staff.filter(s => !s.isActive).length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Staff</p>
                          <p className="text-2xl font-bold">{staff.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Staff Invite Code */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Staff Invite Code</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Share this code with staff members so they can join your restaurant manually
                    </p>
                    <div className="flex items-center gap-3">
                      <Input
                        value={inviteCode}
                        readOnly
                        className="flex-1 font-mono text-lg"
                      />
                      <Button
                        onClick={copyInviteCode}
                        variant="outline"
                        className="min-w-[100px]"
                      >
                        {copiedInviteCode ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                          </>
                        )}
                      </Button>
                      <Button variant="outline">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        New Code
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Staff List */}
                <div className="space-y-4">
                  {/* Staff List Header */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="lg:col-span-3 font-medium text-gray-700 dark:text-gray-300">Name & Role</div>
                    <div className="lg:col-span-2 font-medium text-gray-700 dark:text-gray-300">Status</div>
                    <div className="lg:col-span-3 font-medium text-gray-700 dark:text-gray-300">Contact</div>
                    <div className="lg:col-span-2 font-medium text-gray-700 dark:text-gray-300">Actions</div>
                    <div className="lg:col-span-2 font-medium text-gray-700 dark:text-gray-300">Invite</div>
                  </div>
                  
                  {staff.map((member) => (
                    <div key={member.id} className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800/70 transition-colors duration-200">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                        {/* Name & Role - 3 columns */}
                        <div className="lg:col-span-3 space-y-1">
                          <div className="font-semibold text-gray-900 dark:text-white text-base">{member.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{member.role}</div>
                        </div>
                        
                        {/* Status - 2 columns */}
                        <div className="lg:col-span-2 flex items-center gap-3">
                          <Switch
                            checked={member.isActive}
                            onCheckedChange={() => toggleStaffStatus(member.id)}
                            className="data-[state=checked]:bg-green-600"
                          />
                          <Badge variant={member.isActive ? 'default' : 'secondary'} className="px-3 py-1">
                            {member.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        
                        {/* Contact Info - 3 columns */}
                        <div className="lg:col-span-3 space-y-2">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400 break-all">{member.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">{member.phone}</span>
                          </div>
                        </div>
                        
                        {/* Actions - 2 columns */}
                        <div className="lg:col-span-2 flex items-center gap-2">
                          <Button
                            onClick={() => removeStaff(member.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        {/* Invite Buttons - 2 columns */}
                        <div className="lg:col-span-2 flex items-center gap-2">
                          <Button
                            onClick={() => sendEmailInvite(member.email, member.name)}
                            variant="outline"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2"
                            title="Send email invite"
                          >
                            <Mail className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => sendSMSInvite(member.phone, member.name)}
                            variant="outline"
                            size="sm"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 p-2"
                            title="Send SMS invite"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="ghost"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="px-8 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl hover:opacity-90 transition-opacity duration-200 shadow-lg"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
      
      {/* Add Staff Modal */}
      <AddStaffModal 
        isOpen={isAddStaffModalOpen} 
        onClose={() => setIsAddStaffModalOpen(false)} 
        onAddStaff={handleAddStaff}
      />
    </Dialog>
  );
}
