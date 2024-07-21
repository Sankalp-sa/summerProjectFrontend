import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { BACKEND_URL } from '@/config/config';

const SocketContext = createContext<{ socket: Socket | null }>({ socket: null });

export const SocketProvider = ({ children }: { children: ReactNode }) => {

  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const s = io(BACKEND_URL);

    setSocket(s);

    return () => {
      s.disconnect();
    };

  }, []);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);