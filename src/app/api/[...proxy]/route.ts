import { NextRequest, NextResponse } from 'next/server';

// These URLs are now only available on the server-side.
const FLASK_API_URL = process.env.NEXT_PUBLIC_FLASK_API_URL;
const FACE_RECOG_URL = process.env.NEXT_PUBLIC_FACE_RECOG_URL;

// This function handles all incoming requests to /api/*
export async function handler(req: NextRequest) {
  // Extract the path the browser is trying to access (e.g., /documents, /image/123)
  const path = req.nextUrl.pathname.replace('/api', '');
  
  // Determine which backend API to forward the request to based on the path
  let targetApiBaseUrl;
  let targetPathPrefix = '/api'; // Most Flask routes start with /api
  
  if (path.startsWith('/analyze_image') || path.startsWith('/add_face')) {
    targetApiBaseUrl = FACE_RECOG_URL;
    targetPathPrefix = ''; // The face-recog service doesn't use /api
  } else if (path.startsWith('/cache/')) {
    // *** FIX: Handle requests for cached assets ***
    // These requests on the Flask server do not have the /api prefix.
    targetApiBaseUrl = FLASK_API_URL;
    targetPathPrefix = ''; // Forward directly to /cache/...
  }
  else {
    targetApiBaseUrl = FLASK_API_URL;
  }

  if (!targetApiBaseUrl) {
    return NextResponse.json({ error: 'Target API URL is not configured on the server.' }, { status: 500 });
  }

  // Construct the full URL to the target backend service, including query parameters
  const targetUrl = `${targetApiBaseUrl}${targetPathPrefix}${path}${req.nextUrl.search}`;
  
  // Create new headers, copying the content-type from the original request
  const headers = new Headers();
  if (req.headers.get('Content-Type')) {
    headers.set('Content-Type', req.headers.get('Content-Type')!);
  }

  // Forward the request from the Next.js server to the backend
  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
      // @ts-ignore
      duplex: 'half', // Required for streaming request bodies
    });

    // Return the response from the backend directly to the browser
    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  } catch (error) {
    console.error('API proxy error:', error);
    return NextResponse.json({ error: 'Error forwarding request to the backend.' }, { status: 502 });
  }
}

// Export handlers for all common HTTP methods to use the same proxy logic
export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
