//for authentication and authorization
import jwt from "jsonwebtoken";


const jsonWebToken = (userId,response) => {//userid is importing fron userrothcontroller
        const token = jwt.sign({userId},process.env.JWT_SECRET,{//getting the id before the register,and impoting from env bya process
        expiresIn : '30d'
        })
        //This is the core line — it creates the actual JWT. Let's break down each argument to jwt.sign(...):

// {userId} — the payload, i.e., the actual data you want to embed inside the token. This is shorthand for { userId: userId }. Whatever you put here becomes readable (though not editable without the secret) by anyone who has the token — so never put sensitive data like passwords here. A user ID is safe to include.
// process.env.JWT_SECRET — a private string (stored in your .env file) used to cryptographically sign the token. This signature is what makes the token trustworthy — if anyone tries to tamper with the payload (e.g., changing the userId), the signature will no longer match, and your server will detect the token as invalid when verifying it later.
// { expiresIn: '30d' } — an options object telling the library to automatically embed an expiration timestamp, so the token stops being valid 30 days after issue. After that, the user would need to log in again to get a fresh token.

// The result, token, is a signed string — something like eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTU2Nj.... This encodes the payload, the expiration, and the signature all together.
        response.cookie('jwt',token,{
            maxAge: 30*24*60*60*1000,//This tells Express to attach a cookie named 'jwt' to the outgoing HTTP response, with token as its value. When the client (browser/Postman) receives this response, it stores the cookie and will automatically send it back on future requests to your server — this is what "remembers" that the user is logged in, without them re-entering credentials every time.
            httpOnly:true,//for givibg it more security,This protects against a common attack called XSS (Cross-Site Scripting) — even if malicious JavaScript somehow got injected into your site, it couldn't steal this cookie, since only the browser itself (and your server) can access it.
            sameSite:"strict",//Another security setting — this tells the browser to only send this cookie when the request originates from your own site, not from links or forms on other websites. This helps protect against CSRF (Cross-Site Request Forgery) attacks, where a malicious website tries to trick a logged-in user's browser into making unwanted requests to your server using their existing cookies.
            secure:true//its autometically gets secured when its in hosting stage but when its in development stage its not secured
            
        })
}

export default jsonWebToken;










//for this secure:process.env.SECURE !== "development"
//This determines whether the cookie should only be sent over HTTPS connections.

// If process.env.SECURE equals "development" → this evaluates to false, meaning the cookie works fine over plain http://localhost (needed for local testing, since you don't have HTTPS set up locally).
// If process.env.SECURE is anything else (e.g., unset, or set to "production") → this evaluates to true, enforcing that the cookie is only ever sent over secure HTTPS connections — appropriate once your app is actually deployed live, where security matters and HTTPS should be standard.