import express from 'express';
import * as  dotenv from 'dotenv'
import cors from 'cors';
import { Configuration,OpenAIApi} from 'openai';

const PORT = process.env.PORT || 3030;
dotenv.config();

const configuration =new Configuration({
    apiKey:process.env.OPENAI_API_KEY,
});

const openai=new OpenAIApi(configuration);

const app=express();
app.use(cors());
app.use(express.json());

app._router.get('/',(req,res)=>{
    res.status(200).send({
        message:'Hello from CodeX',
    })
})
app.post('/',async(req,res)=>{
    try {
        const prompt=req.body.prompt;
        const response=await openai.createCompletion({

            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 1,// whe is cero is going to give a very straight answer to the question 
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5, 
            presence_penalty: 0,
        });

        res.status(200).send({
            bot:response.data.choices[0].text
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({error});
    }
})



app.listen(PORT,()=>console.log(`server started on port ${PORT}`));