import Navbar from '@/components/Navbar'
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
import React from 'react'
import { add, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { TimePickerDemo } from '@/utils/time-picker-demo'
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
import { Textarea } from '@/components/ui/textarea'
import { useNavigate } from 'react-router-dom'

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function CreateTest() {

    const [tests, setTests] = React.useState([]);

    const [question, setQuestion] = React.useState<string>("");
    const [option1, setOption1] = React.useState<string>("");
    const [option2, setOption2] = React.useState<string>("");
    const [option3, setOption3] = React.useState<string>("");
    const [option4, setOption4] = React.useState<string>("");
    const [correctOption, setCorrectOption] = React.useState<string>("");

    const navigate = useNavigate();

    // get all tests
    const getTests = async () => {

        try {

            const res = await fetch(`${BACKEND_URL}/api/v1/test/getTest`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            const data = await res.json()

            console.log(data)

            setTests(data.data)

        }
        catch (err) {
            console.log(err)
        }
    }

    React.useEffect(() => {
        getTests()
    }, [])

    const handleAddQuestion = async (test_id: string) => {
        try {
            const questionData = {
                test_id: test_id,
                question: question,
                option1: option1,
                option2: option2,
                option3: option3,
                option4: option4,
                correct_option: correctOption
            }

            const res = await fetch(`${BACKEND_URL}/api/v1/question/createquestion`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(questionData),
            })

            const data = await res.json()

            console.log(data)
            // Optionally, you can refresh the list of tests to include the new question
            getTests();
        }
        catch (err) {
            console.log(err)
        }
    }

    // handle delete of the test

    const handleDelete = async (id: string) => {

        try {

            const res = await fetch(`${BACKEND_URL}/api/v1/test/deleteTest`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }),
            })

            console.log(res)

        } catch (error) {

            console.log(error)

        }

        getTests()

    }

    return (
        <>
            <div className="flex min-h-screen w-full flex-col bg-muted/40">
                <Navbar />
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 h-screen mx-12 my-6">
                    <div className="flex items-center gap-4">
                        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                            Create Test
                        </h1>
                        <div className="items-center gap-2 md:ml-auto md:flex">
                            <Button onClick={() => navigate("/admin/addTest")}>Add Test</Button>
                        </div>
                    </div>
                    {tests.length === 0 ? (
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
                                        <TableHead>Date</TableHead>
                                        <TableHead>Start Time</TableHead>
                                        <TableHead>End Time</TableHead>
                                        <TableHead>No. of Questions</TableHead>
                                        <TableHead>Edit Test</TableHead>
                                        <TableHead>Add Question</TableHead>
                                        <TableHead className="text-right">Delete</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {tests.map((test: any) => (
                                        <TableRow key={test._id} >
                                            <TableCell className="font-medium">{test.test_name}</TableCell>
                                            <TableCell>{format(new Date(test.start_time), "PPP")}</TableCell>
                                            <TableCell>{format(new Date(test.start_time), "HH:mm:ss")}</TableCell>
                                            <TableCell>{format(new Date(test.end_time), "HH:mm:ss")}</TableCell>
                                            <TableCell>{test.questionArray.length}</TableCell>
                                            <TableCell><Button variant='secondary' onClick={() => navigate(`/admin/editTest/${test._id}`)}><span className="material-symbols-outlined">
                                                edit
                                            </span></Button></TableCell>
                                            <TableCell>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button><span className="material-symbols-outlined">
                                                            add
                                                        </span></Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-[500px]">
                                                        <DialogHeader>
                                                            <DialogTitle>Add Questions</DialogTitle>
                                                        </DialogHeader>
                                                        <div className="grid gap-4 py-4">
                                                            <div className="grid grid-cols-4 items-center gap-4">
                                                                <Label htmlFor="name" className="text-right">
                                                                    Question
                                                                </Label>
                                                                <Textarea className="col-span-3" placeholder="Type your message here." onChange={(e) =>
                                                                    setQuestion(e.target.value)
                                                                } />
                                                            </div>
                                                            <div className="grid grid-cols-4 items-center gap-4">
                                                                <Label htmlFor="username" className="text-right">
                                                                    Option 1
                                                                </Label>
                                                                <Input
                                                                    id="username"
                                                                    placeholder='Enter option 1 here'
                                                                    className="col-span-3"
                                                                    onChange={(e) => setOption1(e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="grid grid-cols-4 items-center gap-4">
                                                                <Label htmlFor="username" className="text-right">
                                                                    Option 2
                                                                </Label>
                                                                <Input
                                                                    id="username"
                                                                    placeholder='Enter option 2 here'
                                                                    className="col-span-3"
                                                                    onChange={(e) => setOption2(e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="grid grid-cols-4 items-center gap-4">
                                                                <Label htmlFor="username" className="text-right">
                                                                    Option 3
                                                                </Label>
                                                                <Input
                                                                    id="username"
                                                                    placeholder='Enter option 3 here'
                                                                    className="col-span-3"
                                                                    onChange={(e) => setOption3(e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="grid grid-cols-4 items-center gap-4">
                                                                <Label htmlFor="username" className="text-right">
                                                                    Option 4
                                                                </Label>
                                                                <Input
                                                                    id="username"
                                                                    placeholder='Enter option 4 here'
                                                                    className="col-span-3"
                                                                    onChange={(e) => setOption4(e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="grid grid-cols-4 items-center gap-4">
                                                                <Label htmlFor="username" className="text-right">
                                                                    Correct Option
                                                                </Label>
                                                                <Input
                                                                    id="username"
                                                                    placeholder='Enter correct option here'
                                                                    className="col-span-3"
                                                                    onChange={(e) => setCorrectOption(e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                        <DialogFooter>
                                                            <Button type="submit" onClick={() => handleAddQuestion(test._id)}>Add Question</Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
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
        </>
    )
}
