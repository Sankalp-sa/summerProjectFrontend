import React from "react"

import Navbar from "@/components/Navbar"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BACKEND_URL } from "@/config/config"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

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
import { Textarea } from "@/components/ui/textarea"

interface Question {
    _id: string,
    question: string,
    option1: string,
    option2: string,
    option3: string,
    option4: string,
    correctoption: number
}

export default function EditTest() {

    const [date, setDate] = useState<Date>(new Date("2022-01-01T00:00:00.000Z"));
    const [edate, setEdate] = useState<Date>(new Date("2022-01-01T00:00:00.000Z"));
    const [name, setName] = useState<string>("");
    const [questionArray, setQuestionArray] = useState<Question[]>([]);

    const [question, setQuestion] = React.useState<string>("");
    const [option1, setOption1] = React.useState<string>("");
    const [option2, setOption2] = React.useState<string>("");
    const [option3, setOption3] = React.useState<string>("");
    const [option4, setOption4] = React.useState<string>("");
    const [correctOption, setCorrectOption] = React.useState<string>("");

    const { id } = useParams();

    const handleSelect = (newDay: Date | undefined) => {
        if (!newDay) return;
        if (!date) {
            setDate(newDay);
            return;
        }
        const diff = newDay.getTime() - date.getTime();
        const diffInDays = diff / (1000 * 60 * 60 * 24);
        const newDateFull = add(date, { days: Math.ceil(diffInDays) });
        setDate(newDateFull);
    };

    const handleEndSelect = (newDay: Date | undefined) => {
        if (!newDay) return;
        if (!date) {
            setDate(newDay);
            return;
        }
        const diff = newDay.getTime() - date.getTime();
        const diffInDays = diff / (1000 * 60 * 60 * 24);
        const newDateFull = add(date, { days: Math.ceil(diffInDays) });
        setEdate(newDateFull);
    };

    const getQuestionDetails = async (qid: string) => {
        const response = await fetch(`${BACKEND_URL}/api/v1/question/viewquestion/${qid}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        const data = await response.json();
        return data;
    };

    const getTestDetails = async () => {
        const response = await fetch(`${BACKEND_URL}/api/v1/test/getSingleTest/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        const data = await response.json();

        setName(data?.data?.test?.test_name);
        setDate(new Date(data?.data?.test?.start_time));
        setEdate(new Date(data?.data?.test?.end_time));

        let ques = [];

        for (let i = 0; i < data?.data?.test?.questionArray?.length; i++) {
            let q = await getQuestionDetails(data?.data?.test?.questionArray[i]);
            ques.push(q);
        }

        setQuestionArray(ques);
    };

    useEffect(() => {
        getTestDetails();
    }, [id]);

    const handleInputChange = (id: string, field: string, value: string | number) => {
        setQuestionArray(prevQuestionArray =>
            prevQuestionArray.map(question =>
                question._id === id ? { ...question, [field]: value } : question
            )
        );
    };

    const handleSaveChanges = async () => {
        const response = await fetch(`${BACKEND_URL}/api/v1/test/updateTest`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id,
                name,
                start_time: date,
                end_time: edate,
                questionArray
            })
        });

        if (response.ok) {
            alert("Test updated successfully");
        } else {
            alert("Failed to update test");
        }
    };

    const handleQuestionDelete = async () => {

        const response = await fetch(`${BACKEND_URL}/api/v1/question/deletequestion`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: questionArray[0]._id
            })
        });

        if (response.ok) {
            alert("Question deleted successfully");
        } else {
            alert("Failed to delete question");
        }

    }

    const handleAddQuestion = async (test_id: string | undefined) => {
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
            getTestDetails();
        }
        catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <div className="flex min-h-screen w-full flex-col bg-muted/40">
                <Navbar />
                <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8 m-12" style={{ "padding": "1% 13%" }}>
                    <Card x-chunk="dashboard-07-chunk-0">
                        <CardHeader className="flex flex-col">
                            <p className="text-3xl font-bold">Edit Test</p>
                            <CardDescription>
                                Change the below test details and click on save to update the test.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col">
                            <div className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        className="w-full"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className='grid grid-rows-1 grid-flow-col gap-4'>
                                    <div className="grid gap-3">
                                        <Label htmlFor="start_time">
                                            Start Time
                                        </Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button 
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[280px] justify-start text-left font-normal",
                                                        !date && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {date ? format(date, "PPP HH:mm:ss") : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={date}
                                                    onSelect={(d: Date | undefined) => handleSelect(d)}
                                                    initialFocus
                                                />
                                                <div className="p-3 border-t border-border">
                                                    <TimePickerDemo setDate={setDate as
                                                    React.Dispatch<React.SetStateAction<Date>>
                                                    } date={date} />
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="end_time">
                                            End Time
                                        </Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[280px] justify-start text-left font-normal",
                                                        !edate && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {edate ? format(edate, "PPP HH:mm:ss") : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={edate}
                                                    onSelect={(d: Date | undefined) => handleEndSelect(d)}
                                                    initialFocus
                                                />
                                                <div className="p-3 border-t border-border">
                                                    <TimePickerDemo setDate={setEdate as 
                                                    React.Dispatch<React.SetStateAction<Date>>
                                                    } date={edate} />
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                                <div className="grid gap-3">
                                    <div className="space-y-4">
                                        {questionArray?.map((q, index) => (
                                            <Card key={q?._id}>
                                                <CardHeader>
                                                    <CardTitle>Question {index + 1}</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="grid gap-3 pb-4">
                                                        <Label htmlFor={`question-${q?._id}`}>Question</Label>
                                                        <Input
                                                            id={`question-${q?._id}`}
                                                            type="text"
                                                            className="w-full"
                                                            value={q?.question}
                                                            onChange={(e) => handleInputChange(q._id, "question", e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-4 gap-4">
                                                        <div className="grid gap-3">
                                                            <Label htmlFor={`option1-${q?._id}`}>Option 1</Label>
                                                            <Input
                                                                id={`option1-${q?._id}`}
                                                                type="text"
                                                                value={q?.option1}
                                                                onChange={(e) => handleInputChange(q._id, "option1", e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="grid gap-3">
                                                            <Label htmlFor={`option2-${q?._id}`}>Option 2</Label>
                                                            <Input
                                                                id={`option2-${q?._id}`}
                                                                type="text"
                                                                value={q?.option2}
                                                                onChange={(e) => handleInputChange(q._id, "option2", e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="grid gap-3">
                                                            <Label htmlFor={`option3-${q?._id}`}>Option 3</Label>
                                                            <Input
                                                                id={`option3-${q?._id}`}
                                                                type="text"
                                                                value={q?.option3}
                                                                onChange={(e) => handleInputChange(q._id, "option3", e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="grid gap-3">
                                                            <Label htmlFor={`option4-${q?._id}`}>Option 4</Label>
                                                            <Input
                                                                id={`option4-${q?._id}`}
                                                                type="text"
                                                                value={q?.option4}
                                                                onChange={(e) => handleInputChange(q._id, "option4", e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="grid gap-3">
                                                            <Label htmlFor={`correctoption-${q?._id}`}>Correct Option</Label>
                                                            <Input
                                                                id={`correctoption-${q?._id}`}
                                                                type="number"
                                                                value={q?.correctoption}
                                                                onChange={(e) => handleInputChange(q._id, "correctoption", parseInt(e.target.value))}
                                                            />
                                                        </div>
                                                        <div className="grid gap-3">
                                                        </div>
                                                        <div className="grid gap-3">
                                                        </div>
                                                        <div className="text-right mt-6">
                                                            <Button variant='destructive' onClick={handleQuestionDelete}><span className="material-symbols-outlined">
                                                                delete
                                                            </span></Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <div>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="me-4">Add Question</Button>
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
                                            <Button type="submit" onClick={() => handleAddQuestion(id)}>Add Question</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                                </div>
                                <Button onClick={handleSaveChanges}>Save Changes</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}
