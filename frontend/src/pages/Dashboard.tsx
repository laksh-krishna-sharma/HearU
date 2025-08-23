import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/hooks';
import { fetchUser } from '@/store/slices/authSlice';

//dashboard response
//{ 
//   "id": "e3fb8445-6d18-4ba8-b137-20c5e274950b",
//   "name": "Rupesh  Karki",
//   "email": "karkisinghgamer@gmail.com",
//   "username": "rupesh69",
//   "is_admin": false
// }
const Dashboard = () => {
  const { user, loading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  if (loading) return <p className='text-center text-ocean-text'>Loading...</p>;

  return (
    <div className="min-h-screen bg-ocean-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-ocean-text mb-6">
            Welcome to Your Dashboard
          </h1>
          
          {user && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-ocean-text mb-4">
                Hello, {user.name}!
              </h2>
              <h2 className="text-xl font-semibold text-ocean-text mb-4">
                Username: {user.username}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-ocean-primary bg-opacity-10 p-4 rounded-lg border border-ocean-primary border-opacity-20">
                  <h3 className="font-semibold text-ocean-text mb-2">Profile Info</h3>
                  <p className="text-sm text-ocean-text opacity-70">Email: {user.email}</p>
                  {/* {user.age && <p className="text-sm text-ocean-text opacity-70">Age: {user.age}</p>}
                  {user.gender && <p className="text-sm text-ocean-text opacity-70">Gender: {user.gender}</p>} */}
                </div>
                
                <div className="bg-ocean-secondary bg-opacity-10 p-4 rounded-lg border border-ocean-secondary border-opacity-20">
                  <h3 className="font-semibold text-ocean-text mb-2">Account Status</h3>
                  <p className="text-sm text-ocean-text opacity-70">
                    Member since: Add in api response
                  </p>
                  <p className="text-sm text-ocean-text opacity-70">
                    Status: {user.is_admin ? 'Admin' : 'User'}
                  </p>
                </div>
                
                <div className="bg-ocean-accent bg-opacity-10 p-4 rounded-lg border border-ocean-accent border-opacity-20">
                  <h3 className="font-semibold text-ocean-text mb-2">Quick Actions</h3>
                  <button className="text-sm text-ocean-accent hover:text-ocean-accent-dark transition-colors">
                    Update Profile
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-ocean-primary to-ocean-primary-dark text-white p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Mental Wellness</h3>
              <p className="text-sm opacity-90 mb-4">
                Track your daily mood and access wellness resources
              </p>
              <button className="bg-white text-ocean-primary px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                Start Today
              </button>
            </div>
            
            <div className="bg-gradient-to-br from-ocean-secondary to-ocean-secondary-dark text-white p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Support Network</h3>
              <p className="text-sm opacity-90 mb-4">
                Connect with peers and mental health professionals
              </p>
              <button className="bg-white text-ocean-secondary px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                Connect Now
              </button>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-ocean-accent bg-opacity-10 rounded-lg border border-ocean-accent border-opacity-20">
            <p className="text-sm text-ocean-text text-center">
              <span className="font-semibold text-ocean-accent">Need immediate help?</span> Call 988 or text "HELLO" to 741741
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;