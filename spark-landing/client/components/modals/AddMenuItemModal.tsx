import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { Plus, Utensils, DollarSign, Tag, Image, Clock, Upload, X, Camera, Box, Sparkles } from 'lucide-react';
import { Combobox } from '../ui/combobox';
import MissingInformationModal from './MissingInformationModal';
import ErrorModal from './ErrorModal';
import ConfirmationModal from './ConfirmationModal';
import {
  handlePriceInput,
  handlePriceBlur as validatePriceBlur,
  validatePrice,
  getPriceError,
  validateName,
  getNameError
} from '../../utils/validation';

interface AddMenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddMenuItemModal({ isOpen, onClose }: AddMenuItemModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    customCategory: '',
    preparationTime: '',
    isAvailable: true,
    isVegetarian: false,
    isGlutenFree: false,
    calories: '',
    allergens: '',
    imageUrl: '',
    imageFile: null as File | null,
    arModelFile: null as File | null
  });

  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedARModel, setUploadedARModel] = useState<string | null>(null);
  const [isPriceFormatted, setIsPriceFormatted] = useState(false);
  const [showMissingInfoModal, setShowMissingInfoModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const arModelInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePriceChange = (value: string) => {
    // Allow user to type freely without automatic formatting
    setFormData(prev => ({ ...prev, price: value }));
    // Reset formatted state when user starts typing again
    if (isPriceFormatted) {
      setIsPriceFormatted(false);
    }
  };

  const handlePriceBlur = () => {
    // Format price to two decimal places when user finishes editing
    const price = formData.price;
    if (price && price !== '') {
      const numPrice = parseFloat(price);
      if (!isNaN(numPrice)) {
        setFormData(prev => ({ ...prev, price: numPrice.toFixed(2) }));
        setIsPriceFormatted(true);
      }
    }
  };

  const handlePriceKeyDown = (e: React.KeyboardEvent) => {
    // Format price on Enter key
    if (e.key === 'Enter') {
      handlePriceBlur();
    }
  };

  const handleCategoryChange = (value: string) => {
    // Check if this is a predefined category
    const predefinedCategory = categories.find(cat => cat.value === value);
    
    if (predefinedCategory) {
      setShowCustomCategory(false);
      setFormData(prev => ({ ...prev, category: value, customCategory: '' }));
    } else {
      // This is a custom category
      setShowCustomCategory(false);
      setFormData(prev => ({ ...prev, category: 'custom', customCategory: value }));
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, imageFile: file }));
      const reader = new FileReader();
      reader.onload = (e) => setUploadedImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleARModelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, arModelFile: file }));
      setUploadedARModel(file.name);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, imageFile: null }));
    setUploadedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeARModel = () => {
    setFormData(prev => ({ ...prev, arModelFile: null }));
    setUploadedARModel(null);
    if (arModelInputRef.current) arModelInputRef.current.value = '';
  };

  const handleSave = () => {
    // Prepare the final category value
    const finalCategory = formData.category === 'custom' ? formData.customCategory : formData.category;

    // Validate required fields
    const requiredFields = [];
    if (!formData.name?.trim()) {
      requiredFields.push('Item Name');
    }
    if (!formData.price?.trim()) {
      requiredFields.push('Price');
    }
    if (!finalCategory?.trim()) {
      requiredFields.push('Category');
    }

    if (requiredFields.length > 0) {
      setMissingFields(requiredFields);
      setShowMissingInfoModal(true);
      return;
    }

    // Show confirmation modal
    setShowConfirmationModal(true);
  };

  const handleConfirmSave = async () => {
    setIsSubmitting(true);

    try {
      // Prepare the final category value
      const finalCategory =
        formData.category === 'custom'
          ? formData.customCategory
          : formData.category;

      // Create the final menu item data
      const menuItemData = {
        ...formData,
        category: finalCategory,
      };

      // Simulate API call for demo purposes
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // TODO: Replace with actual API call to backend service
      // Example: const response = await api.createMenuItem(menuItemData);

      setShowConfirmationModal(false);
      onClose();
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? error.message
          : 'Failed to save menu item. Please try again.';
      setErrorMessage(errorMsg);
      setShowErrorModal(true);
      setShowConfirmationModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { value: 'appetizers', label: 'Appetizers' },
    { value: 'main-courses', label: 'Main Courses' },
    { value: 'desserts', label: 'Desserts' },
    { value: 'beverages', label: 'Beverages' },
    { value: 'salads', label: 'Salads' },
    { value: 'soups', label: 'Soups' },
    { value: 'sides', label: 'Sides' },
    { value: 'specials', label: 'Specials' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-3xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden max-h-[85vh] overflow-y-auto ml-[132px]">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-white/30 to-green-50/50 dark:from-emerald-950/20 dark:via-gray-900/30 dark:to-green-950/20 pointer-events-none" />

        <div className="relative p-5 lg:p-6">
          {/* Enhanced Header */}
          <DialogHeader className="mb-6 lg:mb-7">
            <div className="flex items-center gap-3 mb-2">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <div>
                <DialogTitle className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                  Add Menu Item
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400 mt-0.5 text-sm">
                  Create a new menu item for your restaurant
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Utensils className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Essential details about your menu item</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Item Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., Grilled Salmon"
                    className="w-full h-12 bg-white/80 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="category" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Category *
                  </Label>
                  <Combobox
                    options={categories}
                    value={formData.category === 'custom' ? formData.customCategory : formData.category}
                    onValueChange={handleCategoryChange}
                    placeholder="Select or enter category..."
                    searchPlaceholder="Search or enter category type..."
                    emptyText="No categories found."
                    customText="Use custom category"
                    allowCustom={true}
                  />

                  {formData.category === 'custom' && formData.customCategory && (
                    <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                          Custom Category
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Using custom category: <span className="font-medium">"{formData.customCategory}"</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3 mt-6">
                <Label htmlFor="description" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the dish, ingredients, and preparation method..."
                  rows={4}
                  className="w-full bg-white/80 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 resize-none"
                />
              </div>
            </div>

            {/* Elegant separator */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <div className="px-4 bg-gradient-to-r from-white/80 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-800/80 rounded-full">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Pricing & Availability</span>
                </div>
              </div>
            </div>

            {/* Pricing & Availability */}
            <div className="group">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pricing & Availability</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Set pricing and manage availability</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="price" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Price *
                  </Label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center shadow-sm">
                      <span className="text-white font-bold text-sm">$</span>
                    </div>
                    <Input
                      id="price"
                      type="text"
                      inputMode="decimal"
                      value={formData.price}
                      onChange={(e) => handlePriceChange(handlePriceInput(e.target.value))}
                      onBlur={() => {
                        const formatted = validatePriceBlur(formData.price);
                        setFormData(prev => ({ ...prev, price: formatted }));
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const formatted = validatePriceBlur(formData.price);
                          setFormData(prev => ({ ...prev, price: formatted }));
                        }
                      }}
                      placeholder="0.00"
                      className="pl-14 pr-4 h-12 bg-white/80 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200 font-semibold text-lg"
                    />
                    {/* Subtle decimal hint */}
                    {formData.price && !formData.price.includes('.') && (
                      <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm font-medium">
                        .00
                      </span>
                    )}
                  </div>
                  {/* Formatted price display below input */}
                  {formData.price && (
                    <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                        Final Price: <span className="font-bold">${parseFloat(formData.price).toFixed(2)}</span>
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="preparationTime" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Prep Time
                  </Label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center shadow-sm">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <Input
                      id="preparationTime"
                      type="number"
                      min="0"
                      value={formData.preparationTime}
                      onChange={(e) => handleInputChange('preparationTime', e.target.value)}
                      placeholder="15"
                      className="pl-14 pr-4 h-12 bg-white/80 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 font-semibold"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">
                      mins
                    </div>
                  </div>
                </div>
              </div>

              {/* Availability Toggle */}
              <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                      <Tag className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Available for Ordering</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Make this item visible to customers</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="isAvailable"
                      checked={formData.isAvailable}
                      onChange={(e) => handleInputChange('isAvailable', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-indigo-500"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Elegant separator */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <div className="px-4 bg-gradient-to-r from-white/80 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-800/80 rounded-full">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Dietary Information</span>
                </div>
              </div>
            </div>

            {/* Dietary Information */}
            <div className="group">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/25">
                  <Tag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Dietary Information</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Help customers with dietary preferences</p>
                </div>
              </div>

              {/* Dietary Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 items-stretch">
                <div className="group/dietary">
                  <label className="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 transition-all duration-200 cursor-pointer min-h-[72px]">
                    <input
                      type="checkbox"
                      id="isVegetarian"
                      checked={formData.isVegetarian}
                      onChange={(e) => handleInputChange('isVegetarian', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-lg mr-3 peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-emerald-500 peer-checked:border-green-500 transition-all duration-200 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-sm opacity-0 peer-checked:opacity-100 transition-opacity duration-200"></div>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white peer-checked:text-green-700 dark:peer-checked:text-green-300 transition-colors duration-200">
                      Vegetarian
                    </span>
                  </label>
                </div>

                <div className="group/dietary">
                  <label className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 cursor-pointer min-h-[72px]">
                    <input
                      type="checkbox"
                      id="isGlutenFree"
                      checked={formData.isGlutenFree}
                      onChange={(e) => handleInputChange('isGlutenFree', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-lg mr-3 peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-indigo-500 peer-checked:border-blue-500 transition-all duration-200 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-sm opacity-0 peer-checked:opacity-100 transition-opacity duration-200"></div>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white peer-checked:text-blue-700 dark:peer-checked:text-blue-300 transition-colors duration-200">
                      Gluten Free
                    </span>
                  </label>
                </div>

                <div className="group/dietary">
                  <div className="flex items-center p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-600 transition-all duration-200 min-h-[72px]">
                    <span className="font-medium text-gray-900 dark:text-white mr-3 flex-shrink-0">Calories</span>
                    <div className="relative flex-1 ml-2">
                      <input
                        id="calories"
                        type="number"
                        min="0"
                        value={formData.calories}
                        onChange={(e) => handleInputChange('calories', e.target.value)}
                        placeholder="250"
                        className="w-full h-10 bg-white/90 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-600 rounded-lg px-3 pr-12 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200 text-sm"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs font-medium">
                        kcal
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="allergens" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Allergens
                </Label>
                <Input
                  id="allergens"
                  value={formData.allergens}
                  onChange={(e) => handleInputChange('allergens', e.target.value)}
                  placeholder="e.g., Nuts, Dairy, Shellfish"
                  className="w-full h-12 bg-white/80 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  List all allergens separated by commas
                </p>
              </div>
            </div>

            {/* Elegant separator */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <div className="px-4 bg-gradient-to-r from-white/80 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-800/80 rounded-full">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Media & Assets</span>
                </div>
              </div>
            </div>

            {/* Condensed Media Section */}
            <div className="group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/25">
                  <Image className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Media & Assets</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Enhance your menu item with visuals</p>
                </div>
              </div>

              {/* Compact Upload Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                {/* Image Upload */}
                <div className="space-y-3">
                  {!uploadedImage ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center cursor-pointer hover:border-emerald-400 dark:hover:border-emerald-500 transition-all duration-200 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 group/upload"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-950/50 dark:to-green-950/50 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover/upload:scale-110 transition-transform duration-200">
                        <Camera className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Item Image</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Upload high-quality image
                      </p>
                    </div>
                  ) : (
                    <div className="relative bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-700">
                      <div className="flex items-center gap-3">
                        <img
                          src={uploadedImage}
                          alt="Preview"
                          className="w-14 h-14 object-cover rounded-lg border-2 border-white dark:border-gray-600 shadow-md"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">Image Uploaded</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Ready</span>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={removeImage}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg p-1 h-auto"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* AR Model Upload */}
                <div className="space-y-3">
                  {!uploadedARModel ? (
                    <div
                      onClick={() => arModelInputRef.current?.click()}
                      className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center cursor-pointer hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-200 hover:bg-purple-50/30 dark:hover:bg-purple-950/20 group/upload"
                    >
                      <input
                        ref={arModelInputRef}
                        type="file"
                        accept=".glb,.gltf,.obj,.fbx,.dae"
                        onChange={handleARModelUpload}
                        className="hidden"
                      />
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-950/50 dark:to-indigo-950/50 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover/upload:scale-110 transition-transform duration-200">
                        <Box className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-1">AR Model</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Optional 3D model
                      </p>
                    </div>
                  ) : (
                    <div className="relative bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 rounded-xl p-4 border border-purple-200 dark:border-purple-700">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-950/50 dark:to-indigo-950/50 rounded-lg flex items-center justify-center border-2 border-white dark:border-gray-600 shadow-md">
                          <Box className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">AR Model</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">Ready</span>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={removeARModel}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg p-1 h-auto"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Image URL Input - Compact */}
              <div className="space-y-2">
                <Label htmlFor="imageUrl" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Image URL <span className="text-xs font-normal text-gray-500">(Alternative)</span>
                </Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full h-11 bg-white/80 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all duration-200 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Enhanced Footer */}
          <div className="relative mt-6">
            <div className="flex items-center justify-between pt-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-slate-100 dark:from-gray-800 dark:to-slate-800 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Ready to add this item?</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Double-check your information before saving</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
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
                  className="px-8 py-3 h-auto bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transform hover:scale-[1.02] font-semibold relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Menu Item
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Missing Information Modal */}
      <MissingInformationModal
        isOpen={showMissingInfoModal}
        onClose={() => setShowMissingInfoModal(false)}
        missingFields={missingFields}
      />

      {/* Error Modal */}
      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        message={errorMessage}
        showRetry={true}
        onRetry={() => {
          setShowErrorModal(false);
          setShowConfirmationModal(true);
        }}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        onConfirm={handleConfirmSave}
        title="Add Menu Item"
        message="Are you sure you want to add this menu item? This will make it available to customers."
        confirmText="Add Item"
        type="success"
        isLoading={isSubmitting}
      />
    </Dialog>
  );
}
