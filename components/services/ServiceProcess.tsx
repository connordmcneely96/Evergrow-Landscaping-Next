interface ProcessStep {
  title: string
  description: string
}

interface ServiceProcessProps {
  heading?: string
  lead?: string
  steps: ProcessStep[]
}

export function ServiceProcess({
  heading = 'How Our Process Works',
  lead = 'Clear steps, steady communication, and a finished result you can feel proud of.',
  steps,
}: ServiceProcessProps) {
  return (
    <section className="section">
      <div className="container">
        <div className="max-w-3xl mb-12">
          <h2 className="text-h2 font-heading text-forest-green mb-4">{heading}</h2>
          <p className="text-lg text-gray-600">{lead}</p>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step, index) => (
            <li key={step.title} className="card">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-vibrant-gold">
                  Step {index + 1}
                </span>
                <span className="text-xs uppercase tracking-wide text-gray-400">
                  Evergreen Process
                </span>
              </div>
              <h3 className="text-lg font-semibold text-forest-green mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 mb-0">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
