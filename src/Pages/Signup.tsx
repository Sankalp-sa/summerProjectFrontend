import React from 'react'

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"


const formSchema = z.object({
  email: z.string().email(),
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(6, {
    message: "Username must be at least 6 characters long"
  }),
  confirmPassword: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  gender: z.enum(["male", "female", "other"]), // Assuming gender is a string and can be one of these values
  dob: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date of birth",
  }), // Assuming dob is a string in a valid date format
  father: z.string(),
  mother: z.string(),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 characters long",
  }), // Assuming phone is a string of at least 10 characters
  Alt_phone: z.string().min(10, {
    message: "Alternate phone number must be at least 10 characters long",
  }), // Assuming Alt_phone is an optional string of at least 10 characters
  address: z.string(),
  // role: z.string(),
}).refine((data) => {
  return data.password === data.confirmPassword
}, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
})

export default function Signup() {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {

    console.log(values)

    const userData = {
      username: values.username,
      name: values.firstName + " " + values.lastName,
      email: values.email,
      password: values.password,
      gender: values.gender,
      dob: values.dob,
      phone: values.phone,
      Alt_phone: values.Alt_phone,
      address: values.address,
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/user/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    const data = await res.json()

    console.log(data)

  }

  return (
    <>
      <Navbar />
      <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <div className='flex items-center justify-center flex-col'>
          <Heading text={"Sign Up"} />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md w-full flex flex-col">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Username" type="text" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
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
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Confirm Password" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <div className='grid grid-rows-1 grid-flow-col gap-4'>
                <div>
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="First Name" type='text' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Last Name" type='text' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className='grid grid-rows-1 grid-flow-col gap-4'>
                <div>
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Your Gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input type='date' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className='grid grid-rows-1 grid-flow-col gap-4'>
                <div>
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="Phone" type='text' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="Alt_phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alternate Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="Alternate Phone" type='text' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder='Address' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" onClick={() => onSubmit(form.getValues())}>Submit</Button>
              <div className="mt-4 text-center text-sm pb-12">
                Already have an account?{" "}
                <Link to="/signin" className="underline">
                  Sign in
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
