import mongoose from "mongoose";

mongoose.connect("mongodb+srv://alejandrobuitragob:Inicio.0001@cluster0.u2v5d.mongodb.net/entregaFinalBackEnd?retryWrites=true&w=majority&appName=Cluster0")
      .then(()=> console.log("Conectados a los BD"))
      .catch((error) => console.log("Tenemos un problema", error))