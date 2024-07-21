import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Navbar from '@/components/Navbar';
import { useParams } from "react-router-dom";
import { useAuth } from '@/Context/AuthContext';
import { BACKEND_URL } from '@/config/config';
import { any } from 'zod';

export default function ViewScore() {
    const [responses, setResponses] = useState<any[]>([]);
    const { user } = useAuth();
    const { id } = useParams();

    const getAllResponses = async () => {
        const res = await fetch(`${BACKEND_URL}/api/v1/test/getTestWithResponse/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        const data = await res.json();
        console.log('test', data);
        setResponses(data.data);
    };

    useEffect(() => {
        if (user?.user?.id) {
            getAllResponses();
        }
    }, [user]);

    // Separate responses into userResponse and otherResponses
    const userResponse = responses.filter(r => r.student._id === user?.user?.id);
    const otherResponses = responses.filter(r => r.student._id !== user?.user?.id);

    return (
        <>
            <Navbar />
            <h2 className="text-center text-2xl font-semibold my-4 mt-12">
                Scores of Test : {responses[0]?.test?.test_name}
            </h2>
            <div style={{ padding: "2% 17%" }}>
                <Card x-chunk="dashboard-05-chunk-3">
                    <CardHeader className="px-7">
                        <CardTitle>Scores</CardTitle>
                        <CardDescription>
                            Below are the scores of all students
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Rank</TableHead>
                                    <TableHead className="hidden sm:table-cell">
                                        Name
                                    </TableHead>
                                    <TableHead className="hidden sm:table-cell">
                                        E-mail
                                    </TableHead>
                                    <TableHead className="hidden sm:table-cell">
                                        Score
                                    </TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Status 
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {userResponse.map((r, index) => (
                                    <TableRow key={r.response._id} className="bg-accent">
                                        <TableCell>{responses.findIndex(res => res.student._id === r.student._id) + 1}</TableCell>
                                        <TableCell className="hidden sm:table-cell">{r.student.name}</TableCell>
                                        <TableCell className="hidden sm:table-cell">{r.student.email}</TableCell>
                                        <TableCell className="hidden sm:table-cell">{r.response.score}</TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <Badge>Not available</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {otherResponses.map((r, index) => (
                                    <TableRow key={r.response._id}>
                                        <TableCell>{responses.findIndex(res => res.student._id === r.student._id) + 1}</TableCell>
                                        <TableCell className="hidden sm:table-cell">{r.student.name}</TableCell>
                                        <TableCell className="hidden sm:table-cell">{r.student.email}</TableCell>
                                        <TableCell className="hidden sm:table-cell">{r.response.score}</TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <Badge>Not available</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
