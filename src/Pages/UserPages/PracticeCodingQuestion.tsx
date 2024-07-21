import React, { useEffect, useState } from 'react'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import CodeEditor from '@/components/CodeEditor'
import { useNavigate, useParams } from 'react-router-dom'
import { BACKEND_URL } from '@/config/config';
import { CODE_SNIPPETS } from '@/Constants/snippet';
import { toast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function PracticeCodingQuestion() {

    const { id } = useParams();
    const [value, setValue] = useState<string>(CODE_SNIPPETS["javascript"]);
    const [language, setLanguage] = useState("javascript");
    const [questionDetails, setQuestionDetails] = useState<any>({})
    const [questionStatus, setQuestionStatus] = useState<any>("not attempted");

    const [loader2, setLoader2] = useState(false);

    const navigate = useNavigate();

    const getQuestionDetails = async () => {

        // Fetch the question details using the id
        const res = await fetch(`${BACKEND_URL}/api/v1/codingQuestion/getQuestion/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
        });

        const data = await res.json();

        console.log(data)

        if (res.status === 200) {
            setQuestionDetails(data);
        } else {
            console.log(data.message);
        }

    }

    useEffect(() => {

        getQuestionDetails();

    }, []);

    const getPracticeStatus = async () => {

        // Fetch the question details using the id
        const res = await fetch(`${BACKEND_URL}/api/v1/codingQuestion/getPracticeQuestion/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
        });

        const data = await res.json();

        console.log(data)

        if (res.status === 200) {
            setQuestionStatus(data.practiceStatus);
        } else {
            console.log(data.message);
        }

    }

    useEffect(() => {

        getPracticeStatus();

    }, []);



    const onSubmit = async () => {

        setLoader2(true);

        const res = await fetch(`${BACKEND_URL}/api/v1/codingQuestion/submitPractice`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ language, code: value, questionId: id })
        })

        setLoader2(false);

        const data = await res.json();

        console.log(data);

        const result = data.data

        let f: number = 0;

        for (let i = 0; i < result.testCaseResult.length; i += 1) {

            if (result.testCaseResult[i].result === "Failed") {
                f = -1
                break
            }

        }

        if (f == -1) {
            toast({
                variant: "destructive",
                title: "Some test cases failed try again",
                description: "Please check your code and try again"
            });
        }
        else {
            toast({
                title: "All test cases passed",
                description: "Congratulations"
            });
        }

    }

    return (
        <>
            <Navbar />
            <div>
                <ResizablePanelGroup
                    direction="horizontal"
                    className="min-h-screen rounded-lg border"
                >
                    <ResizablePanel defaultSize={30}>
                        <div className="p-5">
                            <div className="flex flex-col gap-4">
                                <div className='flex'>
                                    <h1 className="text-2xl font-semibold">{questionDetails.title}</h1>
                                    <div className='ml-auto'>
                                        {/* { show practiceStatus below } */}
                                        <Badge className={
                                            questionStatus === "not attempted" ? "bg-gray-400" :
                                                questionStatus === "solved" ? "bg-green-400" :
                                                    questionStatus === "incomplete" ? "bg-yellow-400" : "bg-gray-400"
                                        }>
                                            {questionStatus === "not attempted" ? "Not Solved" : "Solved"}
                                        </Badge>
                                    </div>
                                </div>
                                <p className="text-lg">{questionDetails.description}</p>
                                <p className="text-lg"><span className='font-semibold'>Difficulty:</span> {questionDetails.difficulty ? questionDetails.difficulty : "Not Mentioned"}</p>
                            </div>
                            {/* Show the test cases too / */}
                            <div className='flex flex-col gap-4 mt-4'>
                                <h1 className='text-xl font-semibold'>Examples :</h1>
                                <div className='flex flex-col gap-4'>
                                    {questionDetails.testCases?.map((testCase: any, index: number) => (
                                        // use grid to show input and output 
                                        <div key={index} className='grid grid-cols-2 gap-4'>
                                            <div>
                                                <h1 className='text-lg font-semibold'>Input</h1>
                                                <p>{testCase.input.split('\n').map((input: any) => {
                                                    return <>{input}<br /></>
                                                })}</p>
                                            </div>
                                            <div>
                                                <h1 className='text-lg font-semibold'>Output</h1>
                                                <p>{testCase.output.split('\n').map((output: any) => {
                                                    return <>{output}<br /></>
                                                })}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={70} className='bg-muted/40'>
                        <CodeEditor language={language} setLanguage={setLanguage} value={value} setValue={setValue} isPractice={true} onSubmit={onSubmit} loader2={loader2} />
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </>
    )
}
