// src/app/api/login/route.js
import { NextResponse } from 'next/server';
import { storeOrUpdateCreds } from '@/lib/db/store_creds';
import { generateJWT } from '@/lib/utils/jwt';
import { REQUEST_HEADERS } from '@/lib/webkiosk/constants.js';

export async function GET(request) {
    console.log('GET request to /api/login received. This endpoint is not intended for GET requests.');
    // This GET handler is not used in this context, but you can implement it if needed.
    return NextResponse.json({ message: 'GET method not supported for login.' }, { status: 405 });

}
export async function POST(request) {
    let sessionId = null;

    try {
        // Parse the incoming JSON payload from your frontend
        // This assumes your frontend sends memberCode and password in JSON
        const { memberCode, password } = await request.json();

        // IMPORTANT: In a real application, never hardcode sensitive credentials.
        // Use environment variables for API keys and handle user credentials securely.
        // For demonstration, we're using the provided values, but dynamically
        // inserting the received memberCode and password.
        const requestBody = new URLSearchParams();
        requestBody.append('txtuType', 'Member Type');
        requestBody.append('UserType', 'S');
        requestBody.append('txtCode', 'Enrollment No');
        requestBody.append('MemberCode', memberCode); // Dynamic from input
        requestBody.append('txtPin', 'Password/Pin');
        requestBody.append('Password', password);     // Dynamic from input
        requestBody.append('BTNSubmit', 'Submit');


        const headers = REQUEST_HEADERS; // Import your headers from constants.js

        const externalResponse = await fetch('https://webkiosk.thapar.edu/CommonFiles/UserAction.jsp', {
            method: 'POST',
            headers: headers,
            body: requestBody.toString(),
            redirect: 'manual', // Crucial to capture 302 redirect and its headers
        });
        console.log(`Payload sent to external API: ${requestBody.toString()}`);
        console.log(`External API Response Status: ${externalResponse.status}`);
        console.log(`External API Response Status Text: ${externalResponse.statusText}`);

        // Check if the response is a redirect (302 Found)
        if (externalResponse.status === 302 || externalResponse.status === 303) {
            const locationHeader = externalResponse.headers.get('location');
            console.log(`Redirect Location: ${locationHeader}`);

            // FIX: Use getSetCookie() to correctly extract all Set-Cookie headers
            const setCookieHeaders = externalResponse.headers.getSetCookie(); // Corrected line
            if (setCookieHeaders) {
                for (const cookie of setCookieHeaders) {
                    if (cookie.includes('JSESSIONID=')) {
                        sessionId = cookie.split(';')[0].split('JSESSIONID=')[1];
                        console.log(`Captured JSESSIONID: ${sessionId}`);
                        break; // Found it, no need to check other cookies
                    }
                }
            }

            // You can also read the response body if it's not a redirect,
            // or if you expect a body even with a redirect status
            // const responseText = await externalResponse.text();
            // console.log("External API Response Body (if any):", responseText);

            if (locationHeader && locationHeader.includes('/StudentFiles/StudentPage.jsp')) {
                // Save creds in background
                storeOrUpdateCreds({ enrollmentNo: memberCode, password }).catch(console.error);

                // JWT only contains the enrollmentNo
                const token = await generateJWT({ enrollmentNo: memberCode });

                const response = NextResponse.json({ success: true });

                // ✅ Long-lived identity token
                response.cookies.set('auth-token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    path: '/',
                    maxAge: 60 * 60 * 24 * 100, // 100 days
                });

                // ✅ Short-lived session ID (re-auth every 30 min if needed)
                response.cookies.set('X-Session-ID', sessionId, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    path: '/',
                    maxAge: 60 * 30, // 30 minutes
                });
                response.cookies.set('X-Session-Issued-At', Date.now().toString(), {
                    httpOnly: true,
                    path: '/',
                    maxAge: 60 * 30,
                });


                return response;
            }

            else {
                // Redirected but not to student page, or other unexpected redirect
                console.warn('Login attempt resulted in an unexpected redirect.');
                return NextResponse.json(
                    {
                        success: false,
                        message: 'Login failed or unexpected redirect.',
                        sessionId: sessionId,
                        redirectLocation: locationHeader,
                        status: externalResponse.status
                    },
                    { status: 400 } // Return 200 to your frontend to allow it to handle the outcome
                );
            }

        } else {
            // Not a 302, handle other responses (e.g., 200 OK with error message, 4xx, 5xx)
            const responseText = await externalResponse.text();
            console.error(`External API did not redirect as expected. Status: ${externalResponse.status}`);
            return NextResponse.json(
                {
                    success: false,
                    message: 'External API response not as expected (no redirect).',
                    status: externalResponse.status,
                    responseText: responseText,
                },
                { status: 400 } // Return 200 to your frontend to allow it to handle the outcome
            );
        }

    } catch (error) {
        console.error('Error during login API request:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error during login process.', error: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
