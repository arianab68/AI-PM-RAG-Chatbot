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
- Use bullet points or numbered lists when listing items.
- Add blank lines between paragraphs for readability.
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
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">AI Assistant</h1>
              <p className="text-sm text-muted-foreground">Ask me anything</p>
            </div>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="container max-w-4xl mx-auto px-4 py-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6">
                <MessageSquare className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-semibold mb-2 text-foreground">
                Welcome to AI Assistant
              </h2>
              <p className="text-muted-foreground max-w-md">
                Start a conversation by typing your message below. I'm here to help!
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
                <div className="flex justify-start mb-4">
                  <div className="bg-muted rounded-2xl px-4 py-3 flex items-center gap-2">
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
      <footer className="border-t border-border bg-card">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <ChatInput onSend={handleSendMessage} disabled={isLoading} />
        </div>
      </footer>
    </div>
  );
};

export default Index;
