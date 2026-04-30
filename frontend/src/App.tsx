import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./App.css";
import { streamChat } from "./api/chat";
import type { ChatMessage } from "./types/chat";

const TYPE_SPEED = 18;
// 数字越小，输出越快。
// 18 大概是比较自然的逐字输出；
// 想更快可以改成 8 或 10；
// 想更慢可以改成 30。

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeMarkdown(text: string) {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/^\s*(\d+)\.\s*\n+\s*/gm, "$1. ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: createId(),
      role: "assistant",
      content:
        "你好，我是智扫通机器人智能客服。你可以问我扫地机器人选购、故障排查、维护保养等问题。",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatBoxRef = useRef<HTMLDivElement | null>(null);

  // 打字机队列：后端返回的 chunk 会被拆成一个个字放进这里
  const typingQueueRef = useRef<string[]>([]);

  // 打字机定时器
  const typingTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (typingTimerRef.current !== null) {
        window.clearInterval(typingTimerRef.current);
      }
    };
  }, []);

  function scrollToBottom() {
    requestAnimationFrame(() => {
      chatBoxRef.current?.scrollTo({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  }

  function stopTyping() {
    typingQueueRef.current = [];

    if (typingTimerRef.current !== null) {
      window.clearInterval(typingTimerRef.current);
      typingTimerRef.current = null;
    }
  }

  function waitForTypingDone() {
    return new Promise<void>((resolve) => {
      const timer = window.setInterval(() => {
        if (
          typingQueueRef.current.length === 0 &&
          typingTimerRef.current === null
        ) {
          window.clearInterval(timer);
          resolve();
        }
      }, 30);
    });
  }

  function pushTypingText(text: string, assistantMessageId: string) {
    typingQueueRef.current.push(...Array.from(text));

    if (typingTimerRef.current !== null) {
      return;
    }

    typingTimerRef.current = window.setInterval(() => {
      const nextChar = typingQueueRef.current.shift();

      if (nextChar === undefined) {
        if (typingTimerRef.current !== null) {
          window.clearInterval(typingTimerRef.current);
          typingTimerRef.current = null;
        }
        return;
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content: msg.content + nextChar,
              }
            : msg
        )
      );

      scrollToBottom();
    }, TYPE_SPEED);
  }

  async function handleSend() {
    const text = input.trim();

    if (!text || loading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: createId(),
      role: "user",
      content: text,
    };

    const assistantMessageId = createId();

    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput("");
    setLoading(true);
    scrollToBottom();

    try {
      await streamChat(text, (chunk) => {
        pushTypingText(chunk, assistantMessageId);
      });

      await waitForTypingDone();
    } catch (error) {
      console.error(error);

      stopTyping();

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content: "抱歉，智能客服暂时出错了，请稍后再试。",
              }
            : msg
        )
      );
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>智扫通机器人智能客服</h1>
          <p>扫地机器人选购、故障排查、维护保养智能问答</p>
        </div>
      </header>

      <main className="chat-box" ref={chatBoxRef}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message-row ${
              message.role === "user" ? "user-row" : "assistant-row"
            }`}
          >
            <div className={`message ${message.role}`}>
              {message.content ? (
                message.role === "assistant" ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {normalizeMarkdown(message.content)}
                  </ReactMarkdown>
                ) : (
                  message.content
                )
              ) : (
                "正在思考中..."
              )}
            </div>
          </div>
        ))}
      </main>

      <footer className="input-area">
        <textarea
          value={input}
          disabled={loading}
          placeholder="请输入你的问题，例如：扫地机器人不出水怎么办？"
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button disabled={loading || !input.trim()} onClick={handleSend}>
          {loading ? "思考中" : "发送"}
        </button>
      </footer>
    </div>
  );
}

export default App;