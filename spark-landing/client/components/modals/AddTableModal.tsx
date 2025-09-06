import React, { useState } from 'react';
import { getModalClasses, MODAL_CONFIGS } from '../../utils/modalSizes';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Plus, Users, MapPin, Star, Settings, Wifi, Zap, UserCheck, Sparkles } from 'lucide-react';

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Validate required fields
    if (!formData.tableNumber?.trim()) {
      newErrors.tableNumber = 'Table number is required';
    }
    
    if (!formData.capacity) {
      newErrors.capacity = 'Capacity is required';
    }
    
    if (!formData.tableType) {
      newErrors.tableType = 'Table type is required';
    }
    
    if (!formData.location) {
      newErrors.location = 'Location is required';
    }
    
    // Validate table number format (alphanumeric)
    if (formData.tableNumber && !/^[a-zA-Z0-9]+$/.test(formData.tableNumber.trim())) {
      newErrors.tableNumber = 'Table number can only contain letters and numbers';
    }
    
    // Validate capacity is a positive number
    if (formData.capacity && !/^\d+$/.test(formData.capacity)) {
      newErrors.capacity = 'Capacity must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      onClose();
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
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
      <DialogContent className="max-w-3xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden max-h-[85vh] overflow-y-auto ml-[132px]">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-white/30 to-red-50/50 dark:from-orange-950/20 dark:via-gray-900/30 dark:to-red-950/20 pointer-events-none" />

        <div className="relative p-5 lg:p-6">
          <DialogHeader className="mb-6 lg:mb-7">
            <div className="flex items-center gap-3 mb-2">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <div>
                <DialogTitle className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                  Add Table
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400 mt-0.5 text-sm">
                  Add a new table to your restaurant floor plan
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Information */}
            <Card className="bg-gray-50/50 dark:bg-gray-800/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
              
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tableNumber" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Table Number *
                    </Label>
                    <Input
                      id="tableNumber"
                      value={formData.tableNumber}
                      onChange={(e) => handleInputChange('tableNumber', e.target.value)}
                      placeholder="e.g., 12, A1, VIP1"
                      className={`w-full h-11 bg-white/90 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 ${
                        errors.tableNumber ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                      }`}
                    />
                    {errors.tableNumber && (
                      <p className="text-sm text-red-500 mt-1">{errors.tableNumber}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="capacity" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Capacity *
                    </Label>
                    <Select value={formData.capacity} onValueChange={(value) => handleInputChange('capacity', value)}>
                      <SelectTrigger className={`h-11 bg-white/90 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 ${
                        errors.capacity ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                      }`}>
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
                    {errors.capacity && (
                      <p className="text-sm text-red-500 mt-1">{errors.capacity}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tableType" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Table Type *
                  </Label>
                  <Select value={formData.tableType} onValueChange={(value) => handleInputChange('tableType', value)}>
                    <SelectTrigger className={`h-11 bg-white/90 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 ${
                      errors.tableType ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                    }`}>
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
                  {errors.tableType && (
                    <p className="text-sm text-red-500 mt-1">{errors.tableType}</p>
                    )}
                </div>
              </CardContent>
            </Card>

            {/* Active Status */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  Active Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Active
                    </Label>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Table is available for seating</span>
                  </div>
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Features & Accessibility */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  Features & Accessibility
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Label htmlFor="hasWifi" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <Wifi className="w-4 h-4 text-blue-600" />
                        <span>WiFi Access</span>
                      </Label>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Premium WiFi available</span>
                    </div>
                    <Switch
                      id="hasWifi"
                      checked={formData.hasWifi}
                      onCheckedChange={(checked) => handleInputChange('hasWifi', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Label htmlFor="isAccessible" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <UserCheck className="w-4 h-4 text-green-600" />
                        <span>Accessible</span>
                      </Label>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Wheelchair accessible</span>
                    </div>
                    <Switch
                      id="isAccessible"
                      checked={formData.isAccessible}
                      onCheckedChange={(checked) => handleInputChange('isAccessible', checked)}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Label htmlFor="hasChargingPorts" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <Zap className="w-4 h-4 text-yellow-600" />
                      <span>Charging Ports</span>
                    </Label>
                    <span className="text-sm text-gray-500 dark:text-gray-400">USB/Power outlets available</span>
                  </div>
                  <Switch
                    id="hasChargingPorts"
                    checked={formData.hasChargingPorts}
                    onCheckedChange={(checked) => handleInputChange('hasChargingPorts', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Additional Features */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  Additional Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
              
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Table Notes
                  </Label>
                  <Input
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Add any additional details about this table..."
                    className="w-full h-11 bg-white/90 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <Label htmlFor="isReserved" className="text-sm font-medium text-gray-700 dark:text-gray-300">Reserved Table</Label>
                    <Switch
                      id="isReserved"
                      checked={formData.isReserved}
                      onCheckedChange={(checked) => handleInputChange('isReserved', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <Label htmlFor="isVIP" className="text-sm font-medium text-gray-700 dark:text-gray-300">VIP Table</Label>
                    <Switch
                      id="isVIP"
                      checked={formData.isVIP}
                      onCheckedChange={(checked) => handleInputChange('isVIP', checked)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <Label htmlFor="isOutdoor" className="text-sm font-medium text-gray-700 dark:text-gray-300">Outdoor Table</Label>
                    <Switch
                      id="isOutdoor"
                      checked={formData.isOutdoor}
                      onCheckedChange={(checked) => handleInputChange('isOutdoor', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <Label htmlFor="hasView" className="text-sm font-medium text-gray-700 dark:text-gray-300">Premium View</Label>
                    <Switch
                      id="hasView"
                      checked={formData.hasView}
                      onCheckedChange={(checked) => handleInputChange('hasView', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>



            {/* Table Summary */}
            <Card className="bg-gradient-to-r from-orange-50/50 via-white/30 to-red-50/50 dark:from-orange-950/20 dark:via-gray-900/30 dark:to-red-950/20 border-orange-200/50 dark:border-orange-700/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Plus className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  Table Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Table Number:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formData.tableNumber || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Capacity:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formData.capacity ? `${formData.capacity} seats` : 'Not specified'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Type:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formData.tableType || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Status:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formData.isActive ? 'Active' : 'Inactive'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Features:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {[
                        formData.hasWifi && 'WiFi',
                        formData.isAccessible && 'Accessible',
                        formData.hasChargingPorts && 'Charging'
                      ].filter(Boolean).join(', ') || 'None'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="relative mt-6">
            <div className="flex items-center justify-between pt-6">
              <Button
                variant="ghost"
                onClick={onClose}
                className="px-6 py-3 h-auto text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 font-medium"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSubmitting}
                className="px-8 py-3 h-auto bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:via-red-600 hover:to-orange-700 transition-all duration-200 shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 transform hover:scale-[1.02] font-semibold relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Adding...' : 'Add Table'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
