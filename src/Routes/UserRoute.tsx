import Loader from "@/components/Loader";
import { BACKEND_URL } from "@/config/config";
import { useAuth } from "@/Context/AuthContext";
import { useState, useEffect } from "react";

import { Outlet } from "react-router-dom";

export default function UserRoute() {
    const [ok, setOk] = useState(false);

    const { user } = useAuth();

    const authCheck = async () => {
            
        const res = await fetch(`${BACKEND_URL}/api/v1/user/auth-check`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        })

        console.log(res)

        if (res && res.ok) {
            setOk(true);
        }
        else {
            setOk(false);
        }
    };

    useEffect(() => {
        authCheck();
    }, [user]);

    return ok ? <Outlet /> : <Loader/>;
}

