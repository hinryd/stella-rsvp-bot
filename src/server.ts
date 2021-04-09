import express, { Request, Response } from 'express'
const app = express()

app.use(express.json())
app.get('/test', (req: Request, res: Response) => {
  res.status(200).send('Testing route successful')
})
app.post(`/${process.env.BOT_TOKEN}`, (req: Request, res: Response) => {
  console.log(req.body) // Call your action on the request here
  res.status(200).send('Server is here') // Responding is important
})
app.listen(process.env.PORT, () => console.log(`🚀 Server running on port ${process.env.PORT}`))
