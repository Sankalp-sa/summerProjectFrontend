import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BACKEND_URL } from '@/config/config';
import { useAuth } from '@/Context/AuthContext';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useTime } from '@/Context/TimeContext';

export default function ViewSampleTests() {
    const [tests, setTests] = useState([]);
    const [currentTime, setCurrentTime] = useState(moment());
    const { user } = useAuth();

    const { isTestStarted } = useTime();

    const navigate = useNavigate();

    const fetchAllTests = async () => {

        if(!user){
            return;
        }

        try {

            const res = await fetch(`${BACKEND_URL}/api/v1/test/getSampleTest/${user.user.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            const data = await res.json();
            console.log('test', data);

            setTests(data.data);
        }
        catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchAllTests();
    }, [user, isTestStarted]);

    useEffect(() => {
        fetchAllTests();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(moment());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const getRemainingTime = (startTime: Date) => {
        const now = currentTime;
        const start = moment(startTime);
        const diff = moment.duration(start.diff(now));

        if (diff.asMilliseconds() < 0) {
            return "0d 0h 0m 0s";
        }

        const days = Math.floor(diff.asDays());
        const hours = diff.hours();
        const minutes = diff.minutes();
        const seconds = diff.seconds();

        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    const canStartTest = (startTime: Date, endTime: Date) => {
        const now = currentTime;
        return now.isSameOrAfter(startTime) && now.isBefore(endTime);
    };

    const handleStartTest = async (testId: string) => {

        navigate(`/user/startTest/${testId}`, { state: { studentId: user.user.id } });

    }

    return (
        <div className='min-h-screen bg-muted/40'>
            <Navbar />
            <div>
                <h2 className='text-center text-3xl font-bold mt-10'>Sample Tests</h2>
                <div style={{ padding: '2% 15%' }}>
                    {tests?.length > 0 ?
                    (
                    tests?.map((t: any, index) => (
                        <div className='mb-10'>
                            <Card key={t.test._id} className='rounded-md '>
                                <div style={{backgroundColor: "hsl(221.2 83.2% 53.3%)"}} className='rounded-md bg-card text-card-foreground shadow-sm'>
                                <CardHeader className='text-white'>
                                    <CardTitle>Test {index + 1}</CardTitle>
                                </CardHeader>
                                </div>
                                <CardContent className='mt-5'>
                                    <div className='flex'>
                                        <div>
                                            <h3>Test Name : {t.test?.test_name}</h3>
                                            <p>Start Time: {moment(t.test?.start_time).format('LLL')}</p>
                                            <p>End Time: {moment(t.test?.end_time).format('LLL')}</p>
                                            {/* {The below t.test.duration is in seconds convert it to hr min ss format} */}
                                            <p>Duration: {moment.duration(t.test.duration, "seconds").hours()} hrs {moment.duration(t.test.duration, "seconds").minutes()} min {moment.duration(t.test.duration, "seconds").seconds()} sec</p>
                                        </div>
                                        <div className='ml-auto mt-auto'>
                                            {t.response.given ? (
                                                <Button size="sm" onClick={() => navigate(`/user/viewScore/${t.test._id}`)}> View Score </Button>
                                            ) :
                                                (
                                                    t.response.isStarted ? (
                                                        <Button size="sm" onClick={() => navigate(`/user/test/${t.test._id}`)}>Continue Test</Button>
                                                    ) :
                                                        (
                                                            canStartTest(
                                                                (t.test?.start_time),
                                                                (t.test?.end_time)) ? (
                                                                <Button size="sm" onClick={() => handleStartTest(t.test._id)} disabled={isTestStarted}>Start Test</Button>
                                                            ) : (
                                                                <p>
                                                                    Test will start in {getRemainingTime(t.test?.start_time)}
                                                                </p>
                                                            )
                                                        )

                                                )
                                            }
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))
                    ) : (
                        <>
                            <h2 className='text-center text-2xl mt-10'>No Sample Tests Available</h2>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
