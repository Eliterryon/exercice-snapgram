import { getCurrentUser } from '@/lib/appwrite/api';
import { IUser } from '@/types';
import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export const INITIAL_USER = {
    id: "",
    name: "",
    username: "",
    email: "",
    imageUrl: "",
    bio: "",
}

export const INITIAL_STATE = {
    user: INITIAL_USER,
    isLoading: false,
    isAuth: false,
    setUser: () => {},
    setIsAuth: () => {},
    checkAuthUser: async () => false as boolean,
}

type IContextType = {
    user: IUser;
    isLoading: boolean;
    setUser: React.Dispatch<React.SetStateAction<IUser>>;
    isAuth: boolean;
    setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
    checkAuthUser: () => Promise<boolean>;
  };

const AuthContext = createContext<IContextType>(INITIAL_STATE);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<IUser>(INITIAL_USER);
    const [isLoading, setIsLoading] = useState(false);
    const [isAuth, setIsAuth] = useState(false);

    const checkAuthUser = async () => {
        try {
            const currentAcc = await getCurrentUser()
            if (currentAcc) {
                setUser({
                    id: currentAcc.$id,
                    name: currentAcc.name,
                    username: currentAcc.username,
                    email: currentAcc.email,
                    imageUrl: currentAcc.imageUrl,
                    bio: currentAcc.bio,
                })
                setIsAuth(true);
                return true;
            }
            return false;
        } catch (error) {
            console.log(error)
            return false
        } finally {
            setIsLoading(false)
        }
    };
    
    useEffect(() => {
        const cookieFallback = localStorage.getItem("cookieFallback");
        if (
          cookieFallback === "[]" 
          || cookieFallback === null 
          //|| cookieFallback === undefined
        ) {
          navigate("/sign-in");
        }
    
        checkAuthUser();
      }, []);

    const value = {
        user,
        setUser,
        isLoading,
        isAuth,
        setIsAuth,
        checkAuthUser,
      };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
export const useUserContext = () => useContext(AuthContext)