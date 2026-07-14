const PAPERPMF_URL =
  'https://paperpmf.com/?utm_source=forensic-sketch-ai&utm_medium=referral&utm_campaign=paperpmf_crosspromo_2026&utm_content=experiment_case_file#diagnostic-intake'

export default function PaperPmfPromo() {
  return (
    <aside
      aria-labelledby="paperpmf-promo-heading"
      className="rounded-lg border border-blue-200 border-l-4 border-l-blue-600 bg-blue-50 p-5 shadow-sm"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div
          aria-hidden="true"
          className="hidden h-14 w-24 shrink-0 items-end justify-center gap-1.5 rounded-md border border-blue-200 bg-white/70 px-3 py-2 md:flex"
        >
          <span className="h-2 w-2 rounded-sm bg-blue-300" />
          <span className="h-4 w-2 rounded-sm bg-blue-400" />
          <span className="h-7 w-2 rounded-sm bg-blue-600" />
          <span className="h-5 w-2 rounded-sm bg-blue-500" />
          <span className="h-3 w-2 rounded-sm bg-blue-400" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
            NEW EXPERIMENT / PAPERPMF
          </p>
          <h2
            id="paperpmf-promo-heading"
            className="mt-1 text-lg font-semibold text-gray-900"
          >
            Product → reactions → purchase-intent signal.
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Preview a product concept with 10 synthetic respondents, free.
          </p>
        </div>

        <a
          href={PAPERPMF_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Run the PaperPMF diagnostic (opens in a new tab)"
          className="inline-flex min-h-[44px] w-full shrink-0 items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 md:w-auto"
        >
          Run diagnostic ↗
        </a>
      </div>
    </aside>
  )
}
