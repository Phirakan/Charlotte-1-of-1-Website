import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { transactionId } = req.query;
  
  if (!transactionId || typeof transactionId !== 'string') {
    return res.status(400).json({ error: 'Transaction ID is required' });
  }
  
  try {
    // เรียกใช้ API ของ Java payment service
    const response = await fetch(`https://cunning-smoothly-aphid.ngrok-free.app/api/payment/status/${transactionId}`);
    
    if (!response.ok) {
      throw new Error(`Payment service returned ${response.status}`);
    }
    
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error: any) {
    console.error('Error checking payment status:', error);
    return res.status(500).json({ error: 'Failed to check payment status' });
  }
}