import { NextResponse } from 'next/server';
import { aiTaskService, AiTask } from '@/lib/ai/analysis';

/**
 * This is the single, consolidated API route for all AI-powered tasks.
 * It acts as a controller that validates the incoming request and dispatches
 * it to the correct service function in `lib/ai/analysis.ts`.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { task, payload } = body;

    // 1. Validate the task name
    if (!task || typeof task !== 'string' || !(task in aiTaskService)) {
      const availableTasks = Object.keys(aiTaskService).join(', ');
      return NextResponse.json(
        { error: `Invalid or missing 'task' name. Available tasks are: ${availableTasks}` },
        { status: 400 }
      );
    }

    // 2. Look up the service function from the imported service map
    const serviceFunction = aiTaskService[task as AiTask];

    // 3. Execute the dynamically selected function with its payload
    console.log(`Executing AI task: ${task}`);
    const result = await serviceFunction(payload);

    // 4. Return the result from the service function
    return NextResponse.json(result);

  } catch (error) {
    // Handle JSON parsing errors or other unexpected issues
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    // Log the error for debugging
    console.error(`[AI API Error] Task: ${error instanceof Error ? error.message : String(error)}`);

    // Return a generic server error response
    return NextResponse.json(
      { error: 'An internal server error occurred while processing the AI task.' },
      { status: 500 }
    );
  }
}
