import React from "react";
import {
  AbsoluteFill,
  Sequence,
  Img,
  staticFile,
  useCurrentFrame,
  interpolate,
  Easing,
  useVideoConfig,
} from "remotion";
import { Video, Audio } from "@remotion/media";
import assets from "../public/assets.json";
import timeline from "./timeline.json";
import { Subtitles } from "./Subtitles";
import { openingHeadline, storyNotes, type StoryNote } from "./editorial";

type Clip = { src: string; start?: number; duration?: number; kind?: string };
const media = assets as {
  clips: Record<string, Clip>;
  audio: Record<string, string>;
  music: string | null;
};
const ease = Easing.bezier(0.2, 0.7, 0.2, 1);
const Badge = ({
  children,
  top = 32,
}: {
  children: React.ReactNode;
  top?: number;
}) => (
  <div
    style={{
      position: "absolute",
      right: 36,
      top,
      padding: "10px 18px",
      borderRadius: 24,
      background: "#0b1223e8",
      border: "1px solid #526077",
      fontSize: 18,
      color: "#e9efff",
      letterSpacing: 0.3,
    }}
  >
    {children}
  </div>
);
const Title = ({
  eyebrow,
  children,
}: {
  eyebrow: string;
  children: React.ReactNode;
}) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
    easing: ease,
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        bottom: 230,
        opacity: a,
        transform: `translateY(${(1 - a) * 20}px)`,
        maxWidth: 1220,
      }}
    >
      <div
        style={{
          color: "#94b3ff",
          fontSize: 20,
          letterSpacing: 3,
          marginBottom: 16,
        }}
      >
        {eyebrow}
      </div>
      <div
        style={{
          fontSize: 66,
          fontWeight: 650,
          lineHeight: 1.1,
          letterSpacing: -2,
          whiteSpace: "pre-line",
          textShadow: "0 3px 28px #000",
        }}
      >
        {children}
      </div>
    </div>
  );
};
const cameras: Record<string, { start: number; end: number; origin: string }> =
  {
    "graph-before": { start: 1.16, end: 1.36, origin: "60% 60%" },
    "graph-after": { start: 1.24, end: 1.38, origin: "60% 60%" },
    offer: { start: 1.12, end: 1.22, origin: "95% 54%" },
    policy: { start: 1.3, end: 1.46, origin: "96% 60%" },
    tool: { start: 1.3, end: 1.44, origin: "96% 60%" },
    replay: { start: 1.08, end: 1.17, origin: "68% 75%" },
  };
const Footage = ({
  id,
  duration,
  zoom = 1.02,
}: {
  id: string;
  duration: number;
  zoom?: number;
}) => {
  const f = useCurrentFrame();
  const c = media.clips[id];
  const camera = cameras[id];
  const scale = interpolate(
    f,
    [0, duration],
    [camera?.start ?? 1, camera?.end ?? zoom],
    {
      easing: ease,
      extrapolateRight: "clamp",
    },
  );
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#101722" }}>
      {c ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            transform: `scale(${scale})`,
            transformOrigin: camera?.origin ?? "center",
          }}
        >
          {c.kind === "image" ? (
            <Img
              src={staticFile(c.src)}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          ) : (
            <Video
              src={staticFile(c.src)}
              trimBefore={c.start ?? 0}
              muted
              objectFit="contain"
              style={{ width: "100%", height: "100%" }}
            />
          )}
        </div>
      ) : (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            color: "#9faac0",
            fontSize: 34,
          }}
        >
          Capture required · {id}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
const Highlight = ({
  x,
  y,
  w,
  h,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
}) => (
  <div
    style={{
      position: "absolute",
      left: `${x}%`,
      top: `${y}%`,
      width: `${w}%`,
      height: `${h}%`,
      border: "2px solid #8eafff",
      borderRadius: 12,
      boxShadow: "0 0 0 4000px #050a1433",
      pointerEvents: "none",
    }}
  />
);
const Lower = ({
  note,
  callDetail = false,
  context,
}: {
  note: StoryNote;
  callDetail?: boolean;
  context?: string;
}) => (
  <div
    data-editorial-note="true"
    style={{
      position: "absolute",
      left: callDetail ? undefined : note.results ? 40 : 50,
      right: callDetail ? 42 : undefined,
      bottom: callDetail ? 170 : 164,
      width: callDetail ? 490 : note.results ? 420 : 880,
      boxSizing: "border-box",
      zIndex: 1,
      background: "rgba(10, 18, 32, 0.96)",
      border: "1px solid #3d5069",
      borderLeft: "3px solid #91b3ec",
      borderRadius: 14,
      padding: "20px 24px",
      boxShadow: "0 8px 28px #0004",
    }}
  >
    {context && (
      <div
        style={{
          color: "#91b3ec",
          fontSize: 16,
          fontWeight: 650,
          letterSpacing: 0.4,
          marginBottom: 9,
        }}
      >
        {context}
      </div>
    )}
    <div style={{ fontSize: callDetail ? 25 : 28, fontWeight: 600, lineHeight: 1.24 }}>
      {note.title}
    </div>
    {note.detail && (
      <div
        style={{
          fontSize: callDetail ? 19 : 23,
          lineHeight: 1.42,
          color: "#c0cede",
          marginTop: 8,
        }}
      >
        {note.detail}
      </div>
    )}
    {note.results && (
      <div style={{ display: "grid", gap: 14, marginTop: 20 }}>
        {note.results.map((result) => (
          <div
            key={result.restaurant}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 4,
              fontSize: 22,
              lineHeight: 1.35,
            }}
          >
            <div style={{ color: result.color, fontWeight: 600 }}>
              {result.restaurant}
            </div>
            <div style={{ color: "#e4ebf5" }}>{result.explanation}</div>
          </div>
        ))}
      </div>
    )}
  </div>
);
function Contact({ simple = false }: { simple?: boolean }) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const step = simple ? 0 : t < 3 ? 0 : t < 7 ? 1 : t < 10 ? 2 : t < 13 ? 3 : 4;
  const cards = [
    {
      x: 140,
      name: "Voice",
      sub:
        step === 4
          ? "Continue contact within authorized terms"
          : "Restaurant contact",
    },
    { x: 1120, name: "Negotiation", sub: "Evaluate proposed terms" },
  ];
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 30% 35%,#192d57 0%,#0c1424 65%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 90,
          fontSize: 19,
          letterSpacing: 4,
          color: "#91b3ff",
        }}
      >
        DURING CONTACT
      </div>
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 145,
          fontSize: 54,
          fontWeight: 600,
          letterSpacing: -1,
        }}
      >
        {simple
          ? "Voice initiates the restaurant call"
          : "A decision that returns to the conversation"}
      </div>
      {cards.slice(0, simple ? 1 : 2).map((c, i) => (
        <div
          key={c.name}
          style={{
            position: "absolute",
            left: c.x,
            top: 440,
            width: 570,
            height: 180,
            border: `1px solid ${step === 2 && i === 1 ? "#7da6ff" : "#485f86"}`,
            borderRadius: 24,
            background: "#1b2940",
            padding: 36,
            boxSizing: "border-box",
          }}
        >
          <div style={{ fontSize: 40, fontWeight: 600 }}>{c.name}</div>
          <div style={{ fontSize: 21, color: "#a9bad6", marginTop: 14 }}>
            {c.sub}
          </div>
        </div>
      ))}
      <div
        style={{
          position: "absolute",
          left: 140,
          top: 290,
          fontSize: 28,
          color: "#c7d5ec",
        }}
      >
        Requested <b>21:00 ±30 min</b>　{simple ? "" : "·　Offered 22:30"}
      </div>
      {!simple && (
        <>
          <svg
            width="1920"
            height="1080"
            style={{ position: "absolute", inset: 0 }}
          >
            <defs>
              <marker
                id="direction"
                markerWidth="10"
                markerHeight="10"
                refX="8"
                refY="5"
                orient="auto"
              >
                <path
                  d="M0 0 L10 5 L0 10"
                  fill="none"
                  stroke="#8aa9dc"
                  strokeWidth="1.6"
                />
              </marker>
            </defs>
            <path
              markerEnd="url(#direction)"
              d="M 710 490 L 1120 490"
              stroke="#6483b6"
              strokeWidth="3"
            />
            <path
              markerEnd="url(#direction)"
              d="M 1120 580 C 1020 745 820 745 710 580"
              fill="none"
              stroke="#6483b6"
              strokeWidth="3"
            />
            {step === 1 && (
              <circle
                cx={710 + 410 * Math.min(1, (t - 3) / 4)}
                cy="490"
                r="9"
                fill="#98b5ff"
              />
            )}
            {step === 3 && (
              <circle
                cx={1120 - 410 * Math.min(1, (t - 10) / 3)}
                cy={580 + 100 * Math.sin(Math.min(1, (t - 10) / 3) * Math.PI)}
                r="10"
                fill="#84e0c0"
              />
            )}
          </svg>
          <div
            style={{
              position: "absolute",
              top: 380,
              left: 1130,
              fontSize: 27,
              color: "#94dfc4",
              opacity: step >= 2 ? 1 : 0,
            }}
          >
            90 min &gt; 30 min · Outside allowed window
          </div>
          <div
            style={{
              position: "absolute",
              top: 760,
              left: 530,
              fontSize: 32,
              color: "#9ee5cc",
              opacity: step >= 3 ? 1 : 0,
            }}
          >
            Decision returned → decline alternative
          </div>
        </>
      )}
      <Badge top={32}>Illustrative workflow · not a recorded event</Badge>
      <div
        style={{
          position: "absolute",
          left: 90,
          bottom: 175,
          color: "#8d9cb6",
          fontSize: 20,
        }}
      >
        Intended production interaction · no recorded conversation or provider
        delegation shown
      </div>
    </AbsoluteFill>
  );
}
/** One recorded owner-authorized test call, separate from the three-contact demo. */
const SuccessfulCallDetail = ({
  phase,
  caption,
}: {
  phase: "replay" | "confirmation";
  caption?: StoryNote;
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const duration = (phase === "replay" ? 9 : 11) * fps;
  const scale = interpolate(
    f,
    [0, duration],
    phase === "replay" ? [1, 1.055] : [1.045, 1.08],
    { easing: ease, extrapolateRight: "clamp" },
  );
  const focus = (x: number, y: number, w: number, h: number) => (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        border: "3px solid #8eafff",
        borderRadius: 11,
        boxShadow: "0 0 0 4px #8eafff38, 0 0 28px #6e9dff77",
        pointerEvents: "none",
      }}
    />
  );
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#0b1019" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${scale})`,
          transformOrigin: phase === "replay" ? "65% 72%" : "78% 33%",
        }}
      >
        <Img
          src={staticFile("review/successful-call-detail.png")}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
        {phase === "replay" ? (
          <>
            {focus(275, 796, 1250, 51)}
            {focus(1077, 544, 448, 64)}
          </>
        ) : (
          <>
            {focus(1654, 155, 190, 53)}
            {focus(1077, 544, 448, 64)}
          </>
        )}
      </div>
      {caption && (
        <Lower
          note={caption}
          callDetail
          context={
            phase === "confirmation"
              ? "NARRATED EXAMPLE · SEPARATE SIMULATION"
              : "RECORDED TEST CALL · READ-ONLY REPLAY"
          }
        />
      )}
    </AbsoluteFill>
  );
};
function ClipScene({
  id,
  seconds,
  caption,
  zoom = 1.025,
}: {
  id: string;
  seconds: number;
  caption?: StoryNote;
  zoom?: number;
}) {
  const { fps } = useVideoConfig();
  if (id === "replay" || id === "confirmation") {
    return <SuccessfulCallDetail phase={id} caption={caption} />;
  }
  return (
    <>
      <Footage id={id} duration={seconds * fps} zoom={zoom} />
      {caption && <Lower note={caption} />}
    </>
  );
}
const shots = [
  {
    from: 0,
    to: 20,
    id: "opening",
  },
  {
    from: 20,
    to: 31,
    id: "selection",
  },
  {
    from: 31,
    to: 39,
    id: "configuration",
  },
  {
    from: 46,
    to: 60,
    id: "outcome",
  },
  {
    from: 60,
    to: 74,
    id: "history",
  },
  {
    from: 74,
    to: 85,
    id: "history-filtered",
  },
  {
    from: 85,
    to: 96,
    id: "graph-before",
  },
  {
    from: 111,
    to: 121,
    id: "graph-after",
  },
  {
    from: 121,
    to: 130,
    id: "graph-return",
  },
  {
    from: 130,
    to: 140,
    id: "offer",
  },
  {
    from: 140,
    to: 147,
    id: "policy",
  },
  {
    from: 147,
    to: 155,
    id: "tool",
  },
  {
    from: 155,
    to: 164,
    id: "replay",
  },
  {
    from: 164,
    to: 175,
    id: "confirmation",
  },
  {
    from: 175,
    to: 182,
    id: "analytics",
  },
  {
    from: 182,
    to: 185,
    id: "playground",
  },
  {
    from: 185,
    to: 190,
    id: "playground-result",
  },
  { from: 190, to: 195, id: "closing" },
];
function PlaybackOverlays() {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#071020",
          opacity: Math.max(
            ...[60, 85, 130, 175].map((t) =>
              Math.max(0, 1 - Math.abs(f - t * fps) / (fps / 5)),
            ),
          ),
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#071020",
          opacity: interpolate(
            f,
            [0, 0.4 * fps, 194.6 * fps, 195 * fps - 1],
            [1, 0, 0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          ),
          pointerEvents: "none",
        }}
      />
      <Badge
        top={
          (f >= 96 * fps && f < 111 * fps) || (f >= 39 * fps && f < 46 * fps)
            ? 86
            : 32
        }
      >
        {f >= 155 * fps && f < 175 * fps
          ? "Recorded real test call · owner-authorized number"
          : "Demo Environment · Simulated data"}
      </Badge>
    </>
  );
}

export function Demo() {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill
      style={{
        background: "#0c1424",
        color: "#f2f5ff",
        fontFamily: "Inter,Segoe UI,Arial,sans-serif",
      }}
    >
      {shots.map((s) => (
        <Sequence
          key={s.id}
          name={storyNotes[s.id]?.title ?? s.id}
          from={s.from * fps}
          durationInFrames={(s.to - s.from) * fps}
        >
          <ClipScene
            id={s.id}
            seconds={s.to - s.from}
            caption={storyNotes[s.id]}
          />
          {s.id === "opening" && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(0deg,#061027e8,transparent 80%)",
              }}
            />
          )}
          {s.id === "opening" && (
            <Title eyebrow="AI RESTAURANT BOOKER">{openingHeadline}</Title>
          )}
          {s.id === "closing" && (
            <AbsoluteFill
              style={{
                background: "#071021ce",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: 62, fontWeight: 650 }}>
                AI Restaurant Booker
              </div>
              <div style={{ fontSize: 29, color: "#b6c7e6", marginTop: 24 }}>
                A simple experience. An inspectable execution.
              </div>
            </AbsoluteFill>
          )}
        </Sequence>
      ))}
      <Sequence
        name="Voice starts contact"
        from={39 * fps}
        durationInFrames={7 * fps}
      >
        <Contact simple />
      </Sequence>
      <Sequence
        name="Voice delegates and receives a decision"
        from={96 * fps}
        durationInFrames={15 * fps}
      >
        <Contact />
      </Sequence>
      {timeline.map((s, i) =>
        media.audio[String(i + 1)] ? (
          <Sequence
            key={i}
            from={(s.start + (s.audioOffset ?? 0)) * fps + Math.round(fps / 3)}
            durationInFrames={
              (s.duration - (s.audioOffset ?? 0)) * fps - Math.round(fps / 3)
            }
          >
            <Audio src={staticFile(media.audio[String(i + 1)])} />
          </Sequence>
        ) : null,
      )}
      {media.music && <Audio src={staticFile(media.music)} volume={0.06} />}
      <PlaybackOverlays />
      <Subtitles />
    </AbsoluteFill>
  );
}
