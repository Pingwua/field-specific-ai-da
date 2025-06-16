import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { 
  SignOut, 
  Upload, 
  FileText, 
  CheckCircle, 
  Spinner, 
  ArrowSquareDown,
  TrashSimple
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useKV } from '@github/spark/hooks'

interface DashboardProps {
  onLogout: () => void
}

interface ProcessedData {
  id: string
  originalName: string
  processedText: string
  status: 'processing' | 'completed'
  timestamp: number
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [processedFiles, setProcessedFiles] = useKV<ProcessedData[]>('processedFiles', [])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setUploadedFile(event.target.files[0])
      toast.success(`File ${event.target.files[0].name} selected`)
    }
  }

  const handleUpload = async () => {
    if (!uploadedFile) {
      toast.error('Please select a file to upload')
      return
    }

    // Reset progress
    setProcessing(true)
    setProgress(0)

    // Simulate processing delay with progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval)
          return 95
        }
        return prev + 5
      })
    }, 300)

    // Simulate AI processing
    setTimeout(async () => {
      clearInterval(interval)
      setProgress(100)

      // In a real application, we would call the AI service here
      const processedText = await simulateAIProcessing(uploadedFile)
      
      const newFile: ProcessedData = {
        id: Date.now().toString(),
        originalName: uploadedFile.name,
        processedText,
        status: 'completed',
        timestamp: Date.now()
      }

      setProcessedFiles([newFile, ...processedFiles])
      setProcessing(false)
      setUploadedFile(null)
      toast.success('File processed successfully')
    }, 5000)
  }

  // Simulate AI processing - in a real app, this would call an actual AI service
  const simulateAIProcessing = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        
        // This is where the AI would actually refine the data
        // For demo purposes, we'll just add some refinements to the text
        const refinedText = `
# AI Refined Customer Data

## Original Content Summary
The uploaded document contained customer information with several inconsistencies and formatting issues.

## Refinements Made
1. Standardized all customer names (First Last format)
2. Validated and formatted all email addresses
3. Normalized phone numbers to (XXX) XXX-XXXX format
4. Removed duplicate entries
5. Fixed spelling and grammar issues
6. Organized data in a structured format

## Refined Data
${text ? text.substring(0, 150) : "No text content found"}...
[Additional refined content would appear here in production version]

## Confidence Score
The AI is 94% confident in these refinements based on training data and patterns.

## Recommendations
Consider adding customer demographic information to enrich your dataset.
        `
        
        resolve(refinedText)
      }
      
      reader.readAsText(file)
    })
  }

  const handleDelete = (id: string) => {
    setProcessedFiles(processedFiles.filter(file => file.id !== id))
    toast.success('File removed')
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <h1 className="text-lg font-semibold">AI Data Refiner</h1>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onLogout}
            className="gap-2"
          >
            <SignOut size={18} />
            Sign Out
          </Button>
        </div>
      </header>
      
      <main className="container px-4 py-8 md:px-6 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Tabs defaultValue="upload" className="space-y-8">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="upload">Upload Data</TabsTrigger>
              <TabsTrigger value="history">Processing History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Customer Data</CardTitle>
                  <CardDescription>
                    Select a file to upload and our AI will refine the customer data automatically.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {!processing ? (
                    <div className="grid gap-6">
                      <div 
                        className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => document.getElementById('file-upload')?.click()}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Upload size={38} className="text-muted-foreground" />
                          <h3 className="font-semibold text-lg">Upload File</h3>
                          <p className="text-sm text-muted-foreground max-w-sm">
                            Drag and drop or click to select a file (.txt, .csv, .json)
                          </p>
                          <input
                            id="file-upload"
                            type="file"
                            accept=".txt,.csv,.json,.xlsx"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                        </div>
                      </div>
                      
                      {uploadedFile && (
                        <Alert>
                          <FileText className="h-5 w-5" />
                          <AlertTitle>File Selected</AlertTitle>
                          <AlertDescription className="flex items-center justify-between">
                            <span>{uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)} KB)</span>
                            <Button 
                              onClick={() => setUploadedFile(null)}
                              variant="outline" 
                              size="sm"
                            >
                              Remove
                            </Button>
                          </AlertDescription>
                        </Alert>
                      )}
                      
                      <Button 
                        onClick={handleUpload} 
                        disabled={!uploadedFile}
                        className="w-full"
                      >
                        Process with AI
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="text-center">
                        <Spinner size={48} className="animate-spin text-primary mx-auto mb-4" />
                        <h3 className="font-semibold text-lg">Processing Your Data</h3>
                        <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1 mb-4">
                          Our AI is analyzing and refining your customer data
                        </p>
                      </div>
                      
                      <Progress value={progress} className="h-2 w-full" />
                      
                      <p className="text-center text-sm text-muted-foreground">
                        {progress < 100 ? 'Processing...' : 'Finalizing results...'}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Processing History</CardTitle>
                  <CardDescription>
                    View and download your previously processed files.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {processedFiles.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText size={38} className="text-muted-foreground mx-auto mb-3" />
                      <h3 className="text-lg font-semibold">No processed files yet</h3>
                      <p className="text-sm text-muted-foreground mt-1 mb-4">
                        Upload a file to get started with AI refinement
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {processedFiles.map((file) => (
                        <div 
                          key={file.id} 
                          className="border border-border rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="bg-primary/10 rounded-full p-2">
                                <FileText size={20} className="text-primary" />
                              </div>
                              <div>
                                <h4 className="font-medium">{file.originalName}</h4>
                                <p className="text-xs text-muted-foreground">
                                  {formatDate(file.timestamp)}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              {file.status === 'completed' ? (
                                <div className="flex items-center text-xs text-green-600 font-medium">
                                  <CheckCircle size={14} className="mr-1" />
                                  Completed
                                </div>
                              ) : (
                                <div className="flex items-center text-xs text-amber-600 font-medium">
                                  <Spinner size={14} className="animate-spin mr-1" />
                                  Processing
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <Separator className="my-2" />
                          
                          <div className="mt-3 flex items-center space-x-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              className="gap-2"
                              onClick={() => {
                                // In a real app, this would download the file
                                toast.success('Download started')
                              }}
                            >
                              <ArrowSquareDown size={16} />
                              Download
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-2 text-destructive"
                              onClick={() => handleDelete(file.id)}
                            >
                              <TrashSimple size={16} />
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  )
}