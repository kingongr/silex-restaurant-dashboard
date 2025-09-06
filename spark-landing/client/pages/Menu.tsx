import { useState } from 'react';
// DashboardLayout removed - already wrapped by App.tsx routing
import AddMenuItemModal from '@/components/modals/AddMenuItemModal';
import EditMenuItemModal from '@/components/modals/EditMenuItemModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Clock,
  DollarSign,
  Star,
  Leaf,
  AlertTriangle
} from 'lucide-react';

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

const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Grilled Atlantic Salmon',
    description: 'Fresh Atlantic salmon grilled to perfection, served with seasonal vegetables and lemon herb butter',
    price: 28.99,
    category: 'Main Courses',
    image: '/api/placeholder/300/200',
    prepTime: 20,
    available: true,
    dietary: ['Gluten-Free', 'High-Protein'],
    allergens: ['Fish'],
    rating: 4.8,
    orders: 156
  },
  {
    id: '2',
    name: 'Classic Caesar Salad',
    description: 'Crisp romaine lettuce, parmesan cheese, croutons, and our signature Caesar dressing',
    price: 14.99,
    category: 'Appetizers',
    image: '/api/placeholder/300/200',
    prepTime: 10,
    available: true,
    dietary: ['Vegetarian'],
    allergens: ['Dairy', 'Eggs'],
    rating: 4.6,
    orders: 243
  },
  {
    id: '3',
    name: 'Premium Ribeye Steak',
    description: '12oz prime ribeye steak cooked to your preference, served with garlic mashed potatoes',
    price: 42.99,
    category: 'Main Courses',
    image: '/api/placeholder/300/200',
    prepTime: 25,
    available: true,
    dietary: ['High-Protein', 'Keto-Friendly'],
    allergens: ['Dairy'],
    rating: 4.9,
    orders: 98
  },
  {
    id: '4',
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with molten center, served with vanilla ice cream',
    price: 12.99,
    category: 'Desserts',
    image: '/api/placeholder/300/200',
    prepTime: 15,
    available: false,
    dietary: ['Vegetarian'],
    allergens: ['Dairy', 'Eggs', 'Gluten'],
    rating: 4.7,
    orders: 189
  },
  {
    id: '5',
    name: 'Craft Beer Selection',
    description: 'Selection of local craft beers including IPA, Lager, and Stout',
    price: 8.99,
    category: 'Beverages',
    image: '/api/placeholder/300/200',
    prepTime: 2,
    available: true,
    dietary: [],
    allergens: ['Gluten'],
    rating: 4.4,
    orders: 87
  },
  {
    id: '6',
    name: 'Quinoa Buddha Bowl',
    description: 'Nutritious bowl with quinoa, roasted vegetables, avocado, and tahini dressing',
    price: 19.99,
    category: 'Main Courses',
    image: '/api/placeholder/300/200',
    prepTime: 18,
    available: true,
    dietary: ['Vegan', 'Gluten-Free', 'High-Protein'],
    allergens: ['Sesame'],
    rating: 4.5,
    orders: 134
  },
  {
    id: '7',
    name: 'Truffle Mushroom Risotto',
    description: 'Creamy Arborio rice with wild mushrooms, truffle oil, and parmesan',
    price: 24.99,
    category: 'Main Courses',
    image: '/api/placeholder/300/200',
    prepTime: 22,
    available: true,
    dietary: ['Vegetarian'],
    allergens: ['Dairy'],
    rating: 4.6,
    orders: 76
  },
  {
    id: '8',
    name: 'Fresh Fruit Tart',
    description: 'Seasonal fresh fruits on vanilla custard with a crisp pastry shell',
    price: 10.99,
    category: 'Desserts',
    image: '/api/placeholder/300/200',
    prepTime: 12,
    available: true,
    dietary: ['Vegetarian'],
    allergens: ['Dairy', 'Eggs', 'Gluten'],
    rating: 4.3,
    orders: 145
  }
];

export default function Menu() {
  const [isAddMenuItemModalOpen, setIsAddMenuItemModalOpen] = useState(false);
  const [isEditMenuItemModalOpen, setIsEditMenuItemModalOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);
  const [selectedCategory, setSelectedCategory] = useState('All Items');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterAvailable, setFilterAvailable] = useState(false);
  

  

  
  // Dynamic categories that can be updated when new items are added
  const [categories, setCategories] = useState(['All Items', 'Appetizers', 'Main Courses', 'Desserts', 'Beverages', 'Sides', 'Specials']);

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'All Items' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAvailability = !filterAvailable || item.available;
    
    return matchesCategory && matchesSearch && matchesAvailability;
  });

  const toggleAvailability = (itemId: string) => {
    setMenuItems(menuItems.map(item =>
      item.id === itemId ? { ...item, available: !item.available } : item
    ));
  };

  const handleEditMenuItem = (item: MenuItem) => {
    setSelectedMenuItem(item);
    setIsEditMenuItemModalOpen(true);
  };

  const handleSaveEditedMenuItem = (updatedItem: MenuItem) => {
    setMenuItems(menuItems.map(item =>
      item.id === updatedItem.id ? updatedItem : item
    ));
    setIsEditMenuItemModalOpen(false);
    setSelectedMenuItem(null);
  };

  // Handle adding new menu items and updating categories
  const handleAddMenuItem = (menuItemData: any) => {
    // Create new menu item
    const newMenuItem: MenuItem = {
      id: Date.now().toString(),
      name: menuItemData.name,
      description: menuItemData.description,
      price: parseFloat(menuItemData.price),
      category: menuItemData.category,
      image: menuItemData.imageFile ? URL.createObjectURL(menuItemData.imageFile) : menuItemData.imageUrl || '/api/placeholder/300/200',
      prepTime: parseInt(menuItemData.preparationTime) || 15,
      available: menuItemData.isAvailable,
      dietary: [
        ...(menuItemData.isVegetarian ? ['Vegetarian'] : []),
        ...(menuItemData.isGlutenFree ? ['Gluten-Free'] : [])
      ],
      allergens: menuItemData.allergens ? menuItemData.allergens.split(',').map((a: string) => a.trim()) : [],
      rating: 0,
      orders: 0
    };

    // Add to menu items
    setMenuItems(prev => [newMenuItem, ...prev]);

    // Update categories if it's a new category
    if (menuItemData.category && !categories.includes(menuItemData.category)) {
      setCategories(prev => [...prev, menuItemData.category]);
    }
  };

  const getDietaryColor = (dietary: string) => {
    switch (dietary) {
      case 'Vegan': return 'bg-green-100 text-green-800';
      case 'Vegetarian': return 'bg-green-100 text-green-800';
      case 'Gluten-Free': return 'bg-blue-100 text-blue-800';
      case 'Keto-Friendly': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🍽️ Plate Studio
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            One source of truth for every dish.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search menu items..."
                className="pl-10 w-80"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setFilterAvailable(!filterAvailable)}
              className={filterAvailable ? 'aurora-gradient text-white' : ''}
            >
              <Filter className="w-4 h-4 mr-2" />
              {filterAvailable ? 'Available Only' : 'All Items'}
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex border rounded-lg">
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'aurora-gradient text-white' : ''}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'aurora-gradient text-white' : ''}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
            <Button 
              className="btn-aurora"
              onClick={() => setIsAddMenuItemModalOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Menu Item
            </Button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={category === selectedCategory ? 'default' : 'outline'}
              size="sm"
              className={category === selectedCategory ? 'aurora-gradient text-white' : ''}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
              <Badge variant="secondary" className="ml-2">
                {category === 'All Items' 
                  ? menuItems.length 
                  : menuItems.filter(item => item.category === category).length
                }
              </Badge>
            </Button>
          ))}
        </div>

        {/* Menu Items */}
        {filteredItems.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 aurora-gradient rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-heading-3 font-semibold mb-2">No items found</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                {searchQuery ? 'Try adjusting your search terms or filters.' : 'No menu items match your current filters.'}
              </p>
              {searchQuery && (
                <Button variant="outline" onClick={() => setSearchQuery('')}>
                  Clear Search
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map((item) => (
                  <Card key={item.id} className="glass-card hover-lift overflow-hidden">
                    <div className="relative">
                      <div className="w-full h-48 bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground">Menu Image</span>
                      </div>
                      <div className="absolute top-3 right-3 flex gap-2">
                        <Badge 
                          className={item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                        >
                          {item.available ? 'Available' : 'Unavailable'}
                        </Badge>
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-white text-xs font-medium">{item.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold line-clamp-1">{item.name}</h3>
                        <div className="text-right">
                          <p className="text-xl font-bold aurora-text">${item.price}</p>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {item.description}
                      </p>
                      
                      <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{item.prepTime} min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          <span>{item.orders} orders</span>
                        </div>
                      </div>

                      {/* Dietary Badges */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {item.dietary.slice(0, 2).map((diet) => (
                          <Badge key={diet} className={getDietaryColor(diet)}>
                            <Leaf className="w-3 h-3 mr-1" />
                            {diet}
                          </Badge>
                        ))}
                        {item.allergens.length > 0 && (
                          <Badge className="bg-orange-100 text-orange-800">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {item.allergens.length} allergen{item.allergens.length > 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleEditMenuItem(item)}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toggleAvailability(item.id)}
                        >
                          {item.available ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Menu Items ({filteredItems.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                      >
                        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">IMG</span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <h3 className="font-semibold truncate">{item.name}</h3>
                            <div className="flex items-center gap-2 ml-4">
                              <Badge 
                                className={item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                              >
                                {item.available ? 'Available' : 'Unavailable'}
                              </Badge>
                              <span className="text-lg font-bold aurora-text">${item.price}</span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                            {item.description}
                          </p>
                          
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              <span>{item.prepTime} min</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span>{item.rating}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <DollarSign className="w-3 h-3" />
                              <span>{item.orders} orders</span>
                            </div>
                            
                            <div className="flex gap-1 ml-auto">
                              {item.dietary.slice(0, 2).map((diet) => (
                                <Badge key={diet} className={getDietaryColor(diet)}>
                                  {diet}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditMenuItem(item)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toggleAvailability(item.id)}
                          >
                            {item.available ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>

      {/* Add Menu Item Modal */}
      <AddMenuItemModal
        isOpen={isAddMenuItemModalOpen}
        onClose={() => setIsAddMenuItemModalOpen(false)}
        onAdd={handleAddMenuItem}
      />

      <EditMenuItemModal
        isOpen={isEditMenuItemModalOpen}
        onClose={() => setIsEditMenuItemModalOpen(false)}
        menuItem={selectedMenuItem}
        onSave={handleSaveEditedMenuItem}
      />




    </>
  );
}
