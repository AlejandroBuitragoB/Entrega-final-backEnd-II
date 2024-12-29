import { request, response } from "express";
import { purchase } from "../services/purchase.services.js";

export const purchaseController = async (req = request, res = response) => {
  try {
    const { cid } = req.params; // Obtén el ID del carrito desde los parámetros
    const user = req.user; // Asumimos que el usuario está autenticado

    // Llamamos al servicio de compra
    const { ticket, updatedProducts, failedProducts, totalAmount, userEmail } = await purchase(cid, user);

    // Respuesta si la compra se realizó con éxito
    return res.status(200).json({
      msg: `Purchase completed. Ticket ID: ${ticket._id}, Total: ${totalAmount}, User: ${userEmail}`,
      purchaseData: {
        ticket,
        processedProducts: updatedProducts,
        nonProcessedProducts: failedProducts,
      },
    });
  } catch (error) {
    // Si hubo un error en el proceso de compra
    return res.status(500).json({ msg: `Error while processing purchase: ${error.message}` });
  }
};
