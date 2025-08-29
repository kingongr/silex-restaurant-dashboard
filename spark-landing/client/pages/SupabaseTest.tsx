import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface User {
  id: string
  email: string
  full_name: string
  role: string
}

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
}

export default function SupabaseTest() {
  const [users, setUsers] = useState<User[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        
        // Fetch users
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('*')
        
        if (usersError) throw usersError
        
        // Fetch menu items
        const { data: menuData, error: menuError } = await supabase
          .from('menu_items')
          .select('*')
        
        if (menuError) throw menuError
        
        setUsers(usersData || [])
        setMenuItems(menuData || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Supabase data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Connection Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Make sure your local Supabase instance is running</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎉 Supabase Connection Successful!
          </h1>
          <p className="text-gray-600">
            Your local Supabase instance is working perfectly
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Users Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              👥 Sample Users ({users.length})
            </h2>
            <div className="space-y-3">
              {users.map((user) => (
                <div key={user.id} className="border rounded-lg p-3">
                  <div className="font-medium text-gray-900">{user.full_name}</div>
                  <div className="text-sm text-gray-600">{user.email}</div>
                  <div className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1">
                    {user.role}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Menu Items Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              🍽️ Sample Menu Items ({menuItems.length})
            </h2>
            <div className="space-y-3">
              {menuItems.map((item) => (
                <div key={item.id} className="border rounded-lg p-3">
                  <div className="font-medium text-gray-900">{item.name}</div>
                  <div className="text-sm text-gray-600">{item.description}</div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {item.category}
                    </span>
                    <span className="font-semibold text-gray-900">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 inline-block">
            <p className="text-green-800">
              ✅ Database schema created successfully with sample data
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
