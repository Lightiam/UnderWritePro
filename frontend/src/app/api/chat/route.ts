import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { content } = await req.json();
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
