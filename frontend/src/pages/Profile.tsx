import { useState } from 'react';
import { User, Mail, Phone, MapPin, Camera, Save } from 'lucide-react';
import { useAuthStore } from '@/store/store';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function Profile() {
  const { user, updateProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8] pt-24 pb-16">
      <div className="section-padding">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-serif font-bold text-[#1a1a1a] mb-8">
              My Profile
            </h1>

            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Header */}
              <div className="relative h-32 bg-gradient-to-r from-[#c9a96e] to-[#d4b87a]">
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                  <div className="relative">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-24 h-24 rounded-full border-4 border-white object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full border-4 border-white bg-[#f0f0f0] flex items-center justify-center">
                        <User className="w-12 h-12 text-[#999]" />
                      </div>
                    )}
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#1a1a1a] rounded-full flex items-center justify-center text-white hover:bg-[#c9a96e] transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="pt-16 pb-8 px-8">
                <div className="text-center mb-8">
                  <h2 className="text-xl font-semibold">{user?.name}</h2>
                  <p className="text-[#666]">{user?.email}</p>
                  <span className="inline-block mt-2 px-3 py-1 bg-[#c9a96e]/10 text-[#c9a96e] text-sm rounded-full capitalize">
                    {user?.role}
                  </span>
                </div>

                {/* Form */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={!isEditing}
                        className="w-full pl-12 pr-4 py-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#c9a96e] disabled:bg-[#f8f8f8]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={!isEditing}
                        className="w-full pl-12 pr-4 py-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#c9a96e] disabled:bg-[#f8f8f8]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={!isEditing}
                        placeholder="Add your phone number"
                        className="w-full pl-12 pr-4 py-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#c9a96e] disabled:bg-[#f8f8f8]"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-4">
                    {isEditing ? (
                      <>
                        <Button
                          onClick={() => setIsEditing(false)}
                          variant="outline"
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSave}
                          className="flex-1 btn-primary"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => setIsEditing(true)}
                        className="w-full btn-primary"
                      >
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Addresses */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-serif font-bold">Saved Addresses</h3>
                <Button variant="outline" size="sm">
                  Add Address
                </Button>
              </div>

              {user?.addresses && user.addresses.length > 0 ? (
                <div className="space-y-4">
                  {user.addresses.map((address) => (
                    <div key={address.id} className="bg-white rounded-xl p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-[#c9a96e] mt-1" />
                          <div>
                            <p className="font-medium">{address.name}</p>
                            <p className="text-[#666]">{address.street}</p>
                            <p className="text-[#666]">
                              {address.city}, {address.state} {address.zipCode}
                            </p>
                            <p className="text-[#666]">{address.country}</p>
                            {address.isDefault && (
                              <span className="inline-block mt-2 px-2 py-1 bg-[#c9a96e]/10 text-[#c9a96e] text-xs rounded">
                                Default Address
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl p-8 text-center">
                  <MapPin className="w-12 h-12 text-[#999] mx-auto mb-4" />
                  <p className="text-[#666]">No saved addresses</p>
                  <Button className="mt-4 btn-primary">Add Address</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
