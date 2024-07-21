import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FileQuestion, Home, Package, Package2, Send, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './ui/button'
import { cn } from "@/lib/utils"
import { useAuth } from '@/Context/AuthContext'

interface NavItemProps {
    to: string;
    icon: any;
    label: string;
    collapsed: boolean;
    active?: boolean;
    inst?: boolean;
    testid?: string;
} 

interface SideBarProps {
    testid: string | undefined;
    codingTestId: string | undefined;
}

export default function SideBar({testid, codingTestId} : SideBarProps) {
    const [collapsed, setCollapsed] = useState(true)

    return (
        <div className={cn(
            "relative h-screen border-r bg-muted/40 transition-all duration-300 ease-in-out",
            collapsed ? "w-16" : "w-64"
        )}>
            <div className="flex h-full flex-col gap-2">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Link to="/" className="flex items-center gap-2 font-semibold">
                        <Package2 className="h-6 w-6" />
                        {!collapsed && <span className="">Logo</span>}
                    </Link>
                </div>
                <div className="flex-1">
                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-4">
                        <NavItem to={`/user/startTest/${testid}`} icon={Home} label="Go to Instructions" collapsed={collapsed} testid={testid}/>
                        <NavItem to={`/user/test/${testid}`} icon={Package} label="MCQ's Page" collapsed={collapsed} />
                        <NavItem to={`/user/viewCodingQuestions/${codingTestId}/${testid}`} icon={FileQuestion} label="Coding Questions" collapsed={collapsed} />
                        <NavItem to={`/user/submitTest/${testid}`} icon={Send} label="Submit Test" collapsed={collapsed} />
                    </nav>
                </div>
            </div>
            <div 
                className="absolute top-1/2 -right-3 h-10 w-6 bg-white border cursor-pointer flex items-center justify-center rounded-md transition-all duration-300 ease-in-out"
                onClick={() => setCollapsed(!collapsed)}
            >
                {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </div>
        </div>
    )
}

function NavItem({ to, icon: Icon, label, collapsed, active = false, inst, testid} : NavItemProps)  {

    const navigate = useNavigate();

    const { user } = useAuth();

    return (
        <Link
            to={to}
            state={{studentId: user?.user?.id}}
            className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                active ? "bg-muted text-primary" : "text-muted-foreground",
                collapsed && "justify-center"
            )}
            title={collapsed ? label : undefined}
        >
            <Icon className="h-4 w-4" />
            {!collapsed && <span>{label}</span>}
        </Link>
    )
}