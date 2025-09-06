import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bot, Clock, ArrowLeft } from 'lucide-react'
import type { VoiceSessionResponse } from '@/store/slices/eveSlice'

interface NotesPanelProps {
  voiceSummaries: VoiceSessionResponse[]
  // onDeleteSummary: (sessionId: string) => void
}

const formatDate = (timestamp: string) =>
  new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

const NotesPanel: React.FC<NotesPanelProps> = ({ voiceSummaries }) => {
  const [selectedSummary, setSelectedSummary] = useState<VoiceSessionResponse | null>(null)

  const handleSummaryClick = (summary: VoiceSessionResponse) => {
    setSelectedSummary(summary)
  }

  const handleBackToList = () => {
    setSelectedSummary(null)
  }

  // const handleDelete = () => {
  //   if (selectedSummary) {
  //     onDeleteSummary(selectedSummary.session_id)
  //     setSelectedSummary(null)
  //   }
  // }

  return (
    <div className="lg:col-span-1">
      <Card className="h-full bg-black/80 border border-gray-500 text-white shadow-md">
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToList}
                  className="mb-2 text-gray-300 hover:text-white hover:bg-gray-700/50"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Summaries
                </Button>
                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span>{formatDate(selectedSummary.created_at)}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-200 mb-1">Summary</h3>
                    <p className="text-gray-300 whitespace-pre-wrap">{selectedSummary.summary}</p>

                    <h3 className="font-semibold text-gray-200 mt-3 mb-1">Full Notes</h3>
                    <p className="text-gray-300 whitespace-pre-wrap">{selectedSummary.notes_content}</p>
                  </div>
                  {/* <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Note
                  </Button> */}
                </div>
              </div>
            ) : (
              // --- LIST VIEW ---
              <>
                {voiceSummaries.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    <Bot className="h-8 w-8 mx-auto mb-2 text-gray-500" />
                    <p className="text-sm">No voice summaries yet</p>
                  </div>
                ) : (
                  voiceSummaries.map((summary) => (
                    <div
                      key={summary.id}
                      className="p-2 border border-gray-600 rounded-lg text-sm bg-black/60 hover:bg-black/70 cursor-pointer transition-colors"
                      onClick={() => handleSummaryClick(summary)}
                    >
                      <div className="flex items-center gap-1 mb-1 text-gray-400">
                        <Clock className="h-3 w-3" />
                        <span className="text-xs">{formatDate(summary.created_at)}</span>
                      </div>
                      <p className="text-xs font-medium text-gray-200 line-clamp-1">
                        {summary.summary
                          ? summary.summary.substring(0, 50) + '...'
                          : 'Voice Session Summary'}
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
