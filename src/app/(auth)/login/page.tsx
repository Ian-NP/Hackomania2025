"use client";
import { auth } from "lib/firebaseClient";
import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

export default function AuthComponent() {
    const [user, setUser] = useState<any>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                await saveUserToDatabase(user);
                router.push('/home');
            }
            setUser(user);
        });
        return () => unsubscribe();
    }, [router]);

    const checkIfEmailExists = async (email: string): Promise<boolean> => {
        // Check if the email exists in your database by sending a GET request
        const response = await fetch(`/api/users?email=${email}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
    
        const data = await response.json();
        
        // If the response indicates the user does not exist
        if (data === false) {
            return false;
        } else {
            // Extract the user data from the response (the first key will be the UID)
            const user = Object.values(data)[0];  // Assuming there is only one user
    
            // Store the user data under the key "user" in sessionStorage
            sessionStorage.setItem("user", JSON.stringify({
                uid: (user as any).uid,
                displayName: (user as any).displayName,
                email: (user as any).email,
                photoURL: (user as any).photoURL,
                pods: (user as any).pods || [],  // If 'pods' is not available, store an empty array
                productiveTime: (user as any).productiveTime || "0m",
                progress: (user as any).progress || 0,
                status: (user as any).status || "Offline",
                hoursThisWeek: (user as any).hoursThisWeek || 0,
                earnings: (user as any).earnings || 0,
                distractionCount: (user as any).distractionCount || 0,
                currentActivity: (user as any).currentActivity || "None",
            }));
    
            return true;
        }
    };      

    const saveUserToDatabase = async (user: any) => {
        const emailExists = await checkIfEmailExists(user.email);
        console.log(emailExists);   

        if (emailExists) {
            console.log("User with this email already exists in the database.");
        }
        else{
            const token = await user.getIdToken();
            await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    uid: (user as any).uid,
                    displayName: (user as any).displayName,
                    email: (user as any).email,
                    photoURL: (user as any).photoURL,
                    pods: (user as any).pods || [],  // If 'pods' is not available, store an empty array
                    productiveTime: (user as any).productiveTime || "0m",
                    progress: (user as any).progress || 0,
                    status: (user as any).status || "Offline",
                    hoursThisWeek: (user as any).hoursThisWeek || 0,
                    earnings: (user as any).earnings || 0,
                    distractionCount: (user as any).distractionCount || 0,
                    currentActivity: (user as any).currentActivity || "None",
                }),
            });
            // Set auth cookie
            document.cookie = `auth=${token}; path=/`;
        }
    };

    const signInWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            setUser(result.user);
            await saveUserToDatabase(result.user);
        } catch (error) {
            console.error("Google Sign-In Error:", error);
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isSignUp) {
                const result = await createUserWithEmailAndPassword(auth, email, password);
                setUser(result.user);
                await saveUserToDatabase(result.user);
            } else {
                const result = await signInWithEmailAndPassword(auth, email, password);
                setUser(result.user);
            }
        } catch (error) {
            console.error(isSignUp ? "Sign-Up Error:" : "Sign-In Error:", error);
        }
    };

    const logout = async () => {
        await signOut(auth);
        setUser(null);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] relative overflow-hidden">
            {/* Animated circles */}
            <div className="absolute inset-0" style={{ opacity: 0.7 }}>
                <div className="absolute top-[10%] left-[20%] w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-[float_8s_ease-in-out_infinite]"></div>
                <div className="absolute top-[20%] right-[20%] w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-[float_10s_ease-in-out_infinite_2s]"></div>
                <div className="absolute bottom-[20%] left-[30%] w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-[float_12s_ease-in-out_infinite_4s]"></div>
            </div>

            {/* Main content */}
            <div className="w-full max-w-md mx-4 relative">
                <div className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl">
                    {user ? (
                        <div className="p-8">
                            <div className="text-center space-y-4">
                                {user.photoURL && (
                                    <img 
                                        src={user.photoURL} 
                                        alt="Profile" 
                                        className="w-16 h-16 rounded-full mx-auto"
                                    />
                                )}
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Welcome, {user.displayName || user.email}
                                </h2>
                                <button 
                                    onClick={logout}
                                    className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="p-8">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {isSignUp ? "Create an Account" : "Welcome Back"}
                                </h2>
                                <p className="mt-2 text-gray-600">
                                    {isSignUp 
                                        ? "Join our community today" 
                                        : "Sign in to access your account"}
                                </p>
                            </div>

                            <div className="space-y-6">
                                <button
                                    onClick={signInWithGoogle}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path
                                            fill="currentColor"
                                            d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                                        />
                                    </svg>
                                    Continue with Google
                                </button>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white/80 text-gray-500">
                                            Or continue with email
                                        </span>
                                    </div>
                                </div>

                                <form onSubmit={handleEmailAuth} className="space-y-4">
                                    <div>
                                        <input
                                            type="email"
                                            placeholder="Email address"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        {isSignUp ? "Sign Up" : "Sign In"}
                                    </button>
                                </form>

                                <p className="text-center text-sm text-gray-600">
                                    {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                                    <button
                                        onClick={() => setIsSignUp(!isSignUp)}
                                        className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                                    >
                                        {isSignUp ? "Sign In" : "Sign Up"}
                                    </button>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
