// TimeContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import moment from 'moment';
import { useAuth } from './AuthContext';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '@/config/config';

interface TimeContextType {
    timeLeft: string;
    startTime: Date | undefined;
    duration: number;
    setStartTime: (time: Date | undefined) => void;
    setDuration: (duration: number) => void;
    isTimeUp: boolean;
    setIsTimeUp: (time: boolean) => void;
    isTestStarted: boolean;
    setIsTestStarted: (time: boolean) => void;
    setTimeLeft: (time: string) => void;
    handleTestSubmit: (questions: any, testid: string) => void;
}

const TimeContext = createContext<TimeContextType | undefined>(undefined);

export const TimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [timeLeft, setTimeLeft] = useState<string>(() => localStorage.getItem('timeLeft') || '');
    const [startTime, setStartTime] = useState<Date | undefined>(() => {
        const savedStartTime = localStorage.getItem('startTime');
        return savedStartTime ? new Date(savedStartTime) : undefined;
    });
    const [duration, setDuration] = useState<number>(() => Number(localStorage.getItem('duration')) || 0);
    const [isTimeUp, setIsTimeUp] = useState<boolean>(() => localStorage.getItem('isTimeUp') === 'true');
    const [isTestStarted, setIsTestStarted] = useState<boolean>(() => localStorage.getItem('isTestStarted') === 'true');

    const { user } = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        if (startTime && duration) {
            const interval = setInterval(() => {
                const now = moment();
                const start = moment(startTime);
                const end = start.add(duration, 'seconds');
                const diff = moment.duration(end.diff(now));

                if (diff.asSeconds() <= 0) {
                    setTimeLeft('Time Up');
                    setIsTimeUp(true);
                    setIsTestStarted(false);
                    localStorage.setItem('timeLeft', 'Time Up');
                    localStorage.setItem('isTimeUp', 'true');
                    localStorage.setItem('isTestStarted', 'false');
                    clearInterval(interval);
                    return;
                }

                const days = Math.floor(diff.asDays());
                const hours = diff.hours();
                const minutes = diff.minutes();
                const seconds = diff.seconds();

                const newTimeLeft = `${days}d ${hours}h ${minutes}m ${seconds}s`;
                setTimeLeft(newTimeLeft);
                localStorage.setItem('timeLeft', newTimeLeft);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [startTime, duration]);

    const handleTestSubmit = async (questions: any, testid: string) => {

        const answersJson = localStorage.getItem('userAnswers');
        const answers: string[] = answersJson ? JSON.parse(answersJson) : [];
    
        console.log(answers)

        const questionArray = answers?.map((answer, index) => ({
            questionId: questions[index]._id,
            answer: answer,
        }));

        const requestBody = {
            student: user.user.id,
            testid,
            question_array: questionArray,
        };

        try {
            const response = await fetch(`${BACKEND_URL}/api/v1/test/calculate_score`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                const result = await response.json();
                toast({
                    title: 'Success',
                    description: "Your test is submitted successfully check your score in the view score section.",
                });

            } else {
                const errorResult = await response.json();
                toast({
                    title: 'Error',
                    description: errorResult.message,
                });
            }
        } catch (error) {
            console.error('Error calculating score:', error);
            toast({
                title: 'Error',
                description: 'An error occurred while calculating the score.',
            });
        }

    }

    const setStartTimeWrapper = (time: Date | undefined) => {
        setStartTime(time);
        if (time !== undefined)
            localStorage.setItem('startTime', time.toISOString());
    };

    const setDurationWrapper = (dur: number) => {
        setDuration(dur);
        localStorage.setItem('duration', dur.toString());
    };

    const setIsTimeUpWrapper = (val: boolean) => {
        setIsTimeUp(val);
        localStorage.setItem('isTimeUp', val.toString());
    };

    const setIsTestStartedWrapper = (val: boolean) => {
        setIsTestStarted(val);
        localStorage.setItem('isTestStarted', val.toString());
    };

    return (
        <TimeContext.Provider value={{
            timeLeft,
            startTime,
            duration,
            setStartTime: setStartTimeWrapper,
            setDuration: setDurationWrapper,
            isTimeUp,
            setIsTimeUp: setIsTimeUpWrapper,
            isTestStarted,
            setIsTestStarted: setIsTestStartedWrapper,
            setTimeLeft,
            handleTestSubmit,
        }}>
            {children}
        </TimeContext.Provider>
    );
};

export const useTime = () => {
    const context = useContext(TimeContext);
    if (context === undefined) {
        throw new Error('useTime must be used within a TimeProvider');
    }
    return context;
};