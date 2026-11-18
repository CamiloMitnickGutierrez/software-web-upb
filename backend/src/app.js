import express from "express"
import serverMiddleware from "./middlewares/server.middleware.js"
import authRoutes from "./routes/auth.routes.js"
import zoneRoutes from "./routes/zone.routes.js"
import cleaningRoutes from "./routes/cleaning.routes.js"
import adminRoutes from "./routes/admin.routes.js"


const app = express()

//metodo de middlewares para mi server
serverMiddleware(app)

//ruta raiz server
app.get("/",(req,res) => {
    
    res.send("Api viva ")
})

//rutas del server
app.use("/api/auth",authRoutes)
app.use("/api/zones",zoneRoutes)
app.use("/api/cleanings",cleaningRoutes)
app.use("/api/admin", adminRoutes)


export default app