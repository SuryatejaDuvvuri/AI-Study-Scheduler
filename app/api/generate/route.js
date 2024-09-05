import { NextResponse } from "next/server";
import OpenAI from "openai";


export async function POST(req) {

    const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env.OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
    });
    
    try {
        const data = await req.text();
        const {subject, number, topics} = JSON.parse(data);
       
        const systemPrompt = `
        1. Only Generate a ${number} hour schedule with each hour split as a block to cover ${topics} on ${subject}. 
        2. When you list out the blocks, make sure it is descriptive and clear so that the user can follow accordingly. Make sure you list the hour from 1 to ${number} and the description of the block.
        Remember the goal of a study schedule is to facilitate effective learning and time management for the user. 
        
        Return in the following JSON format without any additional information:
        {
            "schedule" :[
            {
                "hour" : int,
                "description" : str    
            }
            ]
        }
        `;
        const completion = await openai.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: "Generate a" + number + " hour study schedule for a " + subject + " course covering the topics: " + topics + "in equal portions."}
            ],
            model: "meta-llama/llama-3.1-8b-instruct:free",
            response_format: {type: 'json_object'}
        })
        const startIndex = completion.choices[0].message.content.indexOf('{');
        const endIndex = completion.choices[0].message.content.lastIndexOf('}');
        console.log(completion.choices[0].message.content.slice(startIndex, endIndex + 1));
        const schedules = JSON.parse(completion.choices[0].message.content.substring(startIndex, endIndex + 1));
        return NextResponse.json(schedules.schedule);
    } catch (error) {
        console.error("Error generating schedule:", error);
        return NextResponse.json({ error: "Failed to generate schedule" }, { status: 500 });
    }
}
