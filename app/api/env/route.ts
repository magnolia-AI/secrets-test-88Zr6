import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Get all environment variables
    const envVars = process.env
    
    // Filter out sensitive variables and only show ones that are safe to display
    // You can customize this list based on your needs
    const safeEnvVars: Record<string, string> = {}
    
    // Add common environment variables that are safe to display
    const safeKeys = [
      'NODE_ENV',
      'NEXT_PUBLIC_APP_URL',
      'NEXT_PUBLIC_SITE_NAME',
      'NEXT_PUBLIC_API_URL',
      'VERCEL_ENV',
      'VERCEL_URL',
      'PORT'
    ]
    
    // Include any NEXT_PUBLIC_ variables (these are safe by design)
    Object.keys(envVars).forEach(key => {
      if (key.startsWith('NEXT_PUBLIC_') || safeKeys.includes(key)) {
        safeEnvVars[key] = envVars[key] || ''
      }
    })
    
    // Add some example variables if none exist
    if (Object.keys(safeEnvVars).length === 0) {
      safeEnvVars['NODE_ENV'] = process.env.NODE_ENV || 'development'
      safeEnvVars['EXAMPLE_VAR'] = 'This is an example environment variable'
      safeEnvVars['NEXT_PUBLIC_EXAMPLE'] = 'This is a public environment variable'
    }
    
    return NextResponse.json({
      success: true,
      environmentVariables: safeEnvVars,
      count: Object.keys(safeEnvVars).length
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
