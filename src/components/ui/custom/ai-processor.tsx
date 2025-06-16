import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { MagicWand, ArrowsClockwise } from '@phosphor-icons/react'

interface AIProcessorProps {
  processedText: string
}

// This component displays the AI processed data with edit capabilities
export default function AIProcessor({ processedText }: AIProcessorProps) {
  const [text, setText] = useState(processedText)
  const [isEditing, setIsEditing] = useState(false)

  const handleProcess = () => {
    // In a real app, this would send the edited text back to AI for further refinement
    setIsEditing(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MagicWand className="mr-2 h-5 w-5" />
          AI Refined Data
        </CardTitle>
        <CardDescription>
          View and edit the AI-refined customer data
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <Textarea 
              value={text} 
              onChange={(e) => setText(e.target.value)} 
              className="min-h-[300px] font-mono text-sm"
            />
            <div className="flex space-x-2">
              <Button onClick={handleProcess}>Apply Changes</Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <pre className="whitespace-pre-wrap bg-muted p-4 rounded-md text-sm overflow-auto max-h-[400px]">
              {text}
            </pre>
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(true)}
              className="gap-2"
            >
              <ArrowsClockwise size={16} />
              Edit Content
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}