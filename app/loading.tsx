export default function Loading() {
  return (
    <main className="page-loader" aria-label="Loading OneStep Dream Property">
      <div className="loader-mark" aria-hidden="true">
        <svg viewBox="0 0 96 96" role="img" focusable="false">
          <defs>
            <linearGradient id="loaderGradient" x1="15" y1="16" x2="82" y2="82" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0874d1" />
              <stop offset="1" stopColor="#22a447" />
            </linearGradient>
          </defs>
          <rect x="6" y="6" width="84" height="84" rx="26" fill="white" />
          <path d="M23 43 48 22l25 21v27H23V43Z" fill="url(#loaderGradient)" opacity=".14" />
          <path d="m23 43 25-21 25 21" fill="none" stroke="url(#loaderGradient)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="6" />
          <path d="M31 41v25h34V41M42 66V49h12v17" fill="none" stroke="url(#loaderGradient)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" />
          <path d="M20 73h56" stroke="#0874d1" strokeLinecap="round" strokeWidth="5" />
        </svg>
      </div>
      <p className="loader-wordmark"><span>odp</span><span>Loading your next move</span></p>
      <div className="loader-track" aria-hidden="true"><span /></div>
    </main>
  )
}
