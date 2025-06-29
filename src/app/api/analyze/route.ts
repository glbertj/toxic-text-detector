import { NextResponse } from 'next/server';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { message: 'Text input is required' }, 
        { status: 400 }
      );
    }
    
    const scriptPath = path.join(process.cwd(), 'src', 'scripts', 'analyze_text.py');
    
    // IMPORTANT FOR LECTURER: Please change this if you do not run python scripts using "python script.py"
    const { stdout, stderr } = await execPromise(`python "${scriptPath}" "${text.replace(/"/g, '\\"')}"`);
    
    if (stderr) {
      console.error('Python script error:', stderr);
      return NextResponse.json(
        { message: 'Error analyzing text' },
        { status: 500 }
      );
    }
    
    // Parse the Python script output
    const result = JSON.parse(stdout);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error handling request:', error);
    return NextResponse.json(
      { message: 'Server error occurred' },
      { status: 500 }
    );
  }
}