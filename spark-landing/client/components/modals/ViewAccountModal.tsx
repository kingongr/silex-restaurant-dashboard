import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { User, Mail, Phone, MapPin, Calendar, Shield } from 'lucide-react';

interface ViewAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewAccountModal({ isOpen, onClose }: ViewAccountModalProps) {
  const accountData = {
    name: 'John Smith',
    email: 'john.smith@silexrestaurant.com',
    phone: '+1 (555) 123-4567',
    role: 'Manager',
    location: 'New York, NY',
    joinDate: 'January 15, 2023',
    lastLogin: 'December 10, 2024 at 2:30 PM',
    status: 'Active'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl lg:max-w-[calc(4xl-20%)] bg-white dark:bg-[#1B2030] border-gray-200 dark:border-gray-800 rounded-2xl p-0 overflow-hidden max-h-[85vh] overflow-y-auto modal-centered-content">
        <div className="p-6 sm:p-8">
          <DialogHeader className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                  Account Information
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400">
                  View your account details and information
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Profile Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{accountData.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                      {accountData.status}
                    </Badge>
                    <Badge variant="outline">
                      {accountData.role}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">Contact Information</h4>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Email</div>
                    <div className="font-medium text-gray-900 dark:text-white">{accountData.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <Phone className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Phone</div>
                    <div className="font-medium text-gray-900 dark:text-white">{accountData.phone}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Location</div>
                    <div className="font-medium text-gray-900 dark:text-white">{accountData.location}</div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Account Details */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">Account Details</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Joined</div>
                    <div className="font-medium text-gray-900 dark:text-white">{accountData.joinDate}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <Shield className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Role</div>
                    <div className="font-medium text-gray-900 dark:text-white">{accountData.role}</div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400">Last Login</div>
                <div className="font-medium text-gray-900 dark:text-white">{accountData.lastLogin}</div>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                onClick={onClose}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:opacity-90 transition-opacity duration-200 shadow-lg"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
