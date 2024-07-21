import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHeader,
    TableHead,
    TableRow,
} from "@/components/ui/table";
import React, { Key, useEffect, useReducer } from 'react';
import { BACKEND_URL } from '@/config/config';
import { useSocket } from '@/Context/SocketContext';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ViewApplicants() {

    const { socket } = useSocket()

    const [applicants, setApplicants] = React.useState([]);
    const [selectedApplicants, setSelectedApplicants] = React.useState<string[]>([]);
    const [selectAll, setSelectAll] = React.useState(false);

    const [tests, setTests] = React.useState([]);
    const [selectedTest, setSelectedTest] = React.useState<string | React.ChangeEvent<HTMLSelectElement>>(
        "" as string | React.ChangeEvent<HTMLSelectElement>
    );

    const getAllApplication = async () => {
        const res = await fetch(`${BACKEND_URL}/api/v1/application/getApplications`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        });

        const data = await res.json();
        console.log(data.applications);

        if (res.ok) {
            setApplicants(data.applications);
        } else {
            setApplicants([]);
        }
    };

    useEffect(() => {
        getAllApplication();
    }, []);

    useEffect(() => {

        if (socket) {
            console.log('Socket connected:', socket);

            socket.on("receiveNotification", (data: String) => {
                console.log(data);
            });

            return () => {
                socket.off("receiveNotification");
            };
        }
    }, [])

    useEffect(() => {
        if (selectAll) {
            const allIds = applicants.map((app: any) => app.student._id);
            setSelectedApplicants(allIds);
        } else {
            setSelectedApplicants([]);
        }
    }, [selectAll, applicants]);

    const handleCheckboxChange = (id: string) => {
        setSelectedApplicants(prev => {
            if (prev.includes(id)) {
                return prev.filter(applicantId => applicantId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const getAllTests = async () => {

        const res = await fetch(`${BACKEND_URL}/api/v1/test/getTest`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        });

        const data = await res.json();
        console.log(data.data);

        if (res.ok) {
            setTests(data.data);
        } else {
            setTests([]);
        }

    }

    useEffect(() => {
        getAllTests();
    }, []);

    const handleSendTest = async () => {

        const res = await fetch(`${BACKEND_URL}/api/v1/notification/sendTest`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    userArray: selectedApplicants,
                    testId: selectedTest
                })
            });

        const data = await res.json();

        if (res.ok) {
            console.log(data);
        } else {
            console.log(data);
        }

    }

    return (
        <>
            <div className="flex min-h-screen w-full flex-col bg-muted/40">
                <Navbar />
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 h-screen mx-12 my-6">
                    <div className="flex items-center gap-4">
                        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                            View Applicants
                        </h1>
                        <div className="items-center gap-2 md:ml-auto md:flex">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button>Send Test</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Send Test</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="select">
                                                Select Test
                                            </Label>
                                            <div className='col-span-3'>
                                                <Select onValueChange={(value) => setSelectedTest(value)}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Test" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {tests.map((test: any) => (
                                                            <SelectItem key={test._id} value={test._id}>
                                                                {test.test_name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={handleSendTest}> Send Test </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                    {applicants.length === 0 ? (
                        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm" x-chunk="dashboard-02-chunk-1">
                            <div className="flex flex-col items-center gap-1 text-center">
                                <h3 className="text-2xl font-bold tracking-tight">
                                    You have no Applicants yet
                                </h3>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-lg border border-1 border-inherit shadow-sm bg-white" x-chunk="dashboard-02-chunk-1">
                            <Table>
                                <TableCaption className='mb-4'>A list of Applicants.</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className='w-[100px]'>
                                            <input
                                                type="checkbox"
                                                checked={selectAll}
                                                onChange={() => setSelectAll(!selectAll)}
                                            />
                                        </TableHead>
                                        <TableHead>Applicant Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>View More</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {applicants?.map((app: any) => (
                                        <TableRow key={app?.student._id as Key}>
                                            <TableCell className='w-[100px]'>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedApplicants.includes(app.student._id)}
                                                    onChange={() => handleCheckboxChange(app.student._id)}
                                                />
                                            </TableCell>
                                            <TableCell>{app.student.name}</TableCell>
                                            <TableCell>{app.student.email}</TableCell>
                                            <TableCell>{app.application.status}</TableCell>
                                            <TableCell>
                                                <Button>View More</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
