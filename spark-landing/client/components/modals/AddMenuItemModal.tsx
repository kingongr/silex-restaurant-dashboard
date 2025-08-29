import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { Plus, Utensils, DollarSign, Tag, Image, Clock, Upload, X, Camera, Box } from 'lucide-react';
import { Combobox } from '../ui/combobox';
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
    if (!formData.name) {
      alert('Please enter the item name');
      return;
    }
    
    if (!formData.category) {
      alert('Please select a category');
      return;
    }
    
    if (formData.category === 'custom' && !formData.customCategory?.trim()) {
      alert('Please enter a custom category name');
      return;
    }

    // Create the final menu item data
    const menuItemData = {
      ...formData,
      category: finalCategory
    };

    console.log('Adding menu item:', menuItemData);
    onClose();
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
    <Dialog open={isOpen} onOpenChange={onClose}>
              <DialogContent className="max-w-2xl lg:max-w-[calc(4xl-25px-20%)] bg-white dark:bg-[#1B2030] border-gray-200 dark:border-gray-800 rounded-2xl p-0 overflow-hidden max-h-[85vh] overflow-y-auto modal-centered-content">
        <div className="p-6 sm:p-8">
          <DialogHeader className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                  Add Menu Item
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400">
                  Create a new menu item for your restaurant
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Utensils className="w-4 h-4" />
                <h3 className="font-medium">Basic Information</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Item Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., Grilled Salmon"
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
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
                    <div className="mt-2">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          Custom Category
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Using custom category: "{formData.customCategory}"
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the dish, ingredients, and preparation method..."
                  rows={3}
                  className="w-full"
                />
              </div>
            </div>

            <Separator />

            {/* Pricing & Availability */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <DollarSign className="w-4 h-4" />
                <h3 className="font-medium">Pricing & Availability</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
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
                      className="pl-8"
                    />
                    {/* Subtle decimal hint */}
                    {formData.price && !formData.price.includes('.') && (
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm">
                        .00
                      </span>
                    )}
                  </div>
                  {/* Formatted price display below input */}
                  {formData.price && (
                    <p className="text-sm text-gray-400 transition-colors duration-200">
                      Price: ${parseFloat(formData.price).toFixed(2)}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="preparationTime">Prep Time (mins)</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      id="preparationTime"
                      type="number"
                      min="0"
                      value={formData.preparationTime}
                      onChange={(e) => handleInputChange('preparationTime', e.target.value)}
                      placeholder="15"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isAvailable"
                    checked={formData.isAvailable}
                    onChange={(e) => handleInputChange('isAvailable', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="isAvailable">Available for ordering</Label>
                </div>
              </div>
            </div>

            <Separator />

            {/* Dietary Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Tag className="w-4 h-4" />
                <h3 className="font-medium">Dietary Information</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isVegetarian"
                    checked={formData.isVegetarian}
                    onChange={(e) => handleInputChange('isVegetarian', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="isVegetarian">Vegetarian</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isGlutenFree"
                    checked={formData.isGlutenFree}
                    onChange={(e) => handleInputChange('isGlutenFree', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="isGlutenFree">Gluten Free</Label>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="calories">Calories</Label>
                  <Input
                    id="calories"
                    type="number"
                    min="0"
                    value={formData.calories}
                    onChange={(e) => handleInputChange('calories', e.target.value)}
                    placeholder="250"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="allergens">Allergens</Label>
                <Input
                  id="allergens"
                  value={formData.allergens}
                  onChange={(e) => handleInputChange('allergens', e.target.value)}
                  placeholder="e.g., Nuts, Dairy, Shellfish"
                  className="w-full"
                />
              </div>
            </div>

            <Separator />

            {/* Image & AR Model */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Image className="w-4 h-4" />
                <h3 className="font-medium">Item Image & AR Model</h3>
              </div>
              
              {/* Image Upload */}
              <div className="space-y-3">
                <Label>Item Image</Label>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Image
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  {uploadedImage && (
                    <div className="flex items-center gap-2">
                      <img 
                        src={uploadedImage} 
                        alt="Preview" 
                        className="w-12 h-12 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeImage}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500">Upload a high-quality image of your menu item</p>
              </div>

              {/* AR Model Upload */}
              <div className="space-y-3">
                <Label>AR Model (Optional)</Label>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => arModelInputRef.current?.click()}
                    className="flex items-center gap-2"
                  >
                    <Box className="w-4 h-4" />
                    Upload AR Model
                  </Button>
                  <input
                    ref={arModelInputRef}
                    type="file"
                    accept=".glb,.gltf,.obj,.fbx,.dae"
                    onChange={handleARModelUpload}
                    className="hidden"
                  />
                  {uploadedARModel && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-lg">
                        <Box className="w-4 h-4" />
                        <span className="text-sm font-medium">{uploadedARModel}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeARModel}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500">Upload 3D models for AR visualization (GLB, GLTF, OBJ, FBX, DAE)</p>
              </div>

              {/* Legacy Image URL (fallback) */}
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL (Fallback)</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full"
                />
                <p className="text-sm text-gray-500">Use this if you prefer to provide an image URL instead of uploading</p>
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
              className="px-8 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:opacity-90 transition-opacity duration-200 shadow-lg"
            >
              Add Menu Item
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
