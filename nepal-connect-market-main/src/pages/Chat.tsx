import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, MessageCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const Chat = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [threads, setThreads] = useState<any[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(searchParams.get('thread'));
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [threadDetails, setThreadDetails] = useState<any>(null);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchThreads();
  }, [user]);

  useEffect(() => {
    if (selectedThreadId) {
      fetchMessages();
      fetchThreadDetails();
      markMessagesAsSeen();

      const channel = supabase
        .channel(`messages-${selectedThreadId}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `thread_id=eq.${selectedThreadId}`,
        }, (payload) => {
          setMessages(prev => [...prev, payload.new]);
          // Mark as seen if it's from the other user
          if ((payload.new as any).sender_id !== user?.id) {
            supabase.from('chat_messages').update({ seen: true }).eq('id', (payload.new as any).id).then();
          }
        })
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
  }, [selectedThreadId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchThreads = async () => {
    if (!user) return;
    let query = supabase
      .from('chat_threads')
      .select('*, ads(title, images)')
      .order('updated_at', { ascending: false });
    
    if (!isAdmin) {
      query = query.or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`);
    }
    const { data } = await query;
    const threadList: any[] = data || [];
    setThreads(threadList);

    // Fetch unread counts and other user names
    for (const t of threadList) {
      const otherUserId = t.buyer_id === user.id ? t.seller_id : t.buyer_id;
      
      // Get unread count
      const { count } = await supabase
        .from('chat_messages')
        .select('*', { count: 'exact', head: true })
        .eq('thread_id', t.id)
        .eq('seen', false)
        .neq('sender_id', user.id);
      
      setUnreadCounts(prev => ({ ...prev, [t.id]: count || 0 }));

      // Get other user's name
      const { data: profile } = await supabase.from('profiles').select('full_name').eq('user_id', otherUserId).single();
      t._otherName = profile?.full_name || 'User';
      
      // Check if other user is admin
      const { data: roles } = await supabase.from('user_roles').select('role').eq('user_id', otherUserId);
      t._isAdminChat = roles?.some((r: any) => r.role === 'admin') || false;
    }
    setThreads([...threadList]);
  };

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('thread_id', selectedThreadId)
      .order('created_at', { ascending: true });
    setMessages(data || []);
  };

  const markMessagesAsSeen = async () => {
    if (!user || !selectedThreadId) return;
    await supabase
      .from('chat_messages')
      .update({ seen: true })
      .eq('thread_id', selectedThreadId)
      .neq('sender_id', user.id)
      .eq('seen', false);
    setUnreadCounts(prev => ({ ...prev, [selectedThreadId!]: 0 }));
  };

  const fetchThreadDetails = async () => {
    const { data } = await supabase
      .from('chat_threads')
      .select('*, ads(title, images)')
      .eq('id', selectedThreadId)
      .single();
    if (data) {
      const otherUserId = data.buyer_id === user?.id ? data.seller_id : data.buyer_id;
      const { data: profile } = await supabase.from('profiles').select('full_name').eq('user_id', otherUserId).single();
      const { data: roles } = await supabase.from('user_roles').select('role').eq('user_id', otherUserId);
      const isOtherAdmin = roles?.some((r: any) => r.role === 'admin') || false;
      setThreadDetails({ ...data, otherName: profile?.full_name || 'User', isOtherAdmin });
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !user || !selectedThreadId) return;
    const text = message.trim();
    setMessage('');
    await supabase.from('chat_messages').insert({
      thread_id: selectedThreadId,
      sender_id: user.id,
      content: text,
    });
    await supabase.from('chat_threads').update({ updated_at: new Date().toISOString() }).eq('id', selectedThreadId);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!user) return null;

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Thread list */}
      <div className={`w-full border-r border-border md:w-80 ${selectedThreadId ? 'hidden md:block' : ''}`}>
        <div className="border-b border-border p-4">
          <h2 className="font-display text-lg font-bold flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" /> Messages
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">{threads.length} conversations</p>
        </div>
        <div className="overflow-y-auto h-[calc(100%-5rem)]">
          {threads.length === 0 ? (
            <div className="p-6 text-center">
              <MessageCircle className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No conversations yet</p>
              <p className="text-xs text-muted-foreground mt-1">Start chatting by visiting an ad and clicking "Chat with Seller"</p>
            </div>
          ) : (
            threads.map((t) => {
              const adTitle = t.ads?.title || 'Deleted Ad';
              const adImage = t.ads?.images?.[0] || '/placeholder.svg';
              const unread = unreadCounts[t.id] || 0;
              return (
                <button key={t.id} onClick={() => setSelectedThreadId(t.id)}
                  className={`flex w-full items-center gap-3 border-b border-border p-4 text-left transition-colors hover:bg-muted/50 ${
                    selectedThreadId === t.id ? 'bg-accent' : ''}`}>
                  <img src={adImage} alt="" className="h-12 w-12 rounded-lg object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }} />
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-medium truncate">{t._otherName || 'User'}</p>
                      {t._isAdminChat && <Shield className="h-3 w-3 text-primary shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{adTitle}</p>
                    <p className="text-[10px] text-muted-foreground">{new Date(t.updated_at).toLocaleDateString()}</p>
                  </div>
                  {unread > 0 && (
                    <Badge className="bg-primary text-primary-foreground border-0 h-5 min-w-[20px] p-0 flex items-center justify-center text-[10px] shrink-0">
                      {unread}
                    </Badge>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className={`flex flex-1 flex-col ${!selectedThreadId ? 'hidden md:flex' : ''}`}>
        {selectedThreadId && threadDetails ? (
          <>
            <div className="flex items-center gap-3 border-b border-border p-4">
              <button className="md:hidden" onClick={() => setSelectedThreadId(null)}>
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-medium">{threadDetails.otherName}</p>
                  {threadDetails.isOtherAdmin && (
                    <Badge className="bg-primary/10 text-primary border-0 text-[10px] gap-0.5">
                      <Shield className="h-2.5 w-2.5" /> Admin
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{threadDetails.ads?.title || 'Chat'}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="mx-auto max-w-lg space-y-3">
                {messages.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <MessageCircle className="mx-auto mb-2 h-8 w-8" />
                    <p className="text-sm">No messages yet. Say hello! 👋</p>
                  </div>
                )}
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                      msg.sender_id === user.id
                        ? 'rounded-tr-sm bg-gradient-hero text-primary-foreground'
                        : 'rounded-tl-sm bg-muted'
                    }`}>
                      {msg.content}
                      <div className={`mt-1 flex items-center gap-1 text-[10px] ${msg.sender_id === user.id ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {msg.sender_id === user.id && (
                          <span>{msg.seen ? '✓✓' : '✓'}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="border-t border-border p-4">
              <div className="flex gap-2">
                <Input placeholder="Type a message..." value={message}
                  onChange={(e) => setMessage(e.target.value)} onKeyDown={handleKeyPress} className="flex-1" />
                <Button size="icon" onClick={sendMessage} disabled={!message.trim()} className="shrink-0 bg-gradient-hero text-primary-foreground">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center text-muted-foreground gap-2">
            <MessageCircle className="h-12 w-12" />
            <p className="font-medium">Select a conversation</p>
            <p className="text-xs">Choose a chat from the list to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
