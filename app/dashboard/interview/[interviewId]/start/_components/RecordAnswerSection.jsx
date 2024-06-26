"use client"
import Webcam from 'react-webcam';
import React, { useEffect, useState } from 'react';
import Image from 'next/image'
import { Button } from '@/components/ui/button';
import useSpeechToText from 'react-hook-speech-to-text';
import { Circle, CircleStopIcon, Mic } from 'lucide-react';
import { toast } from 'sonner';
import { chatSession } from '@/utils/GeminiAiModal';
import { db } from '@/utils/db';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { UserAnswer } from '@/utils/schema';


function RecordAnswerSection({ mockInterciewQuestion, activeQuestionIndex, interviewData }) {
    const [userAnswer, setUserAnswer] = useState('');
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const {
        error,
        interimResult,
        isRecording,
        results,
        setResults,
        startSpeechToText,
        stopSpeechToText,
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
    });

    useEffect(() => {
        results.map((result) => (
            setUserAnswer(prevAns => prevAns + result?.transcript)
        ))
    }, [results])

    useEffect(() => {

        if (!isRecording && userAnswer.length > 10) {
            UpdateUserAnswer();
        }

        // if (userAnswer?.length < 10) {
        //     setLoading(false);
        //     toast("Error while saving your answer,Please Record again")
        // }
    }, [userAnswer])

    const StartStopRecoridng = async () => {
        if (isRecording) {
            stopSpeechToText()
        }
        else {
            startSpeechToText()
        }
    }

    const UpdateUserAnswer = async () => {
        console.log(userAnswer)
        setLoading(true)
        const feedbackPrompt = "Question :" + mockInterciewQuestion[activeQuestionIndex]?.question +
            ", User Answer:" + userAnswer + ", Depends on question and user answer for interview question " + "please give us rating for answer and feedback as areaa of improvement if any" + "in just 3 to 5 lines to impove it in JSON format with rating field and feedback field"

        const result = await chatSession.sendMessage(feedbackPrompt);

        const mockJsonResp = (result.response.text()).replace('```json', '').replace('```', '');
        const JsonFeedbackResp = JSON.parse(mockJsonResp);

        const resp = await db.insert(UserAnswer)
            .values({
                mockIdRef: interviewData?.mockId,
                question: mockInterciewQuestion[activeQuestionIndex]?.question,
                correctAns: mockInterciewQuestion[activeQuestionIndex]?.answer,
                userAns: userAnswer,
                feedback: JsonFeedbackResp?.feedback,
                rating: JsonFeedbackResp?.rating,
                userEmail: user?.primaryEmailAddress?.emailAddress,
                createdAt: moment().format('DD-MM-yyy')
            })
        if (resp) {
            toast('User Answer recorded successfully')
            setUserAnswer('');
            setResults([]);
        }
        setResults([]);
        setLoading(false);

    }
    return (
        <div className='flex items-center justify-center flex-col'>
            <div className='flex flex-col justify-center items-center bg-black rounded-lg p-5 my- mt-20 '>
                <Image src={'/webcam.png'} width={200} height={200}
                    className='absolute' />
                <Webcam
                    mirrored={true}
                    style={{
                        height: 300,
                        width: '100%',
                        zIndex: 10,

                    }}
                />
            </div>
            <Button
                disabled={loading}

                variant="outline" className='my-10'
                onClick={StartStopRecoridng}
            >
                {isRecording ?
                    <h2 className='text-red-600 flex gap-2 animate-pulse items-center'>
                        <CircleStopIcon /> Stop Recording
                    </h2>

                    :

                    <h2 className='text-primary flex gap-2 items-center'><Mic />Record Answer</h2>}</Button>
        </div>
    )
}

export default RecordAnswerSection

