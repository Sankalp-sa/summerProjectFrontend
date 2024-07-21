import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/Context/AuthContext';
import { useParams } from 'react-router-dom';
import { BACKEND_URL } from '@/config/config';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useTime } from '@/Context/TimeContext';
import SideBar from '@/components/SideBar';


// Question schema
const questionSchema = z.object({
    _id: z.string(),
    question: z.string(),
    option1: z.string(),
    option2: z.string(),
    option3: z.string().optional(),
    option4: z.string().optional(),
    correctOption: z.number(),
});

// Define the type for question
type Question = z.infer<typeof questionSchema>;

const formSchema = z.object({
    answers: z.array(z.number()),
});

export default function Test() {
    const { user } = useAuth();
    const { id } = useParams<{ id: string }>();

    const navigate = useNavigate();

    const { timeLeft, isTimeUp, isTestStarted, startTime, setStartTime, setDuration, setIsTestStarted, setTimeLeft, setIsTimeUp } = useTime();

    const [questions, setQuestions] = useState<Question[]>([]);
    const [userAnswers, setUserAnswers] = useState<number[]>(JSON.parse(localStorage.getItem('userAnswers') || '[]'));
    const [currentPage, setCurrentPage] = useState(1);
    const [name, setName] = useState('');
    const [codingTestId, setCodingTestId] = useState<string>('');

    const questionsPerPage = 1;
    const paginationSize = 5;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            answers: userAnswers,
        },
    });

    const fetchQuestions = async () => {
        const res = await fetch(`${BACKEND_URL}/api/v1/test/getSingleTest/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        const data = await res.json();

        console.log(data);

        setName(data.data.test.test_name);
        setDuration(data.data.test.duration);
        setQuestions(data.data.Questions);
        setCodingTestId(data.data.test.Codingtest);
    };

    const getResponse = async () => {
        const res = await fetch(`${BACKEND_URL}/api/v1/test/getResponse?studentId=${user.user.id}&testId=${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        const data = await res.json();

        console.log(data.data);

        if (!localStorage.getItem('startTime')) {
            setStartTime(new Date(data.data[0].startTime));
            setIsTestStarted(true);
        }

    };

    useEffect(() => {
        fetchQuestions();
        if (user?.user?.id) {
            getResponse();
        }
    }, [user]);

    const handleTimpUp = async () => {

        if (timeLeft === 'Time Up') {
            await onSubmit(form.getValues());

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

    useEffect(() => {
        localStorage.setItem('userAnswers', JSON.stringify(userAnswers));
    }, [userAnswers]);

    async function onSubmit(data: z.infer<typeof formSchema>) {

        console.log(data);

        const questionArray = data.answers.map((answer, index) => ({
            questionId: questions[index]._id,
            answer: answer,
        }));

        const requestBody = {
            student: user.user.id,
            testid: id,
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

                navigate('/user/myTests');

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

    const handleClearAnswer = (index: number) => {
        const updatedAnswers = [...userAnswers];
        updatedAnswers[index] = 0;
        setUserAnswers(updatedAnswers);

        form.setValue('answers', updatedAnswers);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const totalPages = Math.ceil(questions.length / questionsPerPage);
    const totalPaginationPages = Math.ceil(totalPages / paginationSize);
    const currentPaginationPage = Math.ceil(currentPage / paginationSize);
    const startPage = (currentPaginationPage - 1) * paginationSize + 1;
    const endPage = Math.min(currentPaginationPage * paginationSize, totalPages);

    return (
        <>
            <div className="bg-muted/40 flex">
                <SideBar testid={id} codingTestId={codingTestId}/>
                <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
                    <div
                        className="relative hidden flex-col items-start gap-8 md:flex border border-1 border-inherit shadow-sm rounded-md bg-white" x-chunk="dashboard-03-chunk-0"
                    >
                        <div className="p-4">
                            <h1 className="text-3xl font-bold ps-3 pb-3">Questions</h1>
                            <div className="space-y-2">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) =>
                                    currentPage === page ? (
                                        <PaginationLink
                                            key={page}
                                            className="m-2 rounded-full bg-blue-500 text-white"
                                        >
                                            {page}
                                        </PaginationLink>
                                    ) : (
                                        <PaginationLink
                                            key={page}
                                            href="#"
                                            onClick={() => handlePageChange(page)}
                                            className="m-2 rounded-full bg-white border border-gray-300 hover:bg-gray-100 transition-colors duration-200"
                                        >
                                            {page}
                                        </PaginationLink>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="relative flex h-full min-h-[50vh] flex-col rounded-md bg-muted/50 p-4 lg:col-span-2 border border-1 border-inherit shadow-sm">
                        <div className="flex justify-between items-center">
                            <h1 className="text-3xl font-bold mb-6">Test : {name}</h1>
                            <div className="ml-auto">
                                <Button className='me-5' variant="outline" onClick={() => navigate(`/user/startTest/${id}`, { state: {studentId : user?.user?.id} })}>See Instructions</Button>
                                <Button onClick={() => navigate(`/user/viewCodingQuestions/${codingTestId}/${id}`)}>Go to Coding Test</Button>
                            </div>
                        </div>

                        <p className='mb-3 font-semibold'> Time Left: <span style={{ color: "#2563EB" }}>{timeLeft}</span></p>
                        <Form {...form}>
                            <form
                                className="w-full min-h-[70vh] bg-white p-6 rounded-md flex flex-col justify-between border border-1 border-inherit shadow-sm"
                            >
                                <div>
                                    {questions.map((question, index) =>
                                        index >= (currentPage - 1) * questionsPerPage &&
                                        index < currentPage * questionsPerPage && (
                                            <FormField
                                                key={index}
                                                control={form.control}
                                                name={`answers.${index}`}
                                                render={({ field }) => (
                                                    <FormItem className="space-y-3">
                                                        <div className="flex justify-between items-center">
                                                            <FormLabel className="text-lg font-medium">
                                                                {question.question}
                                                            </FormLabel>
                                                            <button
                                                                type="button"
                                                                className="text-blue-500 underline"
                                                                onClick={() => handleClearAnswer(index)}
                                                            >
                                                                Clear
                                                            </button>
                                                        </div>
                                                        <FormControl>
                                                            <RadioGroup
                                                                onValueChange={(value) => {
                                                                    field.onChange(Number(value));
                                                                    const updatedAnswers = [...userAnswers];
                                                                    updatedAnswers[index] = Number(value);
                                                                    setUserAnswers(updatedAnswers);
                                                                }}
                                                                value={field.value?.toString()}
                                                                className="flex flex-col space-y-1"
                                                            >
                                                                {['option1', 'option2', 'option3', 'option4'].map(
                                                                    (option, idx) =>
                                                                        question[option as keyof Question] && (
                                                                            <FormItem
                                                                                key={idx}
                                                                                className="flex items-center space-x-3 space-y-0"
                                                                            >
                                                                                <FormControl>
                                                                                    <RadioGroupItem
                                                                                        value={(idx + 1).toString()}
                                                                                    />
                                                                                </FormControl>
                                                                                <FormLabel className="font-normal">
                                                                                    {question[option as keyof Question]}
                                                                                </FormLabel>
                                                                            </FormItem>
                                                                        )
                                                                )}
                                                            </RadioGroup>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        )
                                    )}
                                </div>
                                <div className="mt-8 flex justify-between">
                                    <Pagination>
                                        <PaginationContent className="flex items-center">
                                            <PaginationItem className='border-solid border-2 border-grey rounded-md'>
                                                {currentPage !== 1 && (
                                                    <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
                                                )}
                                            </PaginationItem>
                                            <PaginationItem className='border-solid border-2 border-grey rounded-md'>
                                                {currentPage !== totalPages && (
                                                    <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
                                                )}
                                            </PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
                                </div>
                            </form>
                        </Form>
                    </div>

                </main>

            </div>
        </>
    );
}
