import Navbar from "@/components/Navbar"
import SideBar from "@/components/SideBar";
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
import { toast } from "@/components/ui/use-toast";
import { BACKEND_URL } from "@/config/config";
import { useTime } from "@/Context/TimeContext";
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";

export function ViewCodingQuestions() {

  const { id, testid } = useParams();

  const { timeLeft, isTestStarted, handleTestSubmit, setTimeLeft, setDuration, setIsTestStarted } = useTime();

  const [questions, setQuestion] = useState<any[]>();

  const [codingTestId, setCodingTestId] = useState<string | undefined>();

  const [mcqs, setMcqs] = useState<any[]>();

  const navigate = useNavigate();

  const getQuestions = async () => {

    const res = await fetch(`${BACKEND_URL}/api/v1/codingQuestion/get/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    console.log(data)

    if (res.status === 200) {
      setQuestion(data.data);
    } else {
      console.log(data.message);
    }

  }

  useEffect(() => {

    getQuestions();

  }, []);

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

    setMcqs(data.data.Questions);
  };

  useEffect(() => {

    fetchQuestions();

  }, [])

  const handleTimpUp = async () => {

    if (timeLeft === 'Time Up') {

      if (testid) {
        handleTestSubmit(mcqs, testid);
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
    <div className="flex">
      <SideBar testid={testid} codingTestId={codingTestId}/>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 h-screen mx-12 my-6" style={{ padding: "2% 17%" }}>
          <div className="flex items-center gap-4">
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              Coding Questions
            </h1>
            <p className='font-semibold ml-auto'> Time Left : <span style={{ color: "#2563EB" }}>{timeLeft}</span></p>
          </div>
          <div className="rounded-lg border border-1 border-inherit shadow-sm bg-white" x-chunk="dashboard-02-chunk-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">No.</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="text-right">Difficulty</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questions && questions.map((question: any, index: number) => (
                  <TableRow key={question._id} onClick={() => navigate(`/user/codingQuestion/${question._id}/${id}/${testid}`)} className="hover:cursor-pointer">
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{question.status ? question.status : "Not Mentioned"}</TableCell>
                    <TableCell>{question.title}</TableCell>
                    <TableCell className="text-right">{question.difficulty ? question.difficulty : "Not Mentioned"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
    </div>
  )
}
