"use client"
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm'
import { Lightbulb, WebcamIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function Interview({ params }) {
  const [InterviewData, setInterviewData] = useState();
  const [webCamEnabled, setwebCamEnabled] = useState(false);

  useEffect(() => {
    console.log(params.interviewId)
    GetInterviewDetails();
  }, [])
  /**
   * Used for getting the interview details by MockId/Interview Id
   * 
   */
  const GetInterviewDetails = async () => {
    const result = await db.select().from(MockInterview)
      .where(eq(MockInterview.mockId, params.interviewId))

    setInterviewData(result[0])
  }
  return (
    <div className='my-10'>
      <h2 className='font-bold text-2xl'>Let's Get Started</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10 my-5'>
        <div className='flex flex-col my-5 gap-5'>
          <div className='flex flex-col p-5 rounded-lg border gap-5'>
            <h2 className='text-lg'><strong>Job Role/Job Posotion:</strong>{InterviewData && InterviewData.jobPosition}</h2>
            <h2 className='text-lg'><strong>Job Description/Tech Stack:</strong>{InterviewData && InterviewData.jobDesc}</h2>
            <h2 className='text-lg'><strong>Years of Experience:</strong>{InterviewData && InterviewData.jobExperiece}</h2>
          </div>
          <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-200'>
            <h2 className='flex gap-2 items-center text-yellow-500'><Lightbulb/><strong>Information :-</strong></h2>
            <h2 className='mt-3 text-yellow-600'>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
          </div>
        </div>
        <div>
          {webCamEnabled ? <Webcam
            onUserMedia={() => setwebCamEnabled(true)}
            onUserMediaError={() => setwebCamEnabled(false)}
            mirrored={true}
            style={{
              height: 300,
              width: 300
            }}
          />
            :
            <>
              <WebcamIcon className="h-72 w-full my-7 p-20 bg-secondary rounded-lg border" />
              <Button variant='ghost' className='w-full ' onClick={() => setwebCamEnabled(true)}>To Enable webcam and microphone <br />Click Here !</Button>
            </>
          }
        </div>
      </div>
          <Link href={'/dashboard/interview/'+params.interviewId+'/start'}>
          <Button className=''>Start Interview</Button>
          </Link>
    </div>
  )
}

export default Interview
