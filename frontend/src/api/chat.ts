const API_BASE_URL = "http://127.0.0.1:8000";

export async function streamChat(
  message: string,
  onChunk: (chunk: string) => void
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/chat/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok || !response.body) {
    throw new Error("请求智能客服失败");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  while (true) {
    const { value, done } = await reader.read();

    if (done) {
      break;
    }

    const chunk = decoder.decode(value, { stream: true });
    onChunk(chunk);
  }
}