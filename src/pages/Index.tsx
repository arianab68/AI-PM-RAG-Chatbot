import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { Loader2, MessageSquare } from 'lucide-react';
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
      // Prepend formatting instructions to ensure clean markdown responses
      const formattingInstructions = `Always format your responses in a clear, easy-to-read way using markdown.

Formatting rules:
- Use **bold** or headings for key sections.
- Use bullet points (with - or *) or numbered lists when listing items.
- Add blank lines between paragraphs and list sections for readability.
- For lists under a heading, add a blank line after the heading before starting the list.
- Add a blank line between each major list item or section.
- Keep explanations concise and visually organized.
- End with a **Sources** section (if applicable), formatted as:
  
  **Sources**
  - source1.pdf
  - source2.pdf

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
              <MessageSquare className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-foreground">AI Assistant</h1>
              <p className="text-xs text-muted-foreground">Your intelligent workspace companion</p>
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
                <MessageSquare className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-semibold mb-3 text-foreground">
                Welcome to AI Assistant
              </h2>
              <p className="text-muted-foreground max-w-md text-[15px] leading-relaxed">
                Ask me anything about product management, strategy, or get help with your work.
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
