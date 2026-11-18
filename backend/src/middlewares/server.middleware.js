import express from "express"
import cors from "cors"
import morgan from "morgan"
import helmet from "helmet"



const serverMiddleware = (app) => {

    app.use(cors({
        origin:'https://rutalimpia-front-camilo-ebd5hdb2aufwbzd7.eastus2-01.azurewebsites.net',
        methods:['GET','POST','PUT','DELETE' , 'OPTIONS'],
        allowedHeaders:['Content-Type','Authorization']
    }))

    app.use(morgan("dev"))

    app.use(express.json())

    app.use(helmet())

}

export default serverMiddleware