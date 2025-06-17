import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Show all environment variables for testing purposes
    const envVars: Record<string, string> = {}
    
    Object.keys(process.env).forEach(key => {
      envVars[key] = process.env[key] || ''
    })
    
    return NextResponse.json({
      success: true,
      environmentVariables: envVars,
      count: Object.keys(envVars).length
    })
  } catch (error) {
    console.error('Error fetching environment variables:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch environment variables',
        environmentVariables: {},
        count: 0
      },
      { status: 500 }
    )
  }
}

