import { LegalPage } from "../components/LegalPage";

export default function Terms() {
  return (
    <LegalPage title="Terms of Service" updated="April 30, 2026">
      <p>
        These Terms of Service ("Terms") govern your use of <strong>dailywordsearch.fun</strong>
        (the "site"). By using the site, you agree to these Terms. If you do not agree, please
        do not use the site.
      </p>

      <h2 className="text-xl font-black mt-6 mb-2">The service</h2>
      <p>
        The site is a free, browser-based word search game. There is no account, no payment,
        and no purchase required. The site is provided as a hobby project, "as is", without
        any warranty of fitness for a particular purpose.
      </p>

      <h2 className="text-xl font-black mt-6 mb-2">Acceptable use</h2>
      <p>You agree not to:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Attempt to disrupt, overload, or interfere with the site or its hosting.</li>
        <li>
          Reverse-engineer or scrape the site for the purpose of redistributing the puzzles
          as a competing product.
        </li>
        <li>Use the site in any way that would violate any applicable law.</li>
      </ul>
      <p>
        You may absolutely share your daily-challenge results, link to the site, or play it
        as much as you like.
      </p>

      <h2 className="text-xl font-black mt-6 mb-2">Intellectual property</h2>
      <p>
        The site&apos;s code, design, and branding are the property of the site&apos;s author.
        You may not copy or republish the site or substantial portions of it without
        permission. The English-language word lists used in puzzles are based on common public
        vocabulary and are not claimed as proprietary content.
      </p>

      <h2 className="text-xl font-black mt-6 mb-2">No warranty</h2>
      <p>
        The site is provided "as is" and "as available", without warranties of any kind,
        express or implied. We do not guarantee that the site will be uninterrupted, error-
        free, or that any specific puzzle, streak, or stat will be preserved.
      </p>

      <h2 className="text-xl font-black mt-6 mb-2">Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, the site&apos;s author is not liable for any
        indirect, incidental, special, or consequential damages arising out of your use of
        (or inability to use) the site.
      </p>

      <h2 className="text-xl font-black mt-6 mb-2">Changes</h2>
      <p>
        We may update these Terms from time to time. The "Last updated" date at the top of
        this page reflects the most recent change. Continued use of the site after a change
        constitutes acceptance of the updated Terms.
      </p>

      <h2 className="text-xl font-black mt-6 mb-2">Contact</h2>
      <p>
        For questions about these Terms, see the
        <a href="/about" className="text-primary font-bold hover:underline"> About</a> page.
      </p>
    </LegalPage>
  );
}
