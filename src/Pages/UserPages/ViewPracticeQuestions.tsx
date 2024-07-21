import Navbar from "@/components/Navbar"
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { BACKEND_URL } from "@/config/config";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

export function ViewPracticeQuestions() {

  const [questions, setQuestion] = useState<any[]>();

  const navigate = useNavigate();

  const getQuestions = async () => {

    const res = await fetch(`${BACKEND_URL}/api/v1/codingQuestion/getPracticeQuestions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
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

  return (
    <div className="flex">
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <Navbar />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 h-screen mx-12 my-6" style={{ padding: "2% 17%" }}>
          <div className="flex items-center gap-4">
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              Coding Questions
            </h1>
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
                  <TableRow key={question._id} onClick={() => navigate(`/user/practiceCodingQuestion/${question._id}`)} className="hover:cursor-pointer">
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Badge className={
                        question.practiceStatus === "not attempted" ? "bg-gray-400" :
                          question.practiceStatus === "solved" ? "bg-green-400" :
                            question.practiceStatus === "incomplete" ? "bg-yellow-400" : "bg-gray-400"
                      }>
                        {question.practiceStatus === "not attempted" ? "Not Solved" : "Solved"}
                      </Badge>
                    </TableCell>
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
