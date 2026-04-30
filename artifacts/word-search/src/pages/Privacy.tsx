import { LegalPage } from "../components/LegalPage";

export default function Privacy() {
  return (
    <LegalPage title="Privacy Policy" updated="April 30, 2026">
      <p>
        Daily Word Search ("we", "our", "the site") is committed to protecting your privacy.
        This page explains what information the site does and does not collect when you play at
        <strong> dailywordsearch.fun</strong>.
      </p>

      <h2 className="text-xl font-black mt-6 mb-2">The short version</h2>
      <p>
        We do not collect, store, or transmit any personal information. There is no signup,
        no login, and no tracking cookies. Everything happens in your browser.
      </p>

      <h2 className="text-xl font-black mt-6 mb-2">What we store on your device</h2>
      <p>
        To make the game work, we save a small amount of data in your browser&apos;s
        <strong> localStorage</strong>. This data never leaves your device. It includes:
      </p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Your best times for each theme and difficulty.</li>
        <li>Your current and longest daily-challenge streaks.</li>
        <li>The history of which daily challenges you have completed (date and time only).</li>
        <li>Your most recent theme and difficulty selection.</li>
      </ul>
      <p>
        You can clear this data at any time by clearing your browser&apos;s site data for
        dailywordsearch.fun. Doing so will reset your stats and streaks.
      </p>

      <h2 className="text-xl font-black mt-6 mb-2">Cookies and tracking</h2>
      <p>
        The site does not set any tracking or advertising cookies. We do not use Google
        Analytics, Facebook Pixel, or any other third-party analytics or advertising service.
      </p>

      <h2 className="text-xl font-black mt-6 mb-2">Hosting</h2>
      <p>
        The site is a static web application served by Cloudflare Pages. Like any web request,
        Cloudflare may temporarily process standard request information (such as your IP
        address and user agent) for security and reliability purposes, as described in
        Cloudflare&apos;s own privacy policy. We do not have access to or store this
        information ourselves.
      </p>

      <h2 className="text-xl font-black mt-6 mb-2">Third-party fonts</h2>
      <p>
        The site loads display fonts from Google Fonts. Google may receive standard request
        information when those font files are fetched, as described in their privacy policy.
      </p>

      <h2 className="text-xl font-black mt-6 mb-2">Children&apos;s privacy</h2>
      <p>
        The site is suitable for all ages. Because we do not collect any personal information
        from anyone, we do not knowingly collect information from children under 13.
      </p>

      <h2 className="text-xl font-black mt-6 mb-2">Changes to this policy</h2>
      <p>
        If this policy ever changes, the updated date at the top of this page will reflect
        when the change was made.
      </p>

      <h2 className="text-xl font-black mt-6 mb-2">Contact</h2>
      <p>
        Questions about this privacy policy? Reach us through the contact information on the
        <a href="/about" className="text-primary font-bold hover:underline"> About</a> page.
      </p>
    </LegalPage>
  );
}
