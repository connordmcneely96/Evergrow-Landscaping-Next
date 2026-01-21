interface FAQItem {
  question: string
  answer: string
}

interface ServiceFAQProps {
  heading?: string
  lead?: string
  items: FAQItem[]
}

export function ServiceFAQ({
  heading = 'Frequently Asked Questions',
  lead = 'Clear answers to the questions we hear most often.',
  items,
}: ServiceFAQProps) {
  return (
    <section className="section">
      <div className="container">
        <div className="max-w-3xl mb-12">
          <h2 className="text-h2 font-heading text-forest-green mb-4">{heading}</h2>
          <p className="text-lg text-gray-600">{lead}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => (
            <div key={item.question} className="card h-full">
              <h3 className="text-lg font-semibold text-forest-green mb-2">
                {item.question}
              </h3>
              <p className="text-gray-600 mb-0">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
