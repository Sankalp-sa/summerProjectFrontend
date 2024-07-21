import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { useParams } from 'react-router-dom';
import { BACKEND_URL } from '@/config/config';
import { useLocation } from 'react-router-dom';

export default function StartTest() {
    const navigate = useNavigate();

    const { id } = useParams();

    const location = useLocation();

    const [isStarted, setIsStarted] = useState(false);

    const handleStartTest = async () => {

        const startTime = new Date();

        const res = await fetch(`${BACKEND_URL}/api/v1/test/startTest`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                studentId: location.state.studentId,
                testId: id,
                startTime: startTime,
            }),
        });

        const data = await res.json();
        console.log('start test', data);

        // Replace '/test' with the actual route of your test page
        navigate(`/user/test/${id}`);
    };

    const getResponseInfo = async () => {
        try {
            // Await the fetch call to resolve, getting the Response object
            const response = await fetch(
                `${BACKEND_URL}/api/v1/test/getResponse?studentId=${location.state.studentId}&testId=${id}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                }
            );
            
            // Now that we have the Response object, we can await its json() method
            const data = await response.json();

            if (data.data[0].isStarted) {
                setIsStarted(true);
            }
    
            console.log('response', data);
        } catch (error) {
            console.error('Error fetching response info:', error);
        }
    };

    useEffect(() => {

        getResponseInfo();

    }, [])

    return (
        <div className="bg-muted/40 min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-md max-w-2xl w-full border border-1 border-inherit shadow-sm">
                    <h1 className="text-3xl font-bold mb-6">Instructions</h1>
                    <ul className="list-disc list-inside mb-6 space-y-2">
                        <li>Read each question carefully before selecting your answer.</li>
                        <li>You must choose the best answer from the given options.</li>
                        <li>Each question has only one correct answer.</li>
                        <li>You can change your answer before submitting the test.</li>
                        <li>The test is timed. Make sure to manage your time effectively.</li>
                        <li>Do not refresh the page during the test.</li>
                        <li>Click the "Submit" button at the end of the test to save your answers.</li>
                    </ul>
                    <div className="flex justify-end">
                        {isStarted ? (
                            <Button onClick={() => navigate(`/user/test/${id}`)} className="bg-blue-500 text-white hover:bg-blue-600">
                                Go Back to test
                            </Button>
                        ) : (
                            <Button onClick={handleStartTest} className="bg-blue-500 text-white hover:bg-blue-600">
                                Start Test
                            </Button>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
