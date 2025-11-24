import { useEffect, useState } from "react";

type LocalQuote = {
  content: string;
  author: string;
};

//To do move quotes from array to db and sync with an api
const QUOTES: LocalQuote[] = [
  {
    content: "Slow is smooth. Smooth is fast.",
    author: "Navy SEAL Saying",
  },
  {
    content: "You don’t rise to the level of your goals. You fall to the level of your systems.",
    author: "James Clear",
  },
  {
    content: "Discipline is just choosing between what you want now and what you want most.",
    author: "Abraham Lincoln (attributed)",
  },
  {
    content: "Action may not always bring happiness, but there is no happiness without action.",
    author: "William James",
  },
  {
    content: "It always seems impossible until it’s done.",
    author: "Nelson Mandela",
  },
  {
    content: "The way you do anything is the way you do everything.",
    author: "Martha Beck",
  },
  {
    content: "You become what you repeatedly do when no one is watching.",
    author: "Unknown",
  },
  {
    content: "Success is the sum of small efforts, repeated day in and day out.",
    author: "Robert Collier",
  },
  {
    content: "If it’s important, you’ll make the time. If not, you’ll make an excuse.",
    author: "Unknown",
  },
  {
    content: "You’re only one decision away from a totally different life.",
    author: "Unknown",
  },
];

const UNSPLASH_ACCESS_KEY = "<unsplashkey>"; // your Unsplash access key here

function getRandomQuote(): LocalQuote {
  const idx = Math.floor(Math.random() * QUOTES.length);
  return QUOTES[idx];
}

function App() {
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);
  const [quote, setQuote] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [debugMessage, setDebugMessage] = useState<string | null>(null);

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  async function fetchImage() {
    try {
      const url = `https://api.unsplash.com/photos/random?orientation=landscape&query=zen,calm,nature&client_id=${UNSPLASH_ACCESS_KEY}`;
      const unsplashRes = await fetch(url);

      if (!unsplashRes.ok) {
        const body = await unsplashRes.text();
        setDebugMessage(`Unsplash error ${unsplashRes.status}: ${body.slice(0, 120)}`);
        throw new Error(`Unsplash failed: ${unsplashRes.status}`);
      }

      const unsplashJson = await unsplashRes.json();
      const imgUrl = unsplashJson.urls?.regular || unsplashJson.urls?.full || null;

      if (!imgUrl) {
        setDebugMessage("Unsplash response missing urls.*");
      }

      setBackgroundUrl(imgUrl);
    } catch (err: any) {
      console.error("Unsplash fetch failed:", err);
      if (!debugMessage) {
        setDebugMessage("Background image failed to load. Using gradient only.");
      }
    }
  }

  async function refresh() {
    setLoading(true);
    setError(null);
    setDebugMessage(null);

    // local quote — no network, never fails
    const q = getRandomQuote();
    setQuote(q.content);
    setAuthor(q.author);

    // try to get image (non-fatal)
    await fetchImage();

    setLoading(false);
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="app-root"
      style={{
        minHeight: "100vh",
        width: "100vw",
        overflow: "hidden",
        backgroundColor: "#020617",
        color: "white",
        position: "relative",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* Background image (optional) */}
      {backgroundUrl && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${backgroundUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.35)",
            zIndex: 0,
          }}
        />
      )}

      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at top left, rgba(56,189,248,0.35), transparent 55%), radial-gradient(circle at bottom right, rgba(168,85,247,0.35), transparent 55%)",
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "2.5rem 1.5rem",
        }}
      >
        {/* Top bar */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div>
            <div
              style={{
                opacity: 0.7,
                fontSize: "0.85rem",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
              }}
            >
              Today&apos;s Energy
            </div>
            <div style={{ fontSize: "1.1rem", fontWeight: 500 }}>{today}</div>
          </div>

          <button
            onClick={refresh}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "9999px",
              border: "1px solid rgba(148,163,184,0.7)",
              backgroundColor: "rgba(15,23,42,0.7)",
              color: "white",
              fontSize: "0.85rem",
              cursor: "pointer",
              backdropFilter: "blur(10px)",
            }}
          >
            Shuffle Vibe ↻
          </button>
        </header>

        {/* Center quote card */}
        <main
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            marginTop: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              maxWidth: "780px",
              width: "100%",
              padding: "2rem 2.5rem",
              borderRadius: "1.5rem",
              backgroundColor: "rgba(15,23,42,0.82)",
              border: "1px solid rgba(148,163,184,0.55)",
              boxShadow: "0 24px 80px rgba(15,23,42,0.9)",
              backdropFilter: "blur(18px)",
            }}
          >
            {loading ? (
              <div style={{ opacity: 0.8 }}>Loading today&apos;s quote...</div>
            ) : error ? (
              <div style={{ color: "#fca5a5" }}>{error}</div>
            ) : (
              <>
                <div
                  style={{
                    fontSize: "0.8rem",
                    opacity: 0.75,
                    textTransform: "uppercase",
                    letterSpacing: "0.18em",
                  }}
                >
                  Daily Quote
                </div>
                <div
                  style={{
                    fontSize: "1.6rem",
                    marginTop: "0.75rem",
                    lineHeight: 1.4,
                    fontWeight: 500,
                  }}
                >
                  “{quote}”
                </div>
                <div
                  style={{
                    marginTop: "0.75rem",
                    fontSize: "0.95rem",
                    opacity: 0.85,
                    fontStyle: "italic",
                  }}
                >
                  — {author || "Unknown"}
                </div>

                {debugMessage && (
                  <div
                    style={{
                      marginTop: "1rem",
                      fontSize: "0.75rem",
                      opacity: 0.7,
                    }}
                  >
                    <strong>Debug:</strong> {debugMessage}
                  </div>
                )}
              </>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            fontSize: "0.8rem",
            opacity: 0.8,
          }}
        >
          <div>Powered by Local Quotes & Unsplash</div>
          <div style={{ textAlign: "right" }}>v1 • Personal Zen Wall</div>
        </footer>
      </div>
    </div>
  );
}

export default App;
