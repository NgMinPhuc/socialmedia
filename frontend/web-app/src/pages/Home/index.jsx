import { useAuth } from '@/contexts/AuthContext';

const HomePage = () => {
  const { user } = useAuth();
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Welcome to Social Media App! 🎉
      </h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">User Information:</h2>
        <p className="text-gray-600">Username: <span className="font-medium text-gray-800">{user}</span></p>
        <p className="text-green-600 mt-2">✅ Login successful!</p>
        <div className="mt-4 p-4 bg-blue-50 rounded">
          <p className="text-blue-800">
            The microservices system is working well! 
            You can start using the app features.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
