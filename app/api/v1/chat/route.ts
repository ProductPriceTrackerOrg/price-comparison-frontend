import { NextRequest, NextResponse } from 'next/server';

// Simulate a delay for the response
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { product_id, user_message, session_id } = body;

    if (!product_id || !user_message || !session_id) {
      return NextResponse.json(
        { error: 'Missing required fields: product_id, user_message, or session_id' },
        { status: 400 }
      );
    }

    // Log the incoming request
    console.log('Chat request:', { product_id, session_id });

    // Simulate processing time
    await delay(1500);

    // Mock response based on user_message content
    let response = '';
    let sources: string[] = [];

    if (user_message.toLowerCase().includes('price')) {
      response = 'The current price of this product is competitive within the market. We track multiple retailers and have found this to be among the best prices currently available.';
      sources = ['PriceTracker API', 'RetailerCompare Service'];
    } 
    else if (user_message.toLowerCase().includes('specification') || user_message.toLowerCase().includes('specs')) {
      response = 'This product features the latest specifications in its category. Would you like me to highlight any specific aspect of the specifications?';
    } 
    else if (user_message.toLowerCase().includes('discount') || user_message.toLowerCase().includes('deal')) {
      response = 'This product currently has a discount applied. We predict prices may drop further in about 3 weeks based on historical trends.';
      sources = ['PriceHistory Analytics'];
    } 
    else if (user_message.toLowerCase().includes('review') || user_message.toLowerCase().includes('rating')) {
      response = 'This product has generally positive reviews with an average rating of 4.5/5 stars across multiple retailers. Users particularly praise its performance and design.';
      sources = ['ReviewAggregator', 'CustomerFeedback API'];
    }
    else {
      response = 'Thanks for your question! I can help you with price comparisons, specifications, availability, and more about this product. What specific information would you like to know?';
    }

    // Return the response
    return NextResponse.json({ 
      response, 
      sources,
      session_id
    });
  } catch (error) {
    console.error('Error processing chat:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
