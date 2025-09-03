import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bot, Clock, ArrowLeft, Trash2 } from 'lucide-react'
import type { VoiceSessionResponse } from '@/store/slices/eveSlice'

// FIX 1: Add the onDeleteSummary prop to the interface.
interface NotesPanelProps {
  voiceSummaries: VoiceSessionResponse[]
  onDeleteSummary: (sessionId: string) => void
}

const formatDate = (timestamp: string) =>
  new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

const NotesPanel: React.FC<NotesPanelProps> = ({ voiceSummaries, onDeleteSummary }) => {
  const [selectedSummary, setSelectedSummary] = useState<VoiceSessionResponse | null>(null)

  const handleSummaryClick = (summary: VoiceSessionResponse) => {
    setSelectedSummary(summary)
  }

  const handleBackToList = () => {
    setSelectedSummary(null)
  }

  // FIX 2: Create a handler that calls the onDeleteSummary prop and resets the view.
  const handleDelete = () => {
    if (selectedSummary) {
      onDeleteSummary(selectedSummary.session_id)
      setSelectedSummary(null) // Go back to the list view after deletion
    }
  }

  return (
    <div className="lg:col-span-1 hover:shadow-lg">
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bot className="h-4 w-4" />
            {selectedSummary ? 'Note Details' : 'Voice Summaries'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {selectedSummary ? (
              // --- DETAILED VIEW ---
              <div className="space-y-4">
                <Button variant="ghost" size="sm" onClick={handleBackToList} className="mb-2 text-gray-600">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Summaries
                </Button>
                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>{formatDate(selectedSummary.created_at)}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Summary</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedSummary.summary}</p>

                    <h3 className="font-semibold text-gray-800 mt-3 mb-1">Full Notes</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedSummary.notes_content}</p>
                  </div>
                  {/* FIX 3: Add the delete button to the UI */}
                  <Button variant="destructive" size="sm" onClick={handleDelete} className="w-full">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Note
                  </Button>
                </div>
              </div>
            ) : (
              // --- LIST VIEW ---
              <>
                {voiceSummaries.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <Bot className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No voice summaries yet</p>
                  </div>
                ) : (
                  voiceSummaries.map((summary) => (
                    <div
                      key={summary.id}
                      className="p-2 border rounded-lg text-sm bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => handleSummaryClick(summary)}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{formatDate(summary.created_at)}</span>
                      </div>
                      <p className="text-xs font-medium text-gray-800 line-clamp-1">
                        {summary.summary ? summary.summary.substring(0, 50) + '...' : 'Voice Session Summary'}
                      </p>
                    </div>
                  ))
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default NotesPanel