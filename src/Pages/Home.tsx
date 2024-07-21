import Navbar from '@/components/Navbar'
import { useAuth } from '@/Context/AuthContext';
import { useSocket } from '@/Context/SocketContext';
import React, { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, CheckSquare, Clock, Users } from "lucide-react"
import { useNavigate } from 'react-router-dom';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function Home() {

  const { socket } = useSocket()

  const { user } = useAuth()

  const navigate = useNavigate();

  function receiveNotification(data: string) {
    console.log(data);
  }

  function pendingnoti(data: string) {
    console.log(data);
  }


  useEffect(() => {

    console.log('Socket connected:', socket);

    socket?.on("receiveNotification", receiveNotification);
    socket?.on("Pending_applicatio_Notification", pendingnoti);
    // socket?.on("pending_application_noti",pendin)

    // get the notification of the room
    socket?.emit(user?.user.id, (data: any) => {
      console.log("Room data: " + data);
    });

    return () => {
      socket?.off("receiveNotification");

    };

  }, [socket])

  return (
    <>
      <Navbar />
      <div className="min-h-screen from-blue-100 to-white" >
        {/* Hero Section */}
        <div className='bg-gradient-to-b'>
          <section className="container mx-auto px-4 py-20 text-center min-h-screen flex flex-col justify-center items-center">
            <div className='mb-12'>
              <h1 className="text-5xl font-bold mb-8 playwrite-hr-font1">Test Management System</h1>
              <p className="text-xl mb-8 playwrite-hr-font2">Streamline your testing process with our comprehensive solution</p>
              <div>
                <Button size="lg" variant="outline" className="mr-4">Get Started</Button>
                <Button size="lg" variant="outline" >Learn More</Button>
              </div>
            </div>
          </section>
        </div>
        <hr className='border-t-2 border-gray-200' />
        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<BookOpen className="h-10 w-10 text-blue-500" />}
              title="Diverse Question Types"
              description="Support for multiple choice, coding, and essay questions"
            />
            <FeatureCard
              icon={<Clock className="h-10 w-10 text-blue-500" />}
              title="Timed Tests"
              description="Set time limits for tests to simulate exam conditions"
            />
            <FeatureCard
              icon={<CheckSquare className="h-10 w-10 text-blue-500" />}
              title="Automated Grading"
              description="Instant results for objective questions and coding tests"
            />
            <FeatureCard
              icon={<Users className="h-10 w-10 text-blue-500" />}
              title="User Management"
              description="Easily manage students, teachers, and administrators"
            />
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-blue-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="mb-8">Join thousands of institutions already using our platform</p>
            <Button size="lg" variant="secondary" onClick={() => navigate("/signup")}>Sign Up Now</Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-100 py-8">
          <div className="container mx-auto px-4 text-center text-gray-600">
            <p>&copy; 2024 Test Management System. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  )
}


function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className='text-center'>
      <Card>
        <CardHeader>
          <div className="flex justify-center mb-4">{icon}</div>
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>{description}</CardDescription>
        </CardContent>
      </Card>
    </div>
  )
}
