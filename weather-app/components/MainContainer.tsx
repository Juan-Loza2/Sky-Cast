import React, { ReactNode } from "react";

export default function MainContainer({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-sm mx-auto bg-cover bg-center bg-no-repeat rounded-t-3xl min-h-screen" style={{ backgroundImage: 'url("/fondo-clima.png")' }}>
      {children}
    </div>
  );
} 