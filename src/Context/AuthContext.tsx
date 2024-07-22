import { BACKEND_URL } from "@/config/config";
import { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "./SocketContext";
import { useNavigate } from "react-router-dom";

type UserAuth = {
    isLoggedIn: boolean;
    user: any;
    login: () => void;
    logout: () => void;
    isAdmin: boolean;
}

const AuthContext = createContext<UserAuth | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const [user, setUser] = useState<any>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    const { socket } = useSocket()

    const navigate = useNavigate()


    const checkAuth = async () => {

        const res = await fetch(`${BACKEND_URL}/api/v1/user/auth-check`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        })

        const data = await res.json()
        console.log(data)

        if (res.ok) {
            
            console.log()

            if (socket){
                socket.emit("joinRoom", data.user.id)
            }

            setUser(data)
            setIsLoggedIn(true)
        } else {
            setUser(null)
            setIsLoggedIn(false)
        }
    }

    const AdminAuthCheck = async () => {
            
        const res = await fetch(`${BACKEND_URL}/api/v1/user/auth-admin-check`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        })

        console.log(res)

        if (res && res.ok) {
            setIsAdmin(true);
        }
        else {
            setIsAdmin(false);
        }
    };

    useEffect(() => {
        AdminAuthCheck();
    }, [isLoggedIn]);

    useEffect(() => {
        // fetch user's cookie
        checkAuth()

    }, [isLoggedIn]);

    const login = () => {
        // send token to backend
        checkAuth()
    }

    const logout = async () => {
        // clear cookie

        const res = await fetch(`${BACKEND_URL}/api/v1/user/logout`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        })

        const data = await res.json()

        if (res.ok) {
            setUser(null)
            setIsLoggedIn(false)

            navigate("/signin")

        } else {
            console.log(data)
        }

    }

    const value = {
        isLoggedIn,
        user,
        login,
        logout,
        isAdmin
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = (): UserAuth => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}