import React, { useEffect, useState } from 'react'
import { AppWindow, Bell, CircleUser, Menu, Search } from "lucide-react"
import { Link } from 'react-router-dom'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from '@/Context/AuthContext'
import { useSocket } from '@/Context/SocketContext'
import { BACKEND_URL } from '@/config/config'

export default function Navbar() {

    const { isLoggedIn, logout, isAdmin } = useAuth()
    const { socket } = useSocket()

    const [notification, setNotification] = useState<string[]>(() => {
        // Retrieve notifications from local storage if available
        const savedNotifications = localStorage.getItem('notifications')
        return savedNotifications ? JSON.parse(savedNotifications) : []
    })

    useEffect(() => {
        if (socket) {
            console.log('Socket connected:', socket)

            socket.on("receiveNotification", (data: string) => {
                console.log("notification Data " + data)
                setNotification((prevNotifications) => {
                    const updatedNotifications = [...prevNotifications, data]
                    localStorage.setItem('notifications', JSON.stringify(updatedNotifications)) // Save to local storage
                    return updatedNotifications
                })
            })

            return () => {
                socket.off("receiveNotification")
            }
        }
    }, [socket])

    const clearNotifications = () => {
        setNotification([])
        localStorage.removeItem('notifications')
    }

    return (
        <header className="sticky top-0 flex h-16 items-center gap-4 bg-background border-b px-4 md:px-6 z-20">
            <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                <Link
                    to="/"
                    className="flex items-center gap-2 text-lg font-semibold md:text-base"
                >
                    <AppWindow className="h-8 w-8" />
                </Link>
                {!isAdmin ? (
                    <>
                        <Link
                            to="/"
                            className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Home
                        </Link>
                        <Link
                            to="/user/myTests"
                            className="text-muted-foreground transition-colors hover:text-foreground whitespace-nowrap"
                        >
                            My Tests
                        </Link>
                        <Link
                            to="/user/sampleTests"
                            className="text-muted-foreground transition-colors hover:text-foreground whitespace-nowrap"
                        >
                            Sample Tests
                        </Link>
                        <Link
                            to="/user/practice"
                            className="text-muted-foreground transition-colors hover:text-foreground whitespace-nowrap"
                        >
                            Practice
                        </Link>
                    </>
                ) : (
                    <>
                        <Link
                            to="/admin/createTest"
                            className="text-muted-foreground transition-colors hover:text-foreground whitespace-nowrap"
                        >
                            Create Test
                        </Link>
                        <Link
                            to="/admin/viewApplicants"
                            className="text-muted-foreground transition-colors hover:text-foreground whitespace-nowrap"
                        >
                            View Applicants
                        </Link>
                        <Link
                            to="/admin/createCodingTest"
                            className="text-muted-foreground transition-colors hover:text-foreground whitespace-nowrap"
                        >
                            Create Coding Test
                        </Link>
                    </>
                )}
            </nav>
            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 md:hidden"
                    >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <nav className="grid gap-6 text-lg font-medium">
                        <Link
                            to="/"
                            className="flex items-center gap-2 text-lg font-semibold md:text-base"
                        >
                            <AppWindow className="h-8 w-8" />
                        </Link>
                        {!isAdmin ? (
                            <>
                                <Link
                                    to="/"
                                    className="text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    Home
                                </Link>
                                <Link
                                    to="/user/myTests"
                                    className="text-muted-foreground transition-colors hover:text-foreground whitespace-nowrap"
                                >
                                    My Tests
                                </Link>
                                <Link
                                    to="/user/sampleTests"
                                    className="text-muted-foreground transition-colors hover:text-foreground whitespace-nowrap"
                                >
                                    Sample Tests
                                </Link>
                                <Link
                                    to="/user/practice"
                                    className="text-muted-foreground transition-colors hover:text-foreground whitespace-nowrap"
                                >
                                    Practice
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/admin/createTest"
                                    className="text-muted-foreground transition-colors hover:text-foreground whitespace-nowrap"
                                >
                                    Create Test
                                </Link>
                                <Link
                                    to="/admin/viewApplicants"
                                    className="text-muted-foreground transition-colors hover:text-foreground whitespace-nowrap"
                                >
                                    View Applicants
                                </Link>
                                <Link
                                    to="/admin/createCodingTest"
                                    className="text-muted-foreground transition-colors hover:text-foreground whitespace-nowrap"
                                >
                                    Create Coding Test
                                </Link>
                            </>
                        )}
                    </nav>
                </SheetContent>
            </Sheet>
            <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                <div className='ml-auto'>
                    {isLoggedIn ? (
                        <>
                            <div className='flex gap-4'>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="secondary" size="icon">
                                            <Bell className="h-4 w-4" />
                                            <span className="sr-only">Toggle Notification</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>
                                            Notification
                                            <Button variant="link" onClick={clearNotifications} className="ml-2 text-sm text-red-500">Clear</Button>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        {notification.map((n: string, i: number) => (
                                            <DropdownMenuItem key={i}>{n}</DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="secondary" size="icon" className="rounded-full">
                                            <CircleUser className="h-5 w-5" />
                                            <span className="sr-only">Toggle user menu</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>Settings</DropdownMenuItem>
                                        <DropdownMenuItem>Support</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => logout()}>Logout</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </>
                    ) : (
                        <>
                            <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                                <Link
                                    to="/signin"
                                    className="text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    Sign Up
                                </Link>
                            </nav>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}
