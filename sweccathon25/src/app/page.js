'use client';


export default function Home() {
  return (
    <div>
      <div
        style={{
          width: "100%",
          height: "600px",
          backgroundImage: "url(/etst.svg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "fixed",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            display: "flex",
            border: "2px solid #9FC9A5",
            borderRadius: "999px",
            overflow: "hidden",
            backgroundColor: "#faf4f0",
            boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
          }}
        >
          <a
            href="/login"
            style={{
              padding: "12px 24px",
              color: "#383838",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Login
          </a>
          <a
            href="/signup"
            style={{
              padding: "12px 24px",
              color: "#383838",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Sign Up
          </a>
        </div>

        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#FAF4F0",
            textAlign: "center",
            padding: "20px",
            backdropFilter: "blur(6px)",
            textShadow: "rgba(0, 0, 0, 0.25)",
          }}
        >
          <h1 style={{ fontSize: "48px", margin: 0 }}>
            Missed the U District Food Walk?
          </h1>
          <h2 style={{ fontSize: "24px", marginTop: "12px" }}>
            <a href="/register" style={{ color: "#9FC9A5", textDecoration: "none" }}>
              Join us
            </a>{" "}
            on this journey to take you back!
          </h2>
        </div>
      </div>
    </div>
  );
}
