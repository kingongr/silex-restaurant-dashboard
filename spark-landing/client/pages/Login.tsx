import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { 
  Eye, EyeOff, Lock, Mail, User, Phone, Building, 
  UserCog, Users, Crown, MapPin, Clock, Utensils, 
  Table, Upload, Image, Sparkles, Check, ArrowLeft, ArrowRight 
} from 'lucide-react'

type AccountCreationStep = 
  | 'auth' 
  | 'role' 
  | 'restaurant-choice' 
  | 'restaurant-info' 
  | 'menu-setup' 
  | 'tables-setup' 
  | 'join-restaurant' 
  | 'complete'

type UserRole = 'admin' | 'manager' | 'staff'

interface UserData {
  name: string
  email: string
  phone: string
  password: string
  role?: UserRole
}

interface RestaurantData {
  name: string
  address: string
  city: string
  phone: string
  email: string
  cuisine: string
  description: string
}

interface MenuData {
  categories: string[]
  sampleItems: Array<{
    name: string
    description: string
    price: number
    category: string
  }>
}

interface TableData {
  tables: Array<{
    number: number
    capacity: number
    location: string
  }>
}

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [currentStep, setCurrentStep] = useState<AccountCreationStep>('auth')
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  })

  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: undefined
  })

  const [restaurantData, setRestaurantData] = useState<RestaurantData>({
    name: '',
    address: '',
    city: '',
    phone: '',
    email: '',
    cuisine: '',
    description: ''
  })

  const [cuisineInput, setCuisineInput] = useState('')
  const [showCuisineDropdown, setShowCuisineDropdown] = useState(false)
  const cuisineDropdownRef = useRef<HTMLDivElement>(null)

  const [menuData, setMenuData] = useState<MenuData>({
    categories: ['Appetizers', 'Main Courses', 'Desserts', 'Beverages'],
    sampleItems: []
  })

  const [menuImage, setMenuImage] = useState<File | null>(null)
  const [isAnalyzingMenu, setIsAnalyzingMenu] = useState(false)
  const [aiAnalyzed, setAiAnalyzed] = useState(false)

  const [tableData, setTableData] = useState<TableData>({
    tables: []
  })

  const [joinRestaurantCode, setJoinRestaurantCode] = useState('')
  const [errors, setErrors] = useState<any>({})

  const cuisineOptions = [
    'Italian', 'French', 'American', 'Asian', 'Mediterranean', 'Mexican', 
    'Indian', 'Chinese', 'Japanese', 'Thai', 'Vietnamese', 'Korean', 
    'Greek', 'Spanish', 'Turkish', 'Lebanese', 'Moroccan', 'Ethiopian', 
    'Brazilian', 'Argentinian', 'Fusion', 'Contemporary', 'Traditional', 
    'Seafood', 'Steakhouse', 'Vegetarian', 'Vegan', 'Fast Food', 
    'Casual Dining', 'Fine Dining', 'Cafe', 'Bistro', 'Bakery', 
    'Pizzeria', 'BBQ', 'Other'
  ]

  // Validation functions
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validatePassword = (password: string) => {
    return password.length >= 6
  }

  const validatePhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '')
    return cleaned.length === 10
  }

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    const limited = cleaned.slice(0, 10)
    
    if (limited.length >= 6) {
      return `${limited.slice(0, 3)}-${limited.slice(3, 6)}-${limited.slice(6)}`
    } else if (limited.length >= 3) {
      return `${limited.slice(0, 3)}-${limited.slice(3)}`
    } else {
      return limited
    }
  }

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value)
    setUserData(prev => ({ ...prev, phone: formatted }))
  }

  const handleRestaurantPhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value)
    setRestaurantData(prev => ({ ...prev, phone: formatted }))
  }

  // Step navigation
  const handleNextStep = () => {
    const stepErrors: any = {}
    
    switch (currentStep) {
      case 'auth':
        if (!userData.name) stepErrors.name = 'Name is required'
        if (!userData.email) stepErrors.email = 'Email is required'
        else if (!validateEmail(userData.email)) stepErrors.email = 'Please enter a valid email'
        if (!userData.phone) stepErrors.phone = 'Phone is required'
        else if (!validatePhone(userData.phone)) stepErrors.phone = 'Please enter a valid 10-digit phone number'
        if (!userData.password) stepErrors.password = 'Password is required'
        else if (!validatePassword(userData.password)) stepErrors.password = 'Password must be at least 6 characters'
        
        if (Object.keys(stepErrors).length === 0) {
          setCurrentStep('role')
        }
        break
        
      case 'role':
        if (!userData.role) stepErrors.role = 'Please select your role'
        
        if (Object.keys(stepErrors).length === 0) {
          if (userData.role === 'admin') {
            setCurrentStep('restaurant-choice')
          } else {
            setCurrentStep('join-restaurant')
          }
        }
        break
        
      case 'restaurant-choice':
        // No validation needed, user chooses between create or join
        break
        
      case 'restaurant-info':
        if (!restaurantData.name) stepErrors.restaurantName = 'Restaurant name is required'
        if (!restaurantData.address) stepErrors.address = 'Address is required'
        if (!restaurantData.city) stepErrors.city = 'City is required'
        if (!restaurantData.phone) stepErrors.restaurantPhone = 'Restaurant phone is required'
        else if (!validatePhone(restaurantData.phone)) stepErrors.restaurantPhone = 'Please enter a valid 10-digit phone number'
        if (!restaurantData.email) stepErrors.restaurantEmail = 'Restaurant email is required'
        else if (!validateEmail(restaurantData.email)) stepErrors.restaurantEmail = 'Please enter a valid email'
        if (!restaurantData.cuisine) stepErrors.cuisine = 'Cuisine type is required'
        
        if (Object.keys(stepErrors).length === 0) {
          setCurrentStep('menu-setup')
        }
        break
        
      case 'menu-setup':
        if (menuData.categories.length === 0) stepErrors.categories = 'At least one category is required'
        if (menuData.sampleItems.length === 0) stepErrors.items = 'At least one menu item is required'
        
        if (Object.keys(stepErrors).length === 0) {
          setCurrentStep('tables-setup')
        }
        break
        
      case 'tables-setup':
        if (tableData.tables.length === 0) stepErrors.tables = 'At least one table is required'
        
        if (Object.keys(stepErrors).length === 0) {
          setCurrentStep('complete')
        }
        break
        
      case 'join-restaurant':
        if (!joinRestaurantCode) stepErrors.code = 'Restaurant code is required'
        else if (joinRestaurantCode.length < 6) stepErrors.code = 'Restaurant code must be at least 6 characters'
        
        if (Object.keys(stepErrors).length === 0) {
          setCurrentStep('complete')
        }
        break
    }
    
    setErrors(stepErrors)
  }

  const handlePreviousStep = () => {
    switch (currentStep) {
      case 'role':
        setCurrentStep('auth')
        break
      case 'restaurant-choice':
        setCurrentStep('role')
        break
      case 'restaurant-info':
        setCurrentStep('restaurant-choice')
        break
      case 'menu-setup':
        setCurrentStep('restaurant-info')
        break
      case 'tables-setup':
        setCurrentStep('menu-setup')
        break
      case 'join-restaurant':
        setCurrentStep('role')
        break
    }
    setErrors({})
  }

  // Menu and table management
  const addMenuItem = () => {
    setMenuData(prev => ({
      ...prev,
      sampleItems: [...prev.sampleItems, {
        name: '',
        description: '',
        price: 0,
        category: prev.categories[0] || ''
      }]
    }))
  }

  const updateMenuItem = (index: number, field: string, value: any) => {
    setMenuData(prev => ({
      ...prev,
      sampleItems: prev.sampleItems.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  const removeMenuItem = (index: number) => {
    setMenuData(prev => ({
      ...prev,
      sampleItems: prev.sampleItems.filter((_, i) => i !== index)
    }))
  }

  const addTable = () => {
    const nextTableNumber = Math.max(...tableData.tables.map(t => t.number), 0) + 1
    setTableData(prev => ({
      ...prev,
      tables: [...prev.tables, {
        number: nextTableNumber,
        capacity: 4,
        location: 'Main Dining Area'
      }]
    }))
  }

  const updateTable = (index: number, field: string, value: any) => {
    setTableData(prev => ({
      ...prev,
      tables: prev.tables.map((table, i) => 
        i === index ? { ...table, [field]: value } : table
      )
    }))
  }

  const removeTable = (index: number) => {
    setTableData(prev => ({
      ...prev,
      tables: prev.tables.filter((_, i) => i !== index)
    }))
  }

  const handleMenuImageUpload = async (file: File) => {
    setMenuImage(file)
    setIsAnalyzingMenu(true)
    
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Mock AI-generated menu items based on common restaurant menu items
    const mockAnalyzedItems = [
      {
        name: "Caesar Salad",
        description: "Fresh romaine lettuce with parmesan cheese, croutons, and caesar dressing",
        price: 12.99,
        category: "Appetizers"
      },
      {
        name: "Grilled Salmon",
        description: "Fresh Atlantic salmon grilled to perfection with lemon herb butter",
        price: 24.99,
        category: "Main Courses"
      },
      {
        name: "Chocolate Lava Cake",
        description: "Warm chocolate cake with molten center, served with vanilla ice cream",
        price: 8.99,
        category: "Desserts"
      },
      {
        name: "House Wine",
        description: "Selection of red and white wines from our curated collection",
        price: 7.99,
        category: "Beverages"
      },
      {
        name: "Margherita Pizza",
        description: "Classic pizza with fresh mozzarella, basil, and tomato sauce",
        price: 16.99,
        category: "Main Courses"
      }
    ]
    
    setMenuData(prev => ({
      ...prev,
      sampleItems: mockAnalyzedItems
    }))
    
    setAiAnalyzed(true)
    setIsAnalyzingMenu(false)
  }

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      handleMenuImageUpload(file)
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleMenuImageUpload(file)
    }
  }

  // Handle clicks outside cuisine dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cuisineDropdownRef.current && !cuisineDropdownRef.current.contains(event.target as Node)) {
        setShowCuisineDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Step titles and descriptions
  const getStepTitle = () => {
    switch (currentStep) {
      case 'auth': return 'Create Your Account'
      case 'role': return 'Select Your Role'
      case 'restaurant-choice': return 'Restaurant Setup'
      case 'restaurant-info': return 'Restaurant Information'
      case 'menu-setup': return 'Menu Setup'
      case 'tables-setup': return 'Tables Setup'
      case 'join-restaurant': return 'Join Restaurant'
      case 'complete': return 'Registration Complete'
      default: return 'Create Account'
    }
  }

  const getStepDescription = () => {
    switch (currentStep) {
      case 'auth': return 'Enter your personal information to get started.'
      case 'role': return 'What is your role in the restaurant?'
      case 'restaurant-choice': return 'Would you like to create a new restaurant or join an existing one?'
      case 'restaurant-info': return 'Tell us about your restaurant.'
      case 'menu-setup': return 'Set up your menu categories and initial items.'
      case 'tables-setup': return 'Configure your restaurant tables.'
      case 'join-restaurant': return 'Enter the restaurant code to join.'
      case 'complete': return 'Your account has been created successfully!'
      default: return ''
    }
  }

  // Simple login form
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Login successful! You can now access the dashboard at /')
    setFormData({ email: '', password: '', fullName: '' })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setFormData({ email: '', password: '', fullName: '' })
    setCurrentStep('auth')
    setErrors({})
  }

  // If showing account creation, render multi-step form
  if (!isLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F7F7FB] via-white to-[#F0F4FF] flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Logo and Brand */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-[#5B47FF] to-[#7B6CFF] rounded-3xl flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl">🍽️</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#5B47FF] to-[#7B6CFF] bg-clip-text text-transparent">
              Silex
            </h1>
            <p className="text-gray-600 mt-2">Restaurant Operations Dashboard</p>
          </div>

          {/* Multi-step Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {getStepTitle()}
              </h2>
              <p className="text-gray-600">
                {getStepDescription()}
              </p>
            </div>

            {/* Step Content */}
            <div className="min-h-[400px]">
              {/* Step 1: Authentication */}
              {currentStep === 'auth' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={userData.name}
                      onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                      className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#5B47FF] focus:ring-[#5B47FF] focus:outline-none ${errors.name ? 'border-red-500' : ''}`}
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={userData.email}
                      onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                      className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#5B47FF] focus:ring-[#5B47FF] focus:outline-none ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="Enter your phone number"
                      value={userData.phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#5B47FF] focus:ring-[#5B47FF] focus:outline-none ${errors.phone ? 'border-red-500' : ''}`}
                    />
                    {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="Create a password"
                      value={userData.password}
                      onChange={(e) => setUserData(prev => ({ ...prev, password: e.target.value }))}
                      className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#5B47FF] focus:ring-[#5B47FF] focus:outline-none ${errors.password ? 'border-red-500' : ''}`}
                    />
                    {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={handleNextStep}
                      className="px-6 py-3 bg-gradient-to-r from-[#5B47FF] to-[#7B6CFF] text-white font-semibold rounded-xl hover:from-[#4A3FE8] hover:to-[#6A5BE8] transition-all duration-200"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Role Selection */}
              {currentStep === 'role' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div 
                      onClick={() => setUserData(prev => ({ ...prev, role: 'admin' }))}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        userData.role === 'admin'
                          ? 'border-[#5B47FF] bg-[#5B47FF]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Crown className={`w-8 h-8 ${userData.role === 'admin' ? 'text-[#5B47FF]' : 'text-gray-400'}`} />
                        <div>
                          <h3 className="font-semibold text-gray-900">Admin</h3>
                          <p className="text-sm text-gray-600">Full access to create and manage restaurants</p>
                        </div>
                      </div>
                    </div>

                    <div 
                      onClick={() => setUserData(prev => ({ ...prev, role: 'manager' }))}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        userData.role === 'manager'
                          ? 'border-[#5B47FF] bg-[#5B47FF]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <UserCog className={`w-8 h-8 ${userData.role === 'manager' ? 'text-[#5B47FF]' : 'text-gray-400'}`} />
                        <div>
                          <h3 className="font-semibold text-gray-900">Manager</h3>
                          <p className="text-sm text-gray-600">Manage daily operations and staff</p>
                        </div>
                      </div>
                    </div>

                    <div 
                      onClick={() => setUserData(prev => ({ ...prev, role: 'staff' }))}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        userData.role === 'staff'
                          ? 'border-[#5B47FF] bg-[#5B47FF]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Users className={`w-8 h-8 ${userData.role === 'staff' ? 'text-[#5B47FF]' : 'text-gray-400'}`} />
                        <div>
                          <h3 className="font-semibold text-gray-900">Staff</h3>
                          <p className="text-sm text-gray-600">Handle orders, reservations, and customer service</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}

                  <div className="flex justify-between pt-4">
                    <button
                      onClick={handlePreviousStep}
                      className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="px-6 py-3 bg-gradient-to-r from-[#5B47FF] to-[#7B6CFF] text-white font-semibold rounded-xl hover:from-[#4A3FE8] hover:to-[#6A5BE8] transition-all duration-200"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Restaurant Choice (Admin only) */}
              {currentStep === 'restaurant-choice' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div 
                      onClick={() => setCurrentStep('restaurant-info')}
                      className="p-6 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#5B47FF] hover:bg-[#5B47FF]/5 transition-all"
                    >
                      <div className="text-center">
                        <Building className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <h3 className="font-semibold text-gray-900 mb-2">Create New Restaurant</h3>
                        <p className="text-sm text-gray-600">Set up a new restaurant from scratch</p>
                      </div>
                    </div>

                    <div 
                      onClick={() => setCurrentStep('join-restaurant')}
                      className="p-6 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#5B47FF] hover:bg-[#5B47FF]/5 transition-all"
                    >
                      <div className="text-center">
                        <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <h3 className="font-semibold text-gray-900 mb-2">Join Existing Restaurant</h3>
                        <p className="text-sm text-gray-600">Connect to an already established restaurant</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-start pt-4">
                    <button
                      onClick={handlePreviousStep}
                      className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200"
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Restaurant Information */}
              {currentStep === 'restaurant-info' && (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Restaurant Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter restaurant name"
                      value={restaurantData.name}
                      onChange={(e) => setRestaurantData(prev => ({ ...prev, name: e.target.value }))}
                      className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#5B47FF] focus:ring-[#5B47FF] focus:outline-none ${errors.restaurantName ? 'border-red-500' : ''}`}
                    />
                    {errors.restaurantName && <p className="text-sm text-red-500">{errors.restaurantName}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        placeholder="Street address"
                        value={restaurantData.address}
                        onChange={(e) => setRestaurantData(prev => ({ ...prev, address: e.target.value }))}
                        className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#5B47FF] focus:ring-[#5B47FF] focus:outline-none ${errors.address ? 'border-red-500' : ''}`}
                      />
                      {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        placeholder="City"
                        value={restaurantData.city}
                        onChange={(e) => setRestaurantData(prev => ({ ...prev, city: e.target.value }))}
                        className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#5B47FF] focus:ring-[#5B47FF] focus:outline-none ${errors.city ? 'border-red-500' : ''}`}
                      />
                      {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        placeholder="Restaurant phone"
                        value={restaurantData.phone}
                        onChange={(e) => handleRestaurantPhoneChange(e.target.value)}
                        className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#5B47FF] focus:ring-[#5B47FF] focus:outline-none ${errors.restaurantPhone ? 'border-red-500' : ''}`}
                      />
                      {errors.restaurantPhone && <p className="text-sm text-red-500">{errors.restaurantPhone}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="Restaurant email"
                        value={restaurantData.email}
                        onChange={(e) => setRestaurantData(prev => ({ ...prev, email: e.target.value }))}
                        className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#5B47FF] focus:ring-[#5B47FF] focus:outline-none ${errors.restaurantEmail ? 'border-red-500' : ''}`}
                      />
                      {errors.restaurantEmail && <p className="text-sm text-red-500">{errors.restaurantEmail}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cuisine Type
                    </label>
                    <div className="relative" ref={cuisineDropdownRef}>
                      <input
                        type="text"
                        placeholder="Select or type cuisine type"
                        value={cuisineInput}
                        onChange={(e) => {
                          setCuisineInput(e.target.value)
                          setRestaurantData(prev => ({ ...prev, cuisine: e.target.value }))
                          setShowCuisineDropdown(true)
                        }}
                        onBlur={() => {
                          // Small delay to allow dropdown clicks to register
                          setTimeout(() => setShowCuisineDropdown(false), 150)
                        }}
                        onFocus={() => setShowCuisineDropdown(true)}
                        className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#5B47FF] focus:ring-[#5B47FF] focus:outline-none ${errors.cuisine ? 'border-red-500' : ''}`}
                      />
                      
                      {showCuisineDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                          <div className="p-3 bg-gray-50 border-b border-gray-200">
                            <p className="text-sm text-gray-600 font-medium">Select from list or type custom:</p>
                          </div>
                          {cuisineOptions
                            .filter(cuisine => 
                              cuisine.toLowerCase().includes(cuisineInput.toLowerCase())
                            )
                            .map((cuisine) => (
                              <div
                                key={cuisine}
                                onClick={() => {
                                  setCuisineInput(cuisine)
                                  setRestaurantData(prev => ({ ...prev, cuisine }))
                                  setShowCuisineDropdown(false)
                                }}
                                className="px-4 py-3 hover:bg-[#5B47FF]/5 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-900">{cuisine}</span>
                                  {restaurantData.cuisine === cuisine && (
                                    <Check className="w-4 h-4 text-[#5B47FF]" />
                                  )}
                                </div>
                              </div>
                            ))}
                          {cuisineInput && !cuisineOptions.includes(cuisineInput) && (
                            <div
                              onClick={() => {
                                setRestaurantData(prev => ({ ...prev, cuisine: cuisineInput }))
                                setShowCuisineDropdown(false)
                              }}
                              className="px-4 py-3 hover:bg-[#5B47FF]/5 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors bg-[#5B47FF]/5"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-gray-900">Use "{cuisineInput}"</span>
                                <span className="text-sm text-[#5B47FF]">Custom</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {errors.cuisine && <p className="text-sm text-red-500">{errors.cuisine}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      placeholder="Brief description of your restaurant"
                      value={restaurantData.description}
                      onChange={(e) => setRestaurantData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#5B47FF] focus:ring-[#5B47FF] focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      onClick={handlePreviousStep}
                      className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="px-6 py-3 bg-gradient-to-r from-[#5B47FF] to-[#7B6CFF] text-white font-semibold rounded-xl hover:from-[#4A3FE8] hover:to-[#6A5BE8] transition-all duration-200"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 5: Menu Setup */}
              {currentStep === 'menu-setup' && (
                <div className="space-y-6">
                  {/* AI Menu Analysis */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      AI-Powered Menu Analysis
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#5B47FF] transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                        id="menuUpload"
                      />
                      <label 
                        htmlFor="menuUpload"
                        onDrop={handleImageDrop}
                        onDragOver={(e) => e.preventDefault()}
                        className="cursor-pointer block"
                      >
                        {!menuImage ? (
                          <>
                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <h3 className="font-semibold text-gray-900 mb-2">Upload Your Menu Image</h3>
                            <p className="text-sm text-gray-600 mb-3">
                              Take a photo of your physical menu or upload an image file
                            </p>
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                              <Image className="w-4 h-4" />
                              <span>PNG, JPG up to 10MB</span>
                            </div>
                            <p className="text-sm text-[#5B47FF] mt-2 font-medium">
                              Our AI will analyze and recreate your menu automatically!
                            </p>
                          </>
                        ) : (
                          <>
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                              <Check className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">
                              {menuImage.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {aiAnalyzed ? 'AI analysis complete!' : 'Analyzing your menu...'}
                            </p>
                          </>
                        )}
                      </label>
                    </div>
                    
                    {isAnalyzingMenu && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#5B47FF]"></div>
                          <div>
                            <p className="text-sm font-medium text-blue-900">AI is analyzing your menu...</p>
                            <p className="text-xs text-blue-700">This may take a few moments</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Manual Menu Setup */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        {aiAnalyzed ? 'Review & Edit AI-Generated Items' : 'Or Add Items Manually'}
                      </label>
                      <button
                        onClick={addMenuItem}
                        className="px-3 py-1 text-sm bg-[#5B47FF] text-white rounded-lg hover:bg-[#4A3FE8] transition-colors"
                      >
                        + Add Item
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {menuData.sampleItems.map((item, index) => (
                        <div key={index} className="p-3 border border-gray-200 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <input
                              type="text"
                              placeholder="Item name"
                              value={item.name}
                              onChange={(e) => updateMenuItem(index, 'name', e.target.value)}
                              className="px-3 py-2 border border-gray-200 rounded-lg focus:border-[#5B47FF] focus:outline-none"
                            />
                            <input
                              type="text"
                              placeholder="Description"
                              value={item.description}
                              onChange={(e) => updateMenuItem(index, 'description', e.target.value)}
                              className="px-3 py-2 border border-gray-200 rounded-lg focus:border-[#5B47FF] focus:outline-none"
                            />
                            <div className="flex gap-2">
                              <input
                                type="number"
                                placeholder="Price"
                                value={item.price}
                                onChange={(e) => updateMenuItem(index, 'price', parseFloat(e.target.value) || 0)}
                                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:border-[#5B47FF] focus:outline-none"
                              />
                              <button
                                onClick={() => removeMenuItem(index)}
                                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      onClick={handlePreviousStep}
                      className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="px-6 py-3 bg-gradient-to-r from-[#5B47FF] to-[#7B6CFF] text-white font-semibold rounded-xl hover:from-[#4A3FE8] hover:to-[#6A5BE8] transition-all duration-200"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 6: Tables Setup */}
              {currentStep === 'tables-setup' && (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Restaurant Tables
                      </label>
                      <button
                        onClick={addTable}
                        className="px-3 py-1 text-sm bg-[#5B47FF] text-white rounded-lg hover:bg-[#4A3FE8] transition-colors"
                      >
                        + Add Table
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {tableData.tables.map((table, index) => (
                        <div key={index} className="p-3 border border-gray-200 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <input
                              type="number"
                              placeholder="Table number"
                              value={table.number}
                              onChange={(e) => updateTable(index, 'number', parseInt(e.target.value) || 0)}
                              className="px-3 py-2 border border-gray-200 rounded-lg focus:border-[#5B47FF] focus:outline-none"
                            />
                            <input
                              type="number"
                              placeholder="Capacity"
                              value={table.capacity}
                              onChange={(e) => updateTable(index, 'capacity', parseInt(e.target.value) || 0)}
                              className="px-3 py-2 border border-gray-200 rounded-lg focus:border-[#5B47FF] focus:outline-none"
                            />
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Location"
                                value={table.location}
                                onChange={(e) => updateTable(index, 'location', e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:border-[#5B47FF] focus:outline-none"
                              />
                              <button
                                onClick={() => removeTable(index)}
                                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      onClick={handlePreviousStep}
                      className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="px-6 py-3 bg-gradient-to-r from-[#5B47FF] to-[#7B6CFF] text-white font-semibold rounded-xl hover:from-[#4A3FE8] hover:to-[#6A5BE8] transition-all duration-200"
                    >
                      Complete Setup
                    </button>
                  </div>
                </div>
              )}

              {/* Step 7: Join Restaurant */}
              {currentStep === 'join-restaurant' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Restaurant Code
                    </label>
                    <input
                      type="text"
                      placeholder="Enter the restaurant code"
                      value={joinRestaurantCode}
                      onChange={(e) => setJoinRestaurantCode(e.target.value)}
                      className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#5B47FF] focus:ring-[#5B47FF] focus:outline-none ${errors.code ? 'border-red-500' : ''}`}
                    />
                    {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
                    <p className="text-sm text-gray-500 mt-2">
                      Ask your restaurant admin for the 6+ character code
                    </p>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      onClick={handlePreviousStep}
                      className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="px-6 py-3 bg-gradient-to-r from-[#5B47FF] to-[#7B6CFF] text-white font-semibold rounded-xl hover:from-[#4A3FE8] hover:to-[#6A5BE8] transition-all duration-200"
                    >
                      Join Restaurant
                    </button>
                  </div>
                </div>
              )}

              {/* Step 8: Complete */}
              {currentStep === 'complete' && (
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-10 h-10 text-green-600" />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Welcome to Silex!
                    </h3>
                    <p className="text-gray-600">
                      Your account has been created successfully. You can now access the dashboard and start managing your restaurant operations.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Link
                      to="/"
                      className="block w-full px-6 py-3 bg-gradient-to-r from-[#5B47FF] to-[#7B6CFF] text-white font-semibold rounded-xl hover:from-[#4A3FE8] hover:to-[#6A5BE8] transition-all duration-200"
                    >
                      Go to Dashboard
                    </Link>
                    
                    <button
                      onClick={toggleMode}
                      className="block w-full px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200"
                    >
                      Sign In Instead
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-sm text-gray-500">
            <p>© 2024 Silex. All rights reserved.</p>
          </div>
        </div>
      </div>
    )
  }

  // Simple login form
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F7FB] via-white to-[#F0F4FF] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-[#5B47FF] to-[#7B6CFF] rounded-3xl flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl">🍽️</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#5B47FF] to-[#7B6CFF] bg-clip-text text-transparent">
            Silex
          </h1>
          <p className="text-gray-600 mt-2">Restaurant Operations Dashboard</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome Back
            </h2>
            <p className="text-gray-600">
              Sign in to your restaurant dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#5B47FF] focus:ring-[#5B47FF] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#5B47FF] focus:ring-[#5B47FF] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-[#5B47FF] to-[#7B6CFF] hover:from-[#4A3FE8] hover:to-[#6A5BE8] text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
            >
              Sign In
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={toggleMode}
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Don't have an account? Sign up
            </button>
          </div>

          {/* Dashboard Access Info */}
          <div className="text-center mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-sm text-blue-700">
              You can access the dashboard directly at{' '}
              <Link to="/" className="underline font-medium">
                /
              </Link>
              {' '}while we build the authentication system
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2024 Silex. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
