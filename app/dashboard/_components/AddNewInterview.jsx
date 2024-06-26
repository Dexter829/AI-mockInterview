"use client"
import React, { useState } from 'react' 
import { Button } from '@/components/ui/button'



import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { chatSession } from '@/utils/GeminiAiModal'
import { LoaderCircle } from 'lucide-react'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs'
import moment from 'moment'
import { useRouter } from 'next/navigation'


function AddNewInterview() {
    const [openDailog,setOpenDailog]=useState(false);
    const [jobPosition,setjobPosition]=useState();
    const [jobDesc,setjobDesc]=useState();
    const [jobExperiece,setjobExperiece]=useState();
    const [loading,setloading]=useState(false);
    const [JsonResponse,setJsonResponse] =useState([]);
    const router=useRouter();
    const {user}=useUser();

    const onSubmit=async(e)=>{
        setloading(true)
        e.preventDefault()
        console.log(jobPosition,jobDesc,jobExperiece)

        const InputPromt="Job position: "+jobPosition+",Job Description : "+jobDesc+",Year of Experience : "+jobExperiece+",depending on this information please give me"+process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT+" interview questiosn along with answers in JSON format, Give us question and answer field on JSON " 

        const result = await chatSession.sendMessage(InputPromt);
        const MockJsonResp=(result.response.text()).replace('```json','').replace('```','')
        // console.log(JSON.parse(MockJsonResp));
        setJsonResponse(MockJsonResp);
        

        if(MockJsonResp){
        const resp=await db.insert(MockInterview)
        .values({
            mockId:uuidv4(),
            jsonMockResp:MockJsonResp,
            jobPosition:jobPosition,
            jobDesc:jobDesc,
            jobExperiece:jobExperiece,
            createdBy:user?.primaryEmailAddress?.emailAddress,
            createdAt:moment().format('DD-MM_YYYY')
            

        }).returning({mockId:MockInterview.mockId})

        console.log("Inserted ID:",resp)
        if(resp)
            {
                setOpenDailog(false);
                router.push('/dashboard/interview/'+resp[0]?.mockId)
            }

    }
    else{
        console.log("ERROR"); 
    }
        setloading(false)
    }

    return (
        <div >
            <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'
            onClick={()=>setOpenDailog(true)}
            >
                <h2 className='text-lg text-center'>+ Add New</h2>
            </div>
            <Dialog open={openDailog}>
               
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className='text-2xl'>Tell us more about the upcoming job interview...</DialogTitle>
                        <DialogDescription>
                            <form onSubmit={onSubmit}>
                           <div>
                            <h2>Add Details about your job position/role Job description and years of experience </h2>
                            <div className='mt-7 my-3'>
                                <label>Job Role/Job Position</label>
                                <Input placeholder="Ex. Full Stack Developer" required 
                                onChange={(event)=>setjobPosition(event.target.value)}
                                />
                            </div>
                            <div className='mt-7 my-3'>
                                <label>Job Description / Tech Stack (In Short!) </label>
                                <Textarea placeholder="Ex. React , Angular , MySql , NodeJs etc"  required
                                onChange={(event)=>setjobDesc(event.target.value)}
                                />
                            </div>
                            <div className='mt-7 my-3'>
                                <label>Years of experience</label>
                                <Input placeholder="Ex. 0-5 years" type="number" max="50" required 
                                onChange={(event)=>setjobExperiece(event.target.value)}
                                />
                            </div>
                           </div>
                            <div className='flex gap-5 justify-end'>
                               <Button type='button' variant="ghost" onClick={()=>setOpenDailog(false)}>Cancel</Button>            
                               <Button type='submit'disabled={loading}>
                                {loading?
                                <>
                                <LoaderCircle className='animate-spin'/>Generating from AI
                                </>:'Start Interview'
                                
                            }
                                
                            </Button>            
                            </div>
                            </form>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default AddNewInterview
