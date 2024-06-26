import { index } from 'drizzle-orm/pg-core'
import { Lightbulb, Volume2 } from 'lucide-react';
import React from 'react'


function QuestionSection({ mockInterciewQuestion, activeQuestionIndex }) {
    const textToSpeech = (text) => {
        if ('speechSynthesis' in window) {
            const speech = new SpeechSynthesisUtterance(text)
            window.speechSynthesis.speak(speech)
        }
        else{
            alert('Sorry , Your browser does not support text to speech')
        }
    }

    return mockInterciewQuestion && (
        <div className='pd-5 border rounded-lg my-10'>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5 ml-5 mr-5'>
                {mockInterciewQuestion && mockInterciewQuestion.map((question, index) => {
                    console.log('activeQuestionIndex:', activeQuestionIndex);
                    console.log('index:', index);
                    return (
                        <h2 className={`p-2 border rounded-full text-xs md:text-sm text-center cursor-pointer ${activeQuestionIndex == index && 'bg-primary text-white'}`}>Question #{index + 1}</h2>
                    );
                })}

            </div>
            <h2 className='my-5 text-md md:text-lg mt-5 ml-5 mr-5'>{mockInterciewQuestion[activeQuestionIndex]?.question}</h2>
            <Volume2 className='ml-5 cursor-pointer' onClick={() => textToSpeech(mockInterciewQuestion[activeQuestionIndex]?.question)} />

            <div className='border rounded-lg p-5 bg-blue-100 mb-5 mt-20 ml-5 mr-5 my-10'>
                <h2 className='flex gap-2 items-center text-blue-800'>
                    <Lightbulb />
                    <strong>
                        Note:
                    </strong>
                </h2>
                <h2>{process.env.NEXT_PUBLIC_QUESTION_NOTE}</h2>
            </div>
        </div>
    )
}

export default QuestionSection
