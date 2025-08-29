import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';
import { Plus, Users, MapPin, Star, Settings, Wifi, Zap, UserCheck } from 'lucide-react';

interface AddTableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddTableModal({ isOpen, onClose }: AddTableModalProps) {
  const [formData, setFormData] = useState({
    tableNumber: '',
    capacity: '',
    tableType: '',
    location: '',
    isActive: true,
    isReserved: false,
    isVIP: false,
    notes: '',
    minimumSpend: '',
    isOutdoor: false,
    hasView: false,
    hasWifi: false,
    isAccessible: false,
    hasChargingPorts: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log('Adding table:', formData);
    onClose();
  };

  const tableTypes = [
    'Standard Table',
    'High Top',
    'Booth',
    'Bar Seating',
    'Chef\'s Table',
    'Private Room',
    'Garden Table',
    'Window Table',
    'Corner Table',
    'Center Table'
  ];

  const locations = [
    'Main Dining Room',
    'Bar Area',
    'Garden/Patio',
    'Private Room 1',
    'Private Room 2',
    'Upstairs',
    'Basement',
    'Terrace',
    'Poolside',
    'Rooftop'
  ];



  const capacities = [
    { value: '2', label: '2 seats' },
    { value: '4', label: '4 seats' },
    { value: '6', label: '6 seats' },
    { value: '8', label: '8 seats' },
    { value: '10', label: '10 seats' },
    { value: '12', label: '12 seats' },
    { value: '15+', label: '15+ seats' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
              <DialogContent className="max-w-2xl lg:max-w-[calc(4xl-25px-20%)] bg-white dark:bg-[#1B2030] border-gray-200 dark:border-gray-800 rounded-2xl p-0 overflow-hidden max-h-[85vh] overflow-y-auto modal-centered-content">
        <div className="p-6 sm:p-8">
          <DialogHeader className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                  Add Table
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400">
                  Add a new table to your restaurant floor plan
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Settings className="w-4 h-4" />
                <h3 className="font-medium">Basic Information</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tableNumber">Table Number *</Label>
                  <Input
                    id="tableNumber"
                    value={formData.tableNumber}
                    onChange={(e) => handleInputChange('tableNumber', e.target.value)}
                    placeholder="e.g., 12, A1, VIP1"
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity *</Label>
                  <Select value={formData.capacity} onValueChange={(value) => handleInputChange('capacity', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select capacity" />
                    </SelectTrigger>
                    <SelectContent>
                      {capacities.map((capacity) => (
                        <SelectItem key={capacity.value} value={capacity.value}>
                          {capacity.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tableType">Table Type</Label>
                  <Select value={formData.tableType} onValueChange={(value) => handleInputChange('tableType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select table type" />
                    </SelectTrigger>
                    <SelectContent>
                      {tableTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Select value={formData.location} onValueChange={(value) => handleInputChange('location', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Active Status */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Star className="w-4 h-4" />
                <h3 className="font-medium">Active Status</h3>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Label htmlFor="isActive" className="text-sm font-medium">
                    Active
                  </Label>
                  <span className="text-sm text-gray-500">Table is available for seating</span>
                </div>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                />
              </div>
            </div>

            <Separator />

            {/* Features & Accessibility */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Settings className="w-4 h-4" />
                <h3 className="font-medium">Features & Accessibility</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Label htmlFor="hasWifi" className="flex items-center gap-2 text-sm font-medium">
                      <Wifi className="w-4 h-4" />
                      <span>WiFi Access</span>
                    </Label>
                    <span className="text-sm text-gray-500">Premium WiFi available</span>
                  </div>
                  <Switch
                    id="hasWifi"
                    checked={formData.hasWifi}
                    onCheckedChange={(checked) => handleInputChange('hasWifi', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Label htmlFor="isAccessible" className="flex items-center gap-2 text-sm font-medium">
                      <UserCheck className="w-4 h-4" />
                      <span>Accessible</span>
                    </Label>
                    <span className="text-sm text-gray-500">Wheelchair accessible</span>
                  </div>
                  <Switch
                    id="isAccessible"
                    checked={formData.isAccessible}
                    onCheckedChange={(checked) => handleInputChange('isAccessible', checked)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Label htmlFor="hasChargingPorts" className="flex items-center gap-2 text-sm font-medium">
                    <Zap className="w-4 h-4" />
                    <span>Charging Ports</span>
                  </Label>
                  <span className="text-sm text-gray-500">USB/Power outlets available</span>
                </div>
                <Switch
                  id="hasChargingPorts"
                  checked={formData.hasChargingPorts}
                  onCheckedChange={(checked) => handleInputChange('hasChargingPorts', checked)}
                />
              </div>
            </div>

            <Separator />

            {/* Additional Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Star className="w-4 h-4" />
                <h3 className="font-medium">Additional Features</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minimumSpend">Minimum Spend</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      id="minimumSpend"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.minimumSpend}
                      onChange={(e) => handleInputChange('minimumSpend', e.target.value)}
                      placeholder="0.00"
                      className="pl-8"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Table Notes</Label>
                  <Input
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Add any additional details about this table..."
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="isReserved" className="text-sm font-medium">Reserved Table</Label>
                  <Switch
                    id="isReserved"
                    checked={formData.isReserved}
                    onCheckedChange={(checked) => handleInputChange('isReserved', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="isVIP" className="text-sm font-medium">VIP Table</Label>
                  <Switch
                    id="isVIP"
                    checked={formData.isVIP}
                    onCheckedChange={(checked) => handleInputChange('isVIP', checked)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="isOutdoor" className="text-sm font-medium">Outdoor Table</Label>
                  <Switch
                    id="isOutdoor"
                    checked={formData.isOutdoor}
                    onCheckedChange={(checked) => handleInputChange('isOutdoor', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="hasView" className="text-sm font-medium">Premium View</Label>
                  <Switch
                    id="hasView"
                    checked={formData.hasView}
                    onCheckedChange={(checked) => handleInputChange('hasView', checked)}
                  />
                </div>
              </div>
            </div>



            {/* Table Summary */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Table Number:</span>
                  <span className="font-medium">{formData.tableNumber || 'Not specified'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Capacity:</span>
                  <span className="font-medium">{formData.capacity ? `${formData.capacity} seats` : 'Not specified'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Type:</span>
                  <span className="font-medium">{formData.tableType || 'Not specified'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Location:</span>
                  <span className="font-medium">{formData.location || 'Not specified'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Status:</span>
                  <span className="font-medium">{formData.isActive ? 'Active' : 'Inactive'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Features:</span>
                  <span className="font-medium">
                    {[
                      formData.hasWifi && 'WiFi',
                      formData.isAccessible && 'Accessible',
                      formData.hasChargingPorts && 'Charging'
                    ].filter(Boolean).join(', ') || 'None'}
                  </span>
                </div>
              </div>
            </div>
          </div>

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
              className="px-8 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:opacity-90 transition-opacity duration-200 shadow-lg"
            >
              Add Table
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
