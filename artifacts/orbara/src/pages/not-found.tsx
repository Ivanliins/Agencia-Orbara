import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0d0101] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,_#ff5d0012,_transparent)] pointer-events-none" />
      <div className="relative z-10 text-center">
        <div
          className="font-black text-[#ff5d00] leading-none tracking-tight mb-2"
          style={{ fontSize: "clamp(6rem, 25vw, 20rem)" }}
        >
          404.
        </div>
        <div
          className="font-black text-[#fffafa] leading-none tracking-tight mb-12"
          style={{ fontSize: "clamp(2rem, 6vw, 6rem)" }}
        >
          Órbita perdida.
        </div>
        <p className="text-[#fffafa]/60 text-xl mb-12 font-medium">
          Esta página saiu da órbita e se perdeu no espaço.
        </p>
        <Link href="/">
          <span className="inline-block bg-[#ff5d00] text-[#0d0101] font-bold text-xl px-10 py-5 rounded-full hover:scale-105 transition-transform cursor-pointer shadow-lg shadow-[#ff5d00]/30">
            Voltar ao início →
          </span>
        </Link>
      </div>
    </div>
  );
}
