import Chat  from "./Chat"
import { Link } from "react-router-dom"
export default function Home(){
    return( <>
    <Chat /> 
   <Link to="/login">Login page</Link>
   console.log(userId)
    </>)
   
    
}