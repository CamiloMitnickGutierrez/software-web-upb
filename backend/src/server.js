import "dotenv/config"
import app from "./app.js"
import { Server } from "socket.io"
import { createServer } from "node:http"
import { supabase } from "./config/supabase.js"


const PORT = process.env.PORT || 4080
const httpServer = createServer(app)

const io = new Server(httpServer,{
    cors:{
        origin: "*",
    methods: ["GET", "POST"]
    }
})

io.on('connection', (socket) => {
  console.log(`🔌 Cliente conectado: ${socket.id}`);

  // Cuando la operaria escanea el QR e inicia el aseo
  socket.on('cleaning:start', async (data) => {
    console.log('Aseo iniciado en zona:', data);
    try {
      if (data.zone_id) {
        const { error } = await supabase
          .from('zones')
          .update({ estado: 'in_progress' })
          .eq('id', data.zone_id);
        if (error) throw error;
      }
      io.emit('admin:cleaning-started', data);
    } catch (error) {
      console.error('Error al marcar zona en progreso:', error);
    }
  });

  // Cuando la operaria finaliza el aseo y envía el reporte
  socket.on('cleaning:finished', async (data) => {
    console.log('Aseo finalizado:', data);
    try {
      if (data.zone_id) {
        const { error } = await supabase
          .from('zones')
          .update({ estado: 'completed' })
          .eq('id', data.zone_id);
        if (error) throw error;
      }
      io.emit('admin:cleaning-finished', data);
    } catch (error) {
      console.error('Error al marcar zona completada:', error);
    }
  });

  socket.on('cleaning:novelty', async (data) => {
    console.log('Novedad reportada durante el aseo:', data);
    try {
      if (data.zone_id) {
        const { error } = await supabase
          .from('zones')
          .update({ estado: 'issue' })
          .eq('id', data.zone_id);
        if (error) throw error;
      }
      io.emit('admin:cleaning-novelty', data);
    } catch (error) {
      console.error('Error al marcar novedad de zona:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });
});


httpServer.listen(PORT,() => {

    console.log(`SERVER LISTO , ESCUCHANDO EN PUERTO -> ${PORT}`)
})