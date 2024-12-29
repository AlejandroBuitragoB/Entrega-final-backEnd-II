import { ticketModel }  from "../dao/models/ticket.models.js"; 

export const createTicketService = async (ticketData) => {
  try {
    const newTicket = new ticketModel({
      amount: ticketData.totalAmount,
      purchaser: ticketData.userEmail, 
    });

    const savedTicket = await newTicket.save();
    
    return savedTicket;
  } catch (error) {
    throw new Error(`Error al crear el ticket: ${error.message}`);
  }
};
