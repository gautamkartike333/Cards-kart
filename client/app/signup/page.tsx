'use client'
import axios from 'axios';
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { register } from 'module';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export default function RegistrationForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [inputData, setInputData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInput = (e:React.ChangeEvent<HTMLInputElement>) => {
    setInputData({
      ...inputData,
      [e.target.id]: e.target.value,
    });
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault();
    setLoading(true);
    try {
      const responses = await axios.post(`/signup`, inputData);
      const data = responses.data;
      console.log('=========================');
      
      console.log(data);
      
      if (data.success === false) {
        setLoading(false);
        toast.error(data.message);
        console.log(data.message);
      }
      toast.success(data?.message);
     
      setLoading(false);
      localStorage.setItem("game",JSON.stringify(data));
      router.push('/');
    } catch (error) {
      setLoading(false);
      console.log(error);
      // toast.error(data?.error);
      
    }

  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-800">
      <div className="bg-gray-700 rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-white">Register</h2>
        <form 
         onSubmit={handleSubmit}
        className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-300 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              // value={email}
              required
              onChange={handleInput}
              className="bg-gray-600 text-white rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-300 font-medium mb-1">
              Password
            </label>
            <div className="flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                // value={password}
                required
                onChange={handleInput}
                className="bg-gray-600 text-white rounded-md px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="bg-gray-500 hover:bg-gray-600 text-white rounded-md px-2 py-2 ml-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Register
            </button>
            

            <a href="/signin" className="text-gray-300 hover:text-gray-400">
            Already have an account? Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}