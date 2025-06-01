import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { authService } from '../api';

const Login = () => {
    const { setShowUserLogin, login } = useAppContext()
    const [state, setState] = useState("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(""); 
    const [isLoading, setIsLoading] = useState(false);
    
    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        
        try {
            if (state === "login") {
                // Login existing user
                const success = await login({ email, password });
                if (success) {
                    setShowUserLogin(false);
                } else {
                    toast.error("Invalid email or password");
                }
            } else {
                // Register new user
                const response = await authService.register({ name, email, password });
                if (response.success) {
                    // Auto login after successful registration
                    await login({ email, password });
                    setShowUserLogin(false);
                    toast.success("Account created successfully!");
                }
            }
        } catch (error) {
            toast.error(error.message || (state === "login" ? "Login failed" : "Registration failed"));
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

  return (
    <div onClick={()=> setShowUserLogin(false)} className='fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50'>
         <form onSubmit={onSubmitHandler} onClick={(e)=>e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white">
            <p className="text-2xl font-medium m-auto">
                <span className="text-primary ">User</span> {state === "login" ? "Login" : "Sign Up"}
            </p>
            {state === "register" && (
                <div className="w-full">
                    <p>Name</p>
                    <input onChange={(e) => setName(e.target.value)} value={name} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="text" required />
                </div>
            )}
            <div className="w-full ">
                <p>Email</p>
                <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="email" required />
            </div>
            <div className="w-full ">
                <p>Password</p>
                <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="password" required />
            </div>
            {state === "register" ? (
                <p>
                    Already have account? <span onClick={() => setState("login")} className="text-primary cursor-pointer">click here</span>
                </p>
            ) : (
                <p>
                    Create an account? <span onClick={() => setState("register")} className="text-primary cursor-pointer">click here</span>
                </p>
            )}
            <button 
                type="submit" 
                disabled={isLoading} 
                className={`${isLoading ? 'opacity-70' : ''} bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer`}
            >
                {isLoading ? 'Processing...' : (state === "register" ? "Create Account" : "Login")}
            </button>
            
            <div className="w-full text-center mt-2 pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-500">Are you a seller?</p>
                <a 
                    href="/seller-login" 
                    className="inline-block mt-1 text-primary hover:underline font-medium"
                    onClick={() => setShowUserLogin(false)}
                >
                    Login to Seller Dashboard
                </a>
            </div>
        </form>
    </div>
  )
}

export default Login