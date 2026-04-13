import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Compass, ArrowLeft, Send, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/use-user-data";
import { getAllUsers } from "@/hooks/use-user-data";
import { useMessages } from "@/hooks/use-messages";

export default function Inbox() {
  const { user } = useCurrentUser();
  const [searchParams, setSearchParams] = useSearchParams();
  const activePartnerId = searchParams.get("chat");
  const { getConversations, getThread, sendMessage, markRead, totalUnread } = useMessages(user?.id);
  const [newMsg, setNewMsg] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const allUsers = getAllUsers();

  const conversations = getConversations();
  const thread = activePartnerId ? getThread(activePartnerId) : [];
  const partner = activePartnerId ? allUsers.find((u) => u.id === activePartnerId) : null;

  useEffect(() => {
    if (activePartnerId && user) {
      markRead(activePartnerId);
    }
  }, [activePartnerId, user, markRead, thread.length]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [thread.length]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-xl font-bold text-foreground">Sign in to access your inbox</p>
          <Link to="/auth" className="text-primary hover:underline text-sm">Sign In →</Link>
        </div>
      </div>
    );
  }

  const handleSend = () => {
    if (!activePartnerId || !newMsg.trim()) return;
    sendMessage(activePartnerId, newMsg);
    setNewMsg("");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
            <div className="flex items-center gap-2">
              <Compass className="h-6 w-6 text-primary" />
              <span className="font-display text-xl font-bold text-foreground">Inbox</span>
            </div>
          </div>
          {totalUnread > 0 && (
            <span className="text-xs bg-destructive text-destructive-foreground rounded-full px-2 py-0.5">{totalUnread} unread</span>
          )}
        </div>
      </header>

      <div className="flex-1 flex container mx-auto max-w-4xl">
        {/* Conversation List */}
        <div className={`w-full md:w-80 border-r border-border bg-card overflow-y-auto ${activePartnerId ? "hidden md:block" : ""}`}>
          {conversations.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No messages yet</p>
              <p className="text-xs mt-1">Visit a traveler's profile to start chatting!</p>
            </div>
          ) : (
            conversations.map((convo) => {
              const p = allUsers.find((u) => u.id === convo.partnerId);
              if (!p) return null;
              const initials = p.username.slice(0, 2).toUpperCase();
              return (
                <button
                  key={convo.partnerId}
                  onClick={() => setSearchParams({ chat: convo.partnerId })}
                  className={`w-full flex items-center gap-3 p-4 border-b border-border hover:bg-secondary/50 transition-colors text-left ${
                    activePartnerId === convo.partnerId ? "bg-secondary" : ""
                  }`}
                >
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-foreground text-sm">{p.username}</p>
                      {convo.unreadCount > 0 && (
                        <span className="bg-destructive text-destructive-foreground text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">{convo.unreadCount}</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{convo.lastMessage.text}</p>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Chat Thread */}
        <div className={`flex-1 flex flex-col ${!activePartnerId ? "hidden md:flex" : ""}`}>
          {activePartnerId && partner ? (
            <>
              <div className="border-b border-border p-3 flex items-center gap-3 bg-card">
                <button onClick={() => setSearchParams({})} className="md:hidden text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                    {partner.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground text-sm">{partner.username}</p>
                  <p className="text-xs text-muted-foreground">{partner.bio?.slice(0, 40)}</p>
                </div>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                {thread.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-8">Start the conversation!</p>
                )}
                {thread.map((msg) => {
                  const isMine = msg.fromUserId === user.id;
                  return (
                    <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                        isMine
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-secondary text-secondary-foreground rounded-bl-md"
                      }`}>
                        <p>{msg.text}</p>
                        <p className={`text-[10px] mt-1 ${isMine ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-border p-3 bg-card">
                <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                  <Input
                    value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" disabled={!newMsg.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageCircle className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Select a conversation</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
