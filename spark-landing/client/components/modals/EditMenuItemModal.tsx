import React, { useState, useRef, useEffect } from 'react';
import { DashboardDialog, DashboardDialogContent, DashboardDialogHeader, DashboardDialogTitle } from '../ui/dashboard-dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { Edit, Utensils, DollarSign, Tag, Image, Clock, Upload, X, Camera, Box, Sparkles } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  prepTime: number;
  available: boolean;
  dietary: string[];
  allergens: string[];
  rating: number;
  orders: number;
}

interface EditMenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItem: MenuItem | null;
  onSave: (updatedItem: MenuItem) => void;
}

const categories = [
  { value: 'appetizers', label: 'Appetizers' },
  { value: 'main-courses', label: 'Main Courses' },
  { value: 'desserts', label: 'Desserts' },
  { value: 'beverages', label: 'Beverages' },
  { value: 'sides', label: 'Sides' },
  { value: 'specials', label: 'Specials' }
];

const dietaryOptions = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Nut-Free',
  'Low-Carb',
  'High-Protein',
  'Keto-Friendly'
];

const allergenOptions = [
  'Nuts',
  'Dairy',
  'Gluten',
  'Soy',
  'Eggs',
  'Fish',
  'Shellfish',
  'Sesame'
];

export default function EditMenuItemModal({ isOpen, onClose, menuItem, onSave }: EditMenuItemModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    prepTime: '',
    available: true,
    dietary: [] as string[],
    allergens: [] as string[]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update form data when menuItem changes
  useEffect(() => {
    if (menuItem) {
      setFormData({
        name: menuItem.name,
        description: menuItem.description,
        price: menuItem.price.toString(),
        category: menuItem.category.toLowerCase().replace(/\s+/g, '-'),
        prepTime: menuItem.prepTime.toString(),
        available: menuItem.available,
        dietary: menuItem.dietary,
        allergens: menuItem.allergens
      });
    }
  }, [menuItem]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDietaryChange = (option: string) => {
    setFormData(prev => ({
      ...prev,
      dietary: prev.dietary.includes(option)
        ? prev.dietary.filter(d => d !== option)
        : [...prev.dietary, option]
    }));
  };

  const handleAllergenChange = (option: string) => {
    setFormData(prev => ({
      ...prev,
      allergens: prev.allergens.includes(option)
        ? prev.allergens.filter(a => a !== option)
        : [...prev.allergens, option]
    }));
  };

  const handlePriceChange = (value: string) => {
    // Allow user to type freely without automatic formatting
    setFormData(prev => ({ ...prev, price: value }));
  };

  const handlePriceBlur = () => {
    // Format price to two decimal places when user finishes editing
    const price = formData.price;
    if (price && price !== '') {
      const numPrice = parseFloat(price);
      if (!isNaN(numPrice)) {
        setFormData(prev => ({ ...prev, price: numPrice.toFixed(2) }));
      }
    }
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Menu item name is required",
        variant: "destructive",
      });
      return false;
    }

    // Validate price - trim, parse, and check range
    const trimmedPrice = formData.price?.trim();
    if (!trimmedPrice) {
      toast({
        title: "Validation Error",
        description: "Please enter a price",
        variant: "destructive",
      });
      return false;
    }

    const priceValue = parseFloat(trimmedPrice);
    if (isNaN(priceValue) || priceValue < 0.01 || priceValue > 10000) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid price between $0.01 and $10,000",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.category) {
      toast({
        title: "Validation Error",
        description: "Please select a category",
        variant: "destructive",
      });
      return false;
    }

    // Validate that the selected category exists in the categories list
    const categoryExists = categories.some(cat => cat.value === formData.category);
    if (!categoryExists) {
      toast({
        title: "Validation Error",
        description: "Please select a valid category from the list",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!menuItem || !validateForm()) return;

    setIsSubmitting(true);

    try {
      const updatedItem: MenuItem = {
        ...menuItem,
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: categories.find(cat => cat.value === formData.category)!.label,
        prepTime: parseInt(formData.prepTime) || 15,
        available: formData.available,
        dietary: formData.dietary,
        allergens: formData.allergens
      };

      onSave(updatedItem);

      toast({
        title: "Menu Item Updated",
        description: `${updatedItem.name} has been successfully updated`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update menu item",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!menuItem) return null;

  return (
    <DashboardDialog open={isOpen} onOpenChange={onClose}>
      <DashboardDialogContent className="max-w-3xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden max-h-[85vh] overflow-y-auto">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white/30 to-indigo-50/50 dark:from-blue-950/20 dark:via-gray-900/30 dark:to-indigo-950/20 pointer-events-none" />

        <div className="relative p-5 lg:p-6">
          <DashboardDialogHeader className="mb-6 lg:mb-7">
            <div className="flex items-center gap-3 mb-2">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Edit className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <div>
                <DashboardDialogTitle className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                  Edit Menu Item
                </DashboardDialogTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                  Update the details for {menuItem.name}
                </p>
              </div>
            </div>
          </DashboardDialogHeader>

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg">
                  <Utensils className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>
              </div>

              <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Item Name *
                    </Label>
                    <Input
                      id="edit-name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter menu item name"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-price" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Price *
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="edit-price"
                        value={formData.price}
                        onChange={(e) => handlePriceChange(e.target.value)}
                        onBlur={handlePriceBlur}
                        placeholder="0.00"
                        className="h-11 pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-category" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Category *
                    </Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-preptime" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Preparation Time (minutes)
                    </Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="edit-preptime"
                        value={formData.prepTime}
                        onChange={(e) => handleInputChange('prepTime', e.target.value)}
                        placeholder="15"
                        className="h-11 pl-10"
                        type="number"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <Label htmlFor="edit-description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </Label>
                  <Textarea
                    id="edit-description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe this menu item..."
                    className="min-h-[100px] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Dietary Information */}
            <div className="group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center shadow-lg">
                  <Box className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Dietary Information</h3>
              </div>

              <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                      Dietary Options
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {dietaryOptions.map((option) => (
                        <label key={option} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.dietary.includes(option)}
                            onChange={() => handleDietaryChange(option)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                      Allergens
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {allergenOptions.map((allergen) => (
                        <label key={allergen} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.allergens.includes(allergen)}
                            onChange={() => handleAllergenChange(allergen)}
                            className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{allergen}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSubmitting} className="min-w-[120px]">
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DashboardDialogContent>
    </DashboardDialog>
  );
}
