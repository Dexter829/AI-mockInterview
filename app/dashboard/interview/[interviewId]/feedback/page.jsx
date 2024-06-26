"use client"
import { UserAnswer } from '@/utils/schema'
import React, { useEffect, useState } from 'react';
import { db } from '@/utils/db'
import { eq } from 'drizzle-orm';
import { Button } from '@/components/ui/button';


import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronsUpDownIcon } from 'lucide-react';
import { useRouter } from 'next/navigation'

function Feeback({ params }) {

    const [feedbackList, setFeedbackList] = useState([]);
    const router = useRouter();
    useEffect(() => {
        GetFeedback();
    }, [])

const totalRating = feedbackList.reduce((acc, item) => acc + parseInt(item.rating, 10), 0);
const maxPossibleRating = feedbackList.length * 5; // Assuming 5 is the maximum rating possible for a single question

    const GetFeedback = async () => {
        const result = await db.select()
            .from(UserAnswer)
            .where(eq(UserAnswer.mockIdRef, params.interviewId))
            .orderBy(UserAnswer.id);

        console.log(result);
        setFeedbackList(result);
    }

    return (
        <div className='p-10'>


            {feedbackList?.length == 0 ?
                <h2 className='font-bold text-xl text-gray-600 mb-10'>No Interview Feedback Record Found ☹️</h2>
                :
                <>
                    <h2 className='text-3xl font-bold text-green-500'>Congartulations!!!</h2>
                    <h2 className='font-bold text-2xl'>Here is your interview feedback</h2>
                    <h2 className='text-primary text-lg my-3'>Your total interview rating: <strong>{totalRating}/{maxPossibleRating}</strong></h2>
                    <h2 className='text-sm text-gray-500'>Find below interview question with correct answer, Your answer and feedback for improvement</h2>

                    {feedbackList && feedbackList.map((item, index) => (
                        <Collapsible key={index} className='mt-7'>
                            <CollapsibleTrigger className='p-2 bg-secondary rounded-lg flex justify-between my-2 text-left gap-7 w-full'>
                                {item.question}<ChevronsUpDownIcon className='h-5 w-5' />
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <div className='flex flex-col gap-2'>
                                    <h2 className='text-red-500 p-2 border rounded-lg'><strong>Ratings:</strong>{item.rating}</h2>
                                    <h2 className='p-2 border rounded-lg bg-red-50 text-sm text-red-900'><strong>Your Answer: </strong>{item.userAns}</h2>
                                    <h2 className='p-2 border rounded-lg bg-green-50 text-sm text-green-900'><strong>Correct Answer: </strong>{item.correctAns}</h2>
                                    <h2 className='p-2 border rounded-lg bg-blue-50 text-sm text-primary'><strong>Feedback: </strong>{item.feedback}</h2>

                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    ))}
                </>}
            <Button onClick={() => router.replace('/dashboard')}>Go Home</Button>
        </div>
    )
}

export default Feeback
