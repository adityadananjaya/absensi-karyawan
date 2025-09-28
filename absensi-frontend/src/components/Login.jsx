import React, { useState } from 'react'
import { BrowserRouter, useNavigate } from 'react-router';
import { UserContext } from '../contexts/UserContext';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const {setUser} = React.useContext(UserContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        localStorage.removeItem('login_token');
        console.log(import.meta.env.VITE_API_BASE_URL)
        try {
            const response = await fetch(`http://${import.meta.env.VITE_API_BASE_URL}/api/employees/login`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (response.ok) {
                console.log('Login successful:', data);
                localStorage.setItem('login_token', data.accessToken);
                const userRes = await fetch(`http://${import.meta.env.VITE_API_BASE_URL}/api/employees/current`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${data.accessToken}` }
                });
                const userData = await userRes.json();
                setUser(userData);
                navigate("/dashboard");
            }   else {
                setError(data.message || 'Login failed');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        }
    }

  return (
    <div className="grid h-120 place-content-center">
    <form onSubmit={handleSubmit}>
        <div className="border rounded-md p-6 w-96 min-h-75 shadow-lg border-gray-300">
            <h1 className="font-semibold text-2xl text-gray-900 text-center">Sign in</h1>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <div className="mt-3">
                <label  className="block text-lg font-medium text-gray-700">Email address</label>
                <div className="mt-1">
                    <input type="email" name="email" id="email" placeholder="name@dexa.org" required className="block w-full grow rounded-md outline-1 outline-gray-300 py-1.5 pr-24 pl-2 text-base focus:outline-blue-300"
                    value={email}
                    onChange={e => setEmail(e.target.value)} />
                </div>
            </div>
           <div className="mt-3">
                <label  className="block text-lg font-medium text-gray-700">Password</label>
                <div className="mt-1">
                    <input type="password" name="password" id="password" placeholder="Your password" required className="block w-full grow rounded-md outline-1 outline-gray-300 py-1.5 pr-24 pl-2 text-base focus:outline-blue-300"
                    value = {password}
                    onChange = {(e) => setPassword(e.target.value)} />
                </div>
            </div>

            <div className="mt-6">
                <button type="submit" className="rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Sign in</button>
            </div>
        </div>
    </form>
        
    </div>
    
  )
}

export default Login