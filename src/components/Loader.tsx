import { Link } from "react-router-dom";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";

export default function Loader() {
    return (
        <div className='min-h-screen 
    flex flex-col items-center justify-center 
    '>
            <ClimbingBoxLoader
                color='#2563EB'
                size={30}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
            <p className="mt-12 text-gray-500">
                If you are seeing the loader forever that means either you haven't sigin or your internet is slow
            </p>
            <Link to="/signin" className="text-blue-500 hover:underline">Go to Signin</Link>
        </div>
    )
}
