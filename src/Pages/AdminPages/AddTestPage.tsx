import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from "@/lib/utils";
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { TimePickerDemo } from '@/utils/time-picker-demo'
import { add, format } from "date-fns";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { BACKEND_URL } from '@/config/config'
import Navbar from '@/components/Navbar'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'
import { toast } from '@/components/ui/use-toast'

export default function AddTestPage() {

    const [date, setDate] = React.useState<Date>();
    const [edate, setEdate] = React.useState<Date>();
    const [duration, setDuration] = React.useState<Date>();
    const [name, setName] = React.useState<string>();

    const [selectedCodingTest, setSelectedCodingTest] = React.useState<string>("");

    const [codingTests, setCodingTests] = React.useState([])

    const navigate = useNavigate();

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

    const convertDateToSeconds = (date:
        Date | undefined
    ) => {
        if (!date) return 0;

        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        return hours * 3600 + minutes * 60 + seconds;
    };

    const handleSubmit = async (e:
        React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        try {

            const userData = {
                name: name,
                start_time: date,
                end_time: edate,
                duration: convertDateToSeconds(duration),
                Codingtest: selectedCodingTest
            }

            const res = await fetch(`${BACKEND_URL}/api/v1/test/createTest`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(userData),
            })

            const data = await res.json()

            console.log(data)

            navigate('/admin/createTest');

            toast({
                title: "Test Created Successfully",
                description: "Test has been created successfully",
            })

        }
        catch (err) {
            console.log(err)
        }

    }

    const getCodingTests = async () => {

        const res = await fetch(`${BACKEND_URL}/api/v1/codingTest/getcodingtest`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await res.json();

        console.log(data)

        if (res.status === 200) {
            setCodingTests(data.codingtest);
        } else {
            console.log(data.message);
        }
    }

    React.useEffect(() => {
        getCodingTests();
    }, [])

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <Navbar />
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8 m-12" style={{ padding: "1% 13%" }}>
                <Card x-chunk="dashboard-07-chunk-0">
                    <CardHeader className="flex flex-col">
                        <p className="text-3xl font-bold"> Add Test </p>
                        <CardDescription>
                            Add a new test by filling the below details.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col">
                        <form className="grid gap-4" onSubmit={handleSubmit}>
                            <div className="grid gap-2">
                                <Label htmlFor="name">
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
                            <div className="grid gap-2">
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
                                            <TimePickerDemo setDate={setDate
                                            } date={date} />
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="grid gap-2">
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
                                            <TimePickerDemo setDate={setEdate} date={edate} />
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="username" className='mb-2'>
                                    Duration
                                </Label>
                                <TimePickerDemo setDate={setDuration} date={duration} />
                            </div>
                            <div className='grid gap-2'>
                                <Label htmlFor="coding-test">
                                    Coding Test
                                </Label>
                                <Select defaultValue={selectedCodingTest} onValueChange={(value) => setSelectedCodingTest(value)}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select a Test" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Tests</SelectLabel>
                                            {codingTests.map((test: any) => (
                                                <SelectItem key={test._id} value={test._id}>
                                                    {test.Test_name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className='text-right'>
                                <Button type="submit">
                                    Add Test
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
