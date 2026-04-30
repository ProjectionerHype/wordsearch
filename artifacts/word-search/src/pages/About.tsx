import { LegalPage } from "../components/LegalPage";

export default function About() {
  return (
    <LegalPage title="About">
      <p>
        <strong>Daily Word Search</strong> is a free, ad-free, sign-up-free word search
        puzzle game. A new daily challenge unlocks every day at midnight UTC, and you can
        also generate unlimited custom puzzles across nine themes and three difficulty
        levels.
      </p>

      <h2 className="text-xl font-black mt-6 mb-2">What you get</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          <strong>Daily Challenge:</strong> One puzzle per day, the same for everyone in the
          world. Compare your time with friends.
        </li>
        <li>
          <strong>Mix &amp; 8 themes:</strong> Animals, Fruits, Countries, Sports, Space,
          Music, Tech, Nature — plus a Mix mode that pulls from all of them.
        </li>
        <li>
          <strong>Three difficulty levels:</strong> from a friendly 8×8 grid up to a 15×15
          grid with words running in all 8 directions.
        </li>
        <li>
          <strong>Stats &amp; streaks:</strong> Track your daily streak, average solve time,
          and personal bests — all stored locally on your device.
        </li>
      </ul>

      <h2 className="text-xl font-black mt-6 mb-2">Privacy first</h2>
      <p>
        No accounts, no tracking, no ads. Your stats live in your browser and never leave it.
        See the <a href="/privacy" className="text-primary font-bold hover:underline">Privacy Policy</a> for details.
      </p>

      <h2 className="text-xl font-black mt-6 mb-2">Built with</h2>
      <p>
        The site is a small static web app built with React, Vite and Tailwind CSS, hosted
        on Cloudflare Pages.
      </p>

      <h2 className="text-xl font-black mt-6 mb-2">Contact</h2>
      <p>
        Found a bug, have a theme suggestion, or just want to say hi? Open an issue on the
        project&apos;s feedback channel — or send a note to the email address listed on the
        site&apos;s public repository. Replies may take a little while since this is a hobby
        project.
      </p>
    </LegalPage>
  );
}
