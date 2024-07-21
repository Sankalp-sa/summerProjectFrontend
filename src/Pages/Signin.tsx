import React, { useEffect } from 'react'

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod'
import Heading from '@/components/Heading'
import { BACKEND_URL } from '@/config/config'
import { Link } from "react-router-dom"
import Navbar from '@/components/Navbar'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/Context/AuthContext'
import { useSocket } from '@/Context/SocketContext'

const formSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

export default function Signin() {

  const { login } = useAuth()

  // const { socket } = useSocket()
  const { socket } = useSocket()

  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {

    console.log(values)

    const userData = {
      email: values.email,
      password: values.password
    }

    //send token to backend

    const res = await fetch(`${BACKEND_URL}/api/v1/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(userData)
    })

    const data = await res.json()

    console.log(data)

    if (data.ok) {

      // make user joinRoom using socke

      if (socket !== null){
        socket.emit("joinRoom", data.id)
      }
      
      login()
      navigate("/")
    }
    else {
      console.log(data)
    }

  }

  useEffect(() => {

    console.log(socket)

  }, [socket])

  return (
    <>
      <Navbar />
      <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <div className='flex items-center justify-center py-12 flex-col'>
          <Heading text={"Log In"} />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md w-full flex flex-col">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" type='email' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Password" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Login</Button>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="underline">
                  Sign up
                </Link>
              </div>
            </form>
          </Form>
        </div>
        <div className="hidden bg-muted lg:block min-h-screen">
          <img src="https://images.pexels.com/photos/80453/poppy-field-of-poppies-flower-flowers-80453.jpeg?cs=srgb&dl=pexels-pixabay-80453.jpg&fm=jpg" alt="Signup" className="object-cover h-full w-full" />
        </div>
      </div>
    </>
  )
}
