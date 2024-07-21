import './App.css'
import { Route, Routes } from "react-router-dom"
import Signup from "./Pages/Signup"
import Signin from "./Pages/Signin"
import Application from './Pages/Application'
import AdminRoute from './Routes/AdminRoute'
import CreateTest from './Pages/AdminPages/CreateTest'
import EditTest from './Pages/AdminPages/EditTest'
import EditResponse from './Pages/UserPages/EditResponse'
import UserRoute from './Routes/UserRoute'
import Test from './Pages/UserPages/Test'
import { Toaster } from './components/ui/toaster'
import ViewApplicants from './Pages/AdminPages/ViewApplicants'
import ViewTests from './Pages/UserPages/ViewTests'
import ViewScore from './Pages/UserPages/ViewScore'
import StartTestPage from './Pages/UserPages/StartTestPage'
import { ViewCodingQuestions } from './Pages/UserPages/ViewCodingQuestions'
import CodingQuestion from './Pages/UserPages/CodingQuestion'
import CreateCodingTest from './Pages/AdminPages/CreateCodingTest'
import CreateCodingQuestion from './Pages/AdminPages/CreateCodingQuestion'
import AddTestPage from './Pages/AdminPages/AddTestPage'
import SubmitTestPage from './Pages/UserPages/SubmitTestPage'
import Home from './Pages/Home'
import ViewSampleTests from './Pages/UserPages/ViewSampleTest'
import { ViewPracticeQuestions } from './Pages/UserPages/ViewPracticeQuestions'
import PracticeCodingQuestion from './Pages/UserPages/PracticeCodingQuestion'

function App() {

  return (
    <>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/" element={<Home />} />
        <Route path="/application" element={<Application />} />
        <Route path="/admin" element={<AdminRoute />}>
          <Route path="createTest" element={<CreateTest />} />
          <Route path="addTest" element={<AddTestPage />} />
          <Route path="editTest/:id" element={<EditTest />} />
          <Route path="viewApplicants" element={<ViewApplicants />} />
          <Route path="createCodingTest" element={<CreateCodingTest />} />
          <Route path="createCodingQuestion/:id" element={<CreateCodingQuestion />} />
        </Route>
        <Route path="/user" element={<UserRoute />}>
          <Route path="editResponse" element={<EditResponse />} />
          <Route path="myTests" element={<ViewTests />} />
          <Route path="test/:id" element={<Test />} />
          <Route path="viewScore/:id" element={<ViewScore />} />
          <Route path="startTest/:id" element={<StartTestPage />} />
          <Route path="viewCodingQuestions/:id/:testid" element={<ViewCodingQuestions />} />
          <Route path="codingQuestion/:id/:codingTestId/:testid" element={<CodingQuestion />} />
          <Route path="submitTest/:testid" element={<SubmitTestPage />} />
          <Route path="sampleTests" element={<ViewSampleTests />} />
          <Route path="practice" element={<ViewPracticeQuestions />} />
          <Route path="practiceCodingQuestion/:id" element={<PracticeCodingQuestion />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  )
}

export default App
