import app from "../src/index";

// Vercel will call this function for each incoming request. Forward to the Express app.
export default function handler(req: any, res: any) {
  (app as any)(req, res);
}
