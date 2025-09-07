import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bot, Clock } from 'lucide-react'
import type { VoiceSessionResponse } from '@/store/slices/eveSlice'
import cleanNotes from '@/lib/cleanNotes'

interface NotesPanelProps {
  voiceSummaries: VoiceSessionResponse[]
}

const formatDate = (timestamp: string) =>
  new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

const NotesPanel: React.FC<NotesPanelProps> = ({ voiceSummaries }) => {
  const latestSummary = voiceSummaries.length > 0 ? voiceSummaries[0] : null

  return (
    <div className="h-full">
      <Card className="h-full bg-black/80 border border-gray-500 text-white shadow-md">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            {latestSummary ? 'Voice Summary' : 'Voice Summaries'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 h-full min-h-0 overflow-hidden">
            {latestSummary ? (
              <div className="space-y-4 overflow-hidden text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span>{formatDate(latestSummary.created_at)}</span>
                </div>
                <div className='max-h-[170px] overflow-y-auto'>
                  <h3 className="font-semibold text-gray-200 mb-1">Summary</h3>
                  <p className="text-gray-300 whitespace-pre-wrap">{cleanNotes(latestSummary.summary)}</p>

                  <h3 className="font-semibold text-gray-200 mt-3 mb-1">Full Notes</h3>
                  <p className="text-gray-300 whitespace-pre-wrap">{cleanNotes(latestSummary.notes_content)}</p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">
                <Bot className="h-8 w-8 mx-auto mb-2 text-gray-500" />
                <p className="text-sm">No voice summaries yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default NotesPanel