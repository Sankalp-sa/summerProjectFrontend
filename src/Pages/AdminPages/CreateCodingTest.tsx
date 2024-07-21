import React, { useEffect } from 'react'
import { Button } from "@/components/ui/button"
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
import { BACKEND_URL } from '@/config/config'

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Navbar from '@/components/Navbar'
import { useNavigate } from 'react-router-dom'

export default function CreateCodingTest() {

    const [name, setName] = React.useState<string>();
    const [tests, setTests] = React.useState([]);

    const navigate = useNavigate();

    const handleAddTest = async () => {

        const res = await fetch(`${BACKEND_URL}/api/v1/codingTest/createCodingtest`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                test_name: name,
                Test_questions: []
            }),
        });

        const data = await res.json();

        console.log(data)

        getTests();

    }

    const getTests = async () => {

        const res = await fetch(`${BACKEND_URL}/api/v1/codingTest/getcodingtest`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await res.json();

        if (res.status === 200) {
            setTests(data.codingtest);
        } else {
            console.log(data.message);
        }
    }

    useEffect(() => {
        getTests();
    }, []);

    const handleDelete = async (id: string) => {

        const res = await fetch(`${BACKEND_URL}/api/v1/codingTest/deletecodingtest`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                test_id: id
            }),
        });

        const data = await res.json();

        console.log(data);

        getTests();

    }

    return (
        <div>
            <div className="flex min-h-screen w-full flex-col bg-muted/40">
                <Navbar />
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 h-screen mx-12 my-6">
                    <div className="flex items-center gap-4">
                        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                            Create Coding Test
                        </h1>
                        <div className="items-center gap-2 md:ml-auto md:flex">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button>Add Test</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Create Test</DialogTitle>
                                        <DialogDescription>
                                            Add information for test. Click add when you're done.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="name" className="text-right">
                                                Name
                                            </Label>
                                            <Input
                                                id="name"
                                                className="col-span-3"
                                                placeholder='e.g. "Frontend Developer Test"'
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" onClick={handleAddTest}>Add Test</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                    {tests?.length === 0 ? (
                        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm" x-chunk="dashboard-02-chunk-1">
                            <div className="flex flex-col items-center gap-1 text-center">
                                <h3 className="text-2xl font-bold tracking-tight">
                                    You have no tests
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Create test and send to applicants.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-lg border border-1 border-inherit shadow-sm bg-white" x-chunk="dashboard-02-chunk-1">
                            <Table>
                                <TableCaption className='mb-4'>A list of your Tests.</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Test Name</TableHead>
                                        <TableHead>No. of Questions</TableHead>
                                        <TableHead>Add Question</TableHead>
                                        <TableHead className="text-right">Delete</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {tests.map((test: any) => (
                                        <TableRow key={test._id} >
                                            <TableCell className="font-medium">{test.Test_name}</TableCell>
                                            <TableCell>{test.Test_questions.length}</TableCell>
                                            <TableCell>
                                                <Button onClick={() => navigate(`/admin/createCodingQuestion/${test._id}`)}><span className="material-symbols-outlined">
                                                    add
                                                </span></Button>
                                            </TableCell>
                                            <TableCell className='text-right'>
                                                <Button variant='destructive' onClick={() => handleDelete(test._id)}><span className="material-symbols-outlined">
                                                    delete
                                                </span></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )
                    }
                </main>
            </div>
        </div>
    )
}
