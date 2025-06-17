'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

interface EnvResponse {
  success: boolean
  environmentVariables: Record<string, string>
  count: number
  error?: string
}

export default function Home() {
  const [envVars, setEnvVars] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [count, setCount] = useState(0)
  const { toast } = useToast()

  const fetchEnvironmentVariables = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/env')
      const data: EnvResponse = await response.json()
      
      if (data.success) {
        setEnvVars(data.environmentVariables)
        setCount(data.count)
        toast({
          title: "Environment variables loaded",
          description: `Found ${data.count} environment variables`,
        })
      } else {
        setError(data.error || 'Failed to fetch environment variables')
        toast({
          title: "Error",
          description: data.error || 'Failed to fetch environment variables',
          variant: "destructive",
        })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEnvironmentVariables()
  }, [])

  return (
    <div className="min-h-full">
      <section className="container mx-auto px-4 pt-24 pb-20">
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight lg:text-5xl mb-4">
              Environment Variables Tester
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Test and view your environment variables safely
            </p>
            <Button 
              onClick={fetchEnvironmentVariables} 
              disabled={loading}
              className="mb-8"
            >
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Variables
                </>
              )}
            </Button>
          </div>

          {error && (
            <Card className="mb-6 border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">Error: {error}</span>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Environment Variables ({count})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                  <span>Loading environment variables...</span>
                </div>
              ) : Object.keys(envVars).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No environment variables found</p>
                  <p className="text-sm mt-2">
                    Add some environment variables to your .env file or deployment settings
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(envVars).map(([key, value]) => (
                    <div 
                      key={key} 
                      className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 bg-gray-50 rounded-lg border"
                    >
                      <div className="font-mono text-sm font-medium text-blue-600 min-w-0 flex-shrink-0">
                        {key}
                      </div>
                      <div className="text-sm text-gray-600 font-mono bg-white px-2 py-1 rounded border min-w-0 break-all">
                        {value || '(empty)'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">How to add environment variables:</h3>
                <div className="text-sm text-left space-y-2">
                  <p><strong>Local development:</strong> Create a <code className="bg-white px-1 rounded">.env.local</code> file in your project root</p>
                  <p><strong>Production:</strong> Add them in your deployment platform settings</p>
                  <p><strong>Public variables:</strong> Prefix with <code className="bg-white px-1 rounded">NEXT_PUBLIC_</code> to make them available in the browser</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
