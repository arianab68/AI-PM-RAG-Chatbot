import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { Loader2, Target } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

const WEBHOOK_URL = 'https://arianab68.app.n8n.cloud/webhook/4a8cdb1e-dc63-4711-9d23-7d4e28257943';

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (userMessage: string) => {
    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      text: userMessage,
      isUser: true,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Prepend formatting instructions to ensure clean, visually structured responses
      const formattingInstructions = `Format all responses with clear visual structure using emojis and separators.

REQUIRED FORMAT:
🧭 OVERVIEW
Brief 2-3 sentence introduction to the topic.

💡 KEY ELEMENTS (or KEY POINTS)
• First Major Point
  - Supporting detail
  - Supporting detail

• Second Major Point
  - Supporting detail
  - Supporting detail

✅ SUMMARY (or TAKEAWAYS)
Brief conclusion or key takeaways.

FORMATTING RULES:
- Always use emoji headers: 🧭 OVERVIEW, 💡 KEY ELEMENTS/POINTS, 🎯 STEPS, ✅ SUMMARY/TAKEAWAYS, 📚 SOURCES
- Use bullet points with • for main items
- Use dashes - for sub-items (indent with 2 spaces)
- Add blank line after each emoji section header
- Keep paragraphs short (2-3 sentences)
- Add blank lines between major sections

User question: `;

      const fullMessage = formattingInstructions + userMessage;
      
      const response = await fetch(
        `${WEBHOOK_URL}?message=${encodeURIComponent(fullMessage)}`
      );

      if (!response.ok) {
        throw new Error('Failed to get response from webhook');
      }

      const data = await response.json();
      
      // Extract the output field from the JSON response
      let responseText = data.output || data.text || JSON.stringify(data);
      
      // Convert literal \n to actual line breaks
      responseText = responseText.replace(/\\n/g, '\n');

      // Heuristic formatting: add blank line after section headers ending with ':'
      // and turn "Title: description" lines into bullets if not already a list item.
      {
        const rawLines = responseText.split('\n');
        const withSpacing: string[] = [];
        for (let i = 0; i < rawLines.length; i++) {
          const line = rawLines[i];
          const next = rawLines[i + 1] ?? '';
          withSpacing.push(line);
          if (/:\s*$/.test(line) && next.trim() !== '') {
            withSpacing.push(''); // add blank line after headings
          }
        }
        const bulletized = withSpacing.map((l) => {
          // Skip if it's already a list item or empty
          if (/^\s*(?:[-*]|\d+\.)\s+/.test(l) || l.trim() === '') return l;
          // Don't bulletize section headers like "Key aspects include:"
          if (/include:\s*$/i.test(l)) return l;
          // Bulletize "Title: details" lines
          if (/^[A-Z][\w()\/'’`,&\-\s]{1,120}:\s+.+/.test(l)) return `- ${l}`;
          return l;
        });
        responseText = bulletized.join('\n');
      }

      // Add bot response
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        isUser: false,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error('Error calling webhook:', error);
      toast.error('Failed to get response. Please try again.');
      
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error processing your request.',
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10 shadow-[var(--shadow-sm)]">
        <div className="container max-w-4xl mx-auto px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[var(--shadow-md)]">
              <Target className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-foreground">AI Product Management Chatbot</h1>
              <p className="text-xs text-muted-foreground">Your intelligent PM companion</p>
            </div>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="container max-w-4xl mx-auto px-6 py-8">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-center">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-8 shadow-[var(--shadow-lg)]">
                <Target className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-semibold mb-3 text-foreground">
                Welcome to Your PM Assistant
              </h2>
              <p className="text-muted-foreground max-w-md text-[15px] leading-relaxed">
                I'm your product management assistant. Ask me anything you want to know about product management.
              </p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message.text}
                  isUser={message.isUser}
                />
              ))}
              {isLoading && (
                <div className="flex justify-start mb-6">
                  <div className="bg-card border border-border rounded-2xl px-6 py-4 flex items-center gap-3 shadow-[var(--shadow-sm)]">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </main>

      {/* Input Area */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm sticky bottom-0 shadow-[var(--shadow-sm)]">
        <div className="container max-w-4xl mx-auto px-6 py-5">
          <ChatInput onSend={handleSendMessage} disabled={isLoading} />
        </div>
      </footer>
    </div>
  );
};

export default Index;
