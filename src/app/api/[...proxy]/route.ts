import { NextRequest, NextResponse } from 'next/server';

// These URLs are now only available on the server-side.
const FLASK_API_URL = process.env.NEXT_PUBLIC_FLASK_API_URL;
const FACE_RECOG_URL = process.env.NEXT_PUBLIC_FACE_RECOG_URL;

// This is the core logic that will be shared by all HTTP methods.
async function proxyHandler(req: NextRequest): Promise<NextResponse> {
  // Extract the path the browser is trying to access (e.g., /documents, /image/123)
  const path = req.nextUrl.pathname.replace('/api', '');
  
  // Define the routes that belong to the Face Recognition service
  const faceRecogRoutes = ['/analyze_image', '/add_face', '/recognize_faces', '/analyze_image_stream'];

  let targetApiBaseUrl;
  let finalPath = path;
  
  // Check if the requested path starts with any of the face recognition routes
  if (faceRecogRoutes.some(route => path.startsWith(route))) {
    targetApiBaseUrl = FACE_RECOG_URL;
  } else {
    targetApiBaseUrl = FLASK_API_URL;
    // For the main Flask API, all routes are prefixed with /api, except for /cache
    if (!path.startsWith('/cache/')) {
        finalPath = `/api${path}`;
    }
  }

  if (!targetApiBaseUrl) {
    return NextResponse.json({ error: 'Target API URL is not configured on the server.' }, { status: 500 });
  }

  // Construct the full URL to the target backend service, including query parameters
  const targetUrl = `${targetApiBaseUrl}${finalPath}${req.nextUrl.search}`;
  
  const headers = new Headers();
  if (req.headers.get('Content-Type')) {
    headers.set('Content-Type', req.headers.get('Content-Type')!);
  }

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
      // @ts-ignore - duplex is required for streaming bodies
      duplex: 'half', 
    });

    // Stream the response back to the client
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

// Export a separate, named function for each HTTP method.
export async function GET(req: NextRequest) {
  return proxyHandler(req);
}

export async function POST(req: NextRequest) {
  return proxyHandler(req);
}

export async function PUT(req: NextRequest) {
    return proxyHandler(req);
}

export async function DELETE(req: NextRequest) {
    return proxyHandler(req);
}
