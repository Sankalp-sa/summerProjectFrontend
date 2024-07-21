import React, { useState } from 'react';
import Navbar from "@/components/Navbar";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Editor } from '@monaco-editor/react';

export default function CreateCodingQuestion() {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [testCaseInput, setTestCaseInput] = useState<string>("");
    const [testCases, setTestCases] = useState<any[]>([]);
    const [value, setValue] = useState<string>("");

    const { id } = useParams();

    const addTestCase = () => {
        if (testCaseInput.trim()) {
            setTestCases([...testCases, testCaseInput]);
            setTestCaseInput("");
        }
    };

    return (
        <div>
            <div className="flex min-h-screen w-full flex-col bg-muted/40">
                <Navbar />
                <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8 m-12" style={{ padding: "1% 13%" }}>
                    <Card x-chunk="dashboard-07-chunk-0">
                        <CardHeader className="flex flex-col">
                            <p className="text-3xl font-bold">Create Coding Question</p>
                            <CardDescription>
                                Add information for coding question. Click save when you're done.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col">
                            <div className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        type="text"
                                        className="w-full"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Enter title"
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        className="w-full"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Enter description"
                                    />
                                </div>
                                <div className="grid gap-3 p-4 rounded-lg border border-1 shadow-sm">
                                    <div className='flex'>
                                        <h3 className='text-lg font-semibold'>Add Test Cases</h3>
                                        <Button className='ml-auto' onClick={addTestCase}>Add</Button>
                                    </div>
                                    <Label htmlFor="testCaseInput">Input</Label>
                                    <Textarea
                                        id="testCaseInput"
                                        className="w-full"
                                        value={testCaseInput}
                                        onChange={(e) => setTestCaseInput(e.target.value)}
                                        placeholder="Enter input"
                                    />
                                </div>
                                {testCases.length > 0 ?
                                    <div className="p-4 rounded-lg border border-1 shadow-sm">
                                        <h3 className='text-lg font-semibold mb-4'>Test Cases</h3>
                                        {/* Use grid to show input */}
                                        <div className='grid grid-cols-3 gap-4 '>
                                            {testCases.map((testCase, index) => (
                                                <div>
                                                    <p className='font-semibold mb-2'>Test Case {index + 1}</p>
                                                    <pre className="w-[300px] rounded-md bg-slate-900 p-4">
                                                        <code className='text-white'>{testCase}</code>
                                                    </pre>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    : ""}
                                <div className="grid gap-3">
                                    <Label htmlFor='solution'>Solution</Label>
                                    <div className='rounded-md border border-1 shadow-sm p-2'>
                                        <Editor
                                            height="60vh"
                                            width="100%"
                                            language="cpp"
                                            theme='vs-dark'
                                            value={value}
                                            onChange={(value: any) => setValue(value)}
                                            defaultValue={" // Copy paste your solution here in c++ language"}
                                            options={{
                                                fontSize: 16,
                                                minimap: {
                                                    enabled: false
                                                },
                                                contextmenu: false,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='text-right'>
                                <Button className='mt-4'>Add Question</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
