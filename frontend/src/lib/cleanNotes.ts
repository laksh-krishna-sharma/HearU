/**
 * Cleans notes content by removing markdown formatting and special characters
 * @param notes - The raw notes content to clean
 * @returns Cleaned notes content
 */
const cleanNotes = (notes: string): string => {
  if (!notes) return ''
  
  return notes
    // Remove markdown bold/italic asterisks and underscores
    .replace(/\*{1,3}(.*?)\*{1,3}/g, '$1')
    .replace(/_{1,3}(.*?)_{1,3}/g, '$1')
    
    // Remove markdown headers
    .replace(/^#{1,6}\s+/gm, '')
    
    // Remove markdown links [text](url) -> text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    
    // Remove markdown code blocks
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    
    // Remove markdown lists (bullets and numbers)
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    
    // Remove markdown blockquotes
    .replace(/^\s*>\s+/gm, '')
    
    // Remove markdown horizontal rules
    .replace(/^[-*_]{3,}$/gm, '')
    
    // Remove extra whitespace and line breaks
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^\s+|\s+$/g, '')
    
    // Remove other special characters if needed
    .replace(/[~`!@#$%^&()+=[\]{}|\\:";'<>?,./]/g, '')
    
    // Clean up multiple spaces
    .replace(/\s{2,}/g, ' ')
    .trim()
}

export default cleanNotes

// Alternative version with more aggressive cleaning
export const cleanNotesAggressive = (notes: string): string => {
  if (!notes) return ''
  
  return notes
    // Remove all markdown and special formatting
    .replace(/[*_`~#[\](){}]/g, '')
    
    // Remove URLs
    .replace(/https?:\/\/[^\s]+/g, '')
    
    // Remove email addresses
    .replace(/\S+@\S+\.\S+/g, '')
    
    // Keep only alphanumeric, spaces, and basic punctuation
    .replace(/[^a-zA-Z0-9\s.,!?;:'"()-]/g, ' ')
    
    // Clean up whitespace
    .replace(/\s{2,}/g, ' ')
    .replace(/\n{2,}/g, '\n')
    .trim()
}

// Usage example for the NotesPanel component:
export const cleanNotesForDisplay = (notes: string): string => {
  return cleanNotes(notes)
}