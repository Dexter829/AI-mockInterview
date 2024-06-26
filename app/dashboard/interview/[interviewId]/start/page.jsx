"use client"
import React, { useEffect, useState } from 'react';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm'
import QuestionSection from './_components/QuestionSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function StartInterview({ params }) {

    const [interviewData, setinterviewData] = useState();
    const [mockInterciewQuestion, setmockInterciewQuestion] = useState();
    const [activeQuestionIndex, setactiveQuestionIndex] = useState(0);

    useEffect(() => {
        GetInterviewDetails();
    }, []);

    /**
     * Used for getting the interview details by MockId/Interview Id
     * 
     */
    const GetInterviewDetails = async () => {
        const result = await db.select().from(MockInterview)
            .where(eq(MockInterview.mockId, params.interviewId))
        const jsonMockResp = JSON.parse(result[0].jsonMockResp)
        console.log(jsonMockResp)
        setmockInterciewQuestion(jsonMockResp);
        setinterviewData(result[0]);
    }


    return (
        <div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                {/* Questions */}
                <QuestionSection
                    mockInterciewQuestion={mockInterciewQuestion}
                    activeQuestionIndex={activeQuestionIndex}


                />

                {/* Video / Audio Recording */}

                <RecordAnswerSection
                    mockInterciewQuestion={mockInterciewQuestion}
                    activeQuestionIndex={activeQuestionIndex}
                    interviewData={interviewData}
                />
            </div>
            <div className='flex gap-6 ml-5'>
                {activeQuestionIndex > 0 &&
                    <Button onClick={() => setactiveQuestionIndex(activeQuestionIndex - 1)}>Previous </Button>}
                {activeQuestionIndex != mockInterciewQuestion?.length - 1 &&
                    <Button onClick={() => setactiveQuestionIndex(activeQuestionIndex + 1)}>Next Question</Button>}
                {activeQuestionIndex == mockInterciewQuestion?.length - 1 &&
                    <Link href={'/dashboard/interview/'+interviewData?.mockId+'/feedback'}>
                    <Button>End </Button>
                    </Link>}
            </div>
        </div >
    )
}

export default StartInterview
