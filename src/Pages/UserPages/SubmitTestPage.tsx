import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Clock, Info, Terminal } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { BACKEND_URL } from '@/config/config'
import { toast } from '@/components/ui/use-toast'
import { useNavigate, useParams } from 'react-router-dom'
import { useTime } from '@/Context/TimeContext'
import SideBar from '@/components/SideBar'
import moment from 'moment'
import { set } from 'date-fns'


export default function SubmitTestPage() {

    const { handleTestSubmit, setTimeLeft, setDuration, setIsTestStarted, timeLeft } = useTime()

    const { testid } = useParams();

    const [codingTestId, setCodingTestId] = useState<string | undefined>();

    const [questions, setQuestions] = useState<any>([])

    const [testInfo, setTestInfo] = useState<any>({})

    const [answers, setUserAnswers] = useState<any>([])

    const navigate = useNavigate()

    const setAnswers = () => {

        const answersJson = localStorage.getItem('userAnswers');
        const a: string[] = answersJson ? JSON.parse(answersJson) : [];

        setUserAnswers(a);

    }

    useEffect(() => {

        setAnswers();

    }
        , [])

    const fetchResponse = async () => {

        const res = await fetch(`${BACKEND_URL}/api/v1/test/getSingleTest/${testid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        const data = await res.json();


        setTestInfo(data.data.test);

    }

    useEffect(() => {

        fetchResponse();

    }, [])

    const fetchQuestions = async () => {
        const res = await fetch(`${BACKEND_URL}/api/v1/test/getSingleTest/${testid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        const data = await res.json();

        setCodingTestId(data.data.test.Codingtest);

        setQuestions(data.data.Questions);
    };

    useEffect(() => {

        fetchQuestions();

    }, [])

    const handleSubmit = async () => {

        if (testid) {
            handleTestSubmit(questions, testid);
        }

        toast({
            title: 'Submission Successful',
            description: 'Test Submited Successfully.',
        });

        setTimeLeft("");
        setDuration(0);
        setIsTestStarted(false);

        localStorage.removeItem('timeLeft');
        localStorage.removeItem('isTimeUp');
        localStorage.removeItem('duration');
        localStorage.removeItem('startTime');
        localStorage.removeItem('userAnswers')
        localStorage.setItem('isTestStarted', 'false');

        navigate("/user/myTests")

    }

    const handleTimpUp = async () => {

        if (timeLeft === 'Time Up') {

            if (testid) {
                handleTestSubmit(questions, testid);
            }

            toast({
                title: 'Time Up',
                description: 'Time is up for the test.',
            });

            setTimeLeft("");
            setDuration(0);
            setIsTestStarted(false);

            localStorage.removeItem('timeLeft');
            localStorage.removeItem('isTimeUp');
            localStorage.removeItem('duration');
            localStorage.removeItem('startTime');
            localStorage.removeItem('userAnswers');
            localStorage.setItem('isTestStarted', 'false');

            navigate("/user/myTests")

        }

    }

    useEffect(() => {
        handleTimpUp();
    }, [timeLeft]);



    return (
        <div className='flex'>
            <SideBar testid={testid} codingTestId={codingTestId} />
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6">Submit Test</h1>
                <div className="mb-6">
                    <span>Time Left: {timeLeft}</span>
                </div>
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>{testInfo?.test_name}</CardTitle>
                        <CardDescription>Review your test details before submitting</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center">
                                <Clock className="mr-2" />
                                <span>Duration: {moment.duration(testInfo?.duration, "seconds").hours()} hrs {moment.duration(testInfo.duration, "seconds").minutes()} min {moment.duration(testInfo.duration, "seconds").seconds()} sec</span>
                            </div>
                            <div className="flex items-center">
                                <Info className="mr-2" />
                                <span>Total Questions: {testInfo?.questionArray?.length}</span>
                            </div>
                            <div>Attempted: {answers.length}</div>
                            <div>Unattempted: {testInfo?.questionArray?.length - answers.length}</div>
                        </div>
                    </CardContent>
                </Card>

                <Alert className="mb-6">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Important!</AlertTitle>
                    <AlertDescription>
                        Once you submit the test, you won't be able to make any changes. Please ensure you've reviewed all your answers before submitting.
                    </AlertDescription>
                </Alert>

                <Card>
                    <CardContent className="pt-6">
                        <p className="mb-4">Are you ready to submit your test?</p>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button>Submit Test</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure you want to submit the test?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. Once submitted, you won't be able to make any changes to your answers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleSubmit}>Submit</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}