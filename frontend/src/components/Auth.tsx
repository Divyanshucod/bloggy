import { Link, useNavigate } from "react-router-dom"
import { LabelledInput } from "./LabelledInput"
import { useState } from "react"
import type { SignInType, SignUpType } from "@dev0000007/medium-web"
import { Button } from "./Button"
import { toast } from "react-toastify"
import axios from "axios"
export const Auth = ({type}:{type:'signup' | 'signin'})=>{
    const navigate = useNavigate()
    const [signUpDetails,setSignUpDetails] = useState<SignUpType>({email:"",password:"",name:""})
    const [signInDetails,setSignInDetails] = useState<SignInType>({email:"",password:""})
    const [disableButton,setDisableButton] = useState(false)
    async function  handleSignUp() {
        console.log('hi');
        
        setDisableButton(true)
        try {
            const response = await axios.post('',signUpDetails)
            localStorage.set('token',response.data.token)
            navigate('/blog')
        } catch (error:any) {
            toast.error(error.response.data.message)
        }
        setDisableButton(false)
    }

    async function  handleSignIn() {
        setDisableButton(true)
        try {
            const response = await axios.post('',signInDetails)
            localStorage.set('token',response.data.token)
            navigate('/blog')
        } catch (error:any) {
            toast.error(error.response.data.message)
        }
        setDisableButton(false)
    }
    return <div className="h-screen w-screen sm:p-30 md:p-40 lg:p-10 lg:w-auto flex flex-col items-center justify-center">
           <div className="border border-slate-400 shadow-xl w-[70%] p-5 sm:p-10 rounded-xl">
           <div>
            <div className="text-2xl font-bold">
                 {type == 'signup' ? 'Create an account':'Welcome back'}
             </div>
             <div>
                {type =='signup' ? <p className="text-gray-500">Already have an account <Link className="underline"to="/signin">login</Link></p> : <p>Create a new account? <Link className="underline" to="/signup">signup</Link></p>}
             </div>
            </div>
            <div className="mt-2.5 w-full">
            {type == 'signup' ? <div>
                <LabelledInput label="Username" type="text" onChange={e => setSignUpDetails(prev => ({...prev,name:e.target.value}))} placeholder="Divyanshu Prajapati.."/>
                <LabelledInput label="Email" type="text" onChange={e => setSignUpDetails(prev => ({...prev,email:e.target.value}))} placeholder="dev123@gmail.com.."/>
                <LabelledInput label="Password" type="password" onChange={e => setSignUpDetails(prev => ({...prev,password:e.target.value}))} placeholder="123456"/>
            </div> : <div>
                <LabelledInput label="Email" type="text" onChange={e => setSignInDetails(prev => ({...prev,email:e.target.value}))} placeholder="dev123@gmail.com.."/>
                <LabelledInput label="Password" type="password" onChange={e => setSignInDetails(prev => ({...prev,password:e.target.value}))} placeholder="123456"/>
            </div> }
            </div>
            <div className="mt-3 flex w-full items-center justify-center">
           {type == 'signup' ? <Button disableButton={disableButton} onClick={handleSignUp}>Sign up</Button> : <Button disableButton={disableButton} onClick={handleSignIn}>Sign in</Button> }
           </div>
           </div>
    </div>
}